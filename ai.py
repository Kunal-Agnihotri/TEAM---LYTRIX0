import os
import json
import time
import subprocess
import re
from gtts import gTTS

# Uses the enriched knowledge base first; automatically falls back to the old file.
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_FILE = os.path.join(BASE_DIR, "agriculture_data_enriched.json")
LEGACY_DATA_FILE = os.path.join(BASE_DIR, "agriculture_data.json")


def load_knowledge_base():
    # Keep the original loading behaviour, but prefer the new data file.
    for data_file in (DATA_FILE, LEGACY_DATA_FILE):
        if os.path.exists(data_file):
            try:
                with open(data_file, "r", encoding="utf-8") as file:
                    return json.load(file)
            except Exception:
                pass
    return {}


KNOWLEDGE_BASE = load_knowledge_base()

SUPPORTED_LANGUAGES = {
    "1": {"name": "English (Indian Accent)", "code": "en", "tld": "co.in"},
    "2": {"name": "Hindi (हिंदी)", "code": "hi", "tld": "co.in"},
    "3": {"name": "Marathi (मराठी)", "code": "mr", "tld": "co.in"},
    "4": {"name": "Punjabi (ਪੰਜਾਬੀ)", "code": "pa", "tld": "co.in"},
    "5": {"name": "Tamil (தமிழ்)", "code": "ta", "tld": "co.in"},
    "6": {"name": "Telugu (తెలుగు)", "code": "te", "tld": "co.in"},
    "7": {"name": "Malayalam (മലയാളം)", "code": "ml", "tld": "co.in"}
}


def speak_response(text, lang_code, tld_domain):
    audio_filename = "response.mp3"
    try:
        if os.path.exists(audio_filename):
            try:
                os.remove(audio_filename)
            except PermissionError:
                pass

        time.sleep(0.2)
        n_words = len(text.split())
        n_speech_time = max(4, int(n_words * 0.45) + 2)

        tts_engine = gTTS(text=text, lang=lang_code, tld=tld_domain, slow=False)
        tts_engine.save(audio_filename)

        file_path = os.path.abspath(audio_filename)
        powershell_script = f"""
        Add-Type -AssemblyName presentationCore
        $player = New-Object System.Windows.Media.MediaPlayer
        $player.Open('{file_path}')
        $player.Play()
        Start-Sleep -Seconds {n_speech_time}
        """

        subprocess.Popen(
            ["powershell", "-WindowStyle", "Hidden", "-Command", powershell_script],
            creationflags=subprocess.CREATE_NO_WINDOW
        )
    except Exception:
        pass


# -----------------------------------------------------------------------------
# NEW KNOWLEDGE LAYER
# This does not replace the original workflow. It only lets the same workflow
# understand the additional multilingual data stored in the enriched JSON.
# -----------------------------------------------------------------------------

def _term_matches(text, term):
    """Match English keywords as words to avoid false hits such as rice in price."""
    term = str(term).strip().lower()
    if not term:
        return False
    if all(ord(ch) < 128 for ch in term):
        return re.search(r"(?<![a-z0-9])" + re.escape(term) + r"(?![a-z0-9])", text) is not None
    return term in text


def _contains_any(text, values):
    """Human-friendly keyword matching for short farmer questions."""
    return any(_term_matches(text, value) for value in values if value)


def _crop_match(query_text, language_data):
    """Find a crop from aliases, farmer queries or the crop key."""
    crop_data = language_data.get("crop_knowledge", {})
    for crop_key, crop in crop_data.items():
        terms = [crop_key, crop.get("name", "")]
        terms += crop.get("aliases", [])
        terms += crop.get("farmer_queries", [])
        if _contains_any(query_text, terms):
            return crop_key, crop
    return None, None


def _scheme_match(query_text, language_data):
    """Find a scheme using its localized name or farmer-friendly keywords."""
    schemes = language_data.get("government_schemes", [])
    for scheme in schemes:
        terms = [scheme.get("id", ""), scheme.get("name", "")]
        if _contains_any(query_text, terms):
            return scheme

    # The enriched JSON also contains language-specific farmer phrases.
    keywords = language_data.get("farmer_query_keywords", [])
    if _contains_any(query_text, keywords):
        # Only classify as a scheme when a scheme-related phrase is actually present.
        scheme_words = [
            "scheme", "yojana", "सरकारी योजना", "किसान योजना", "नई योजना",
            "फसल बीमा", "crop insurance", "kcc", "pm kisan", "pm-kisan",
            "pm kusum", "solar pump", "सोलर पंप", "किसान क्रेडिट कार्ड"
        ]
        if _contains_any(query_text, scheme_words):
            return schemes[0] if schemes else None
    return None


def _friendly_market_reply(query_text, language_data, crop_key, crop):
    """Return a simple explanation without inventing a live market price."""
    market_help = language_data.get("market_help", {})
    rate_explanations = language_data.get("rate_explanations", {})
    crop_name = crop.get("name", crop_key)

    # Explain MSP separately from live mandi price.
    if _contains_any(query_text, ["msp", "minimum support price", "न्यूनतम समर्थन मूल्य", "एमएसपी"]):
        return market_help.get(
            "msp_explain",
            "MSP is different from today's mandi price. I will show both separately."
        )

    # Explain market-price fields when asked what the numbers mean.
    if _contains_any(query_text, [
        "modal price", "modal rate", "मॉडल भाव", "मॉडल रेट",
        "minimum price", "min price", "न्यूनतम भाव",
        "maximum price", "max price", "अधिकतम भाव"
    ]):
        modal = rate_explanations.get("modal_price", "Most commonly reported trading price.")
        minimum = rate_explanations.get("min_price", "Minimum reported market price.")
        maximum = rate_explanations.get("max_price", "Maximum reported market price.")
        return f"{crop_name}: {minimum}; {maximum}; {modal}."

    # We intentionally do not manufacture a current price from static JSON.
    # The live value should come from the official market-data API later.
    return (
        f"{crop_name}: " + market_help.get(
            "ask_location",
            "Which market or district should I check?"
        )
    )


def _new_knowledge_response(query_text, language_data):
    """Handle new enriched JSON knowledge before the old fallback rules."""

    # 1) Government schemes / farmer support.
    scheme_query_words = [
        "scheme", "yojana", "सरकारी योजना", "किसान योजना", "नई योजना",
        "crop insurance", "फसल बीमा", "kcc", "pm kisan", "pm-kisan",
        "pm kusum", "solar pump", "सोलर पंप", "किसान क्रेडिट कार्ड",
        "पीक विमा", "शेतकरी योजना", "सरकारी योजना",
        "ਫਸਲ ਬੀਮਾ", "ਸਰਕਾਰੀ ਯੋਜਨਾ", "ਕਿਸਾਨ ਯੋਜਨਾ",
        "பயிர் காப்பீடு", "அரசு திட்டம்", "கிசான் கிரெடிட் கார்டு",
        "పంట బీమా", "ప్రభుత్వ పథకం", "కిసాన్ క్రెడిట్ కార్డు",
        "വിള ഇൻഷുറൻസ്", "സർക്കാർ പദ്ധതി", "കിസാൻ ക്രെഡിറ്റ് കാർഡ്"
    ]
    # Also use localized keywords from the JSON itself.
    if _contains_any(query_text, scheme_query_words) or _contains_any(
        query_text, language_data.get("farmer_query_keywords", [])
    ) and any(
        marker in query_text for marker in [
            "scheme", "yojana", "insurance", "बीमा", "योजना", "kcc", "pm kisan",
            "विमा", "ਯੋਜਨਾ", "ਬੀਮਾ", "திட்டம்", "காப்பீடு", "పథకం", "బీమా",
            "പദ്ധതി", "ഇൻഷുറൻസ്", "ക്രെഡിറ്റ്"
        ]
    ):
        schemes = language_data.get("government_schemes", [])
        if schemes:
            help_text = language_data.get("scheme_help", {}).get(
                "ask", "Tell me your state, crop and what help you need."
            )
            names = ", ".join(s.get("name", "") for s in schemes[:6])
            return f"{help_text}\nAvailable support includes: {names}."

    # 2) Market/rate questions using the new crop aliases and farmer phrases.
    crop_key, crop = _crop_match(query_text, language_data)
    market_words = language_data.get("farmer_query_keywords", [])
    market_words += [
        "rate", "price", "bhav", "भाव", "मूल्य", "mandi", "market",
        "msp", "modal", "minimum price", "maximum price", "आज", "today"
    ]
    if crop and _contains_any(query_text, market_words):
        return _friendly_market_reply(query_text, language_data, crop_key, crop)

    # 3) Generic market questions even when crop was not recognised.
    if _contains_any(query_text, [
        "today price", "today rate", "market price", "mandi rate", "mandi bhav",
        "aaj ka bhav", "aaj ka rate", "मंडी भाव", "आज का भाव", "फसल का भाव",
        "सरकारी भाव", "सरकारी रेट", "current market rate", "current price"
    ]):
        return language_data.get("market_help", {}).get(
            "ask_location", "Which market or district should I check?"
        )

    # 4) Selling/buyer discovery language from the enriched keyword set.
    if _contains_any(query_text, [
        "where should I sell", "find buyer", "buyer for my crop", "कहां बेचूं",
        "कहाँ बेचूं", "खरीदार चाहिए", "मेरी फसल कौन खरीदेगा"
    ]):
        return language_data.get("market_help", {}).get(
            "compare", "Would you like me to compare nearby markets?"
        )

    return None


def resolve_workflow_query(query, lang_code):
    query_text = query.lower()
    language_data = KNOWLEDGE_BASE.get(lang_code, KNOWLEDGE_BASE.get("en", {}))

    # NEW: use the enriched JSON first, while preserving the original stages below.
    enriched_reply = _new_knowledge_response(query_text, language_data)
    if enriched_reply:
        return enriched_reply

    # Stage 1: Authentication & Login
    if any(k in query_text for k in ["login", "otp", "auth", "register", "signin", "लॉगिन", "आईडी", "ओटीፒ", "లాగిన్", "ലോഗിൻ"]):
        return language_data.get("auth_login", "Please provide your login credentials.")

    # Stage 2: Dashboard & Produce Listing
    elif any(k in query_text for k in ["list", "produce", "crop", "sell", "quantity", "ग्रेड", "फसल", "बेचना", "பயிர்", "పంట", "വിള"]):
        return language_data.get("listing_prompt", "Please provide your crop details for listing.")

    # Stage 3: Rates, MSP & Benchmarks
    elif any(k in query_text for k in ["rate", "msp", "price", "bhav", "wheat", "paddy", "cotton", "soybean", "maize", "भाव", "मूल्य", "धान", "விலை", "ధర", "വില"]):
        return language_data.get("rates_header", "Here are the benchmark rates.")
    elif "paddy common" in query_text or "common paddy" in query_text or "सामान्य धान" in query_text or "സാധാരണ നെൽ" in query_text:
        return language_data.get("paddy_common", "₹2,441")
    elif "grade a" in query_text or "paddy grade a" in query_text or "ഗ്രേഡ്-ഏ" in query_text:
        return language_data.get("paddy_grade_a", "₹2,461")
    elif any(k in query_text for k in ["maize", "corn", "मक्का", "மக்காச்சோளம்", "మక్కజొన్న", "ചോളം"]):
        return language_data.get("maize", "₹2,410")
    elif any(k in query_text for k in ["bajra", "बाजरा", "கம்பு", "సజ్జలు", "കമ്പ്"]):
        return language_data.get("bajra", "₹2,900")
    elif any(k in query_text for k in ["ragi", "रागी", "റാഗി"]):
        return language_data.get("ragi", "₹5,205")
    elif any(k in query_text for k in ["tur", "arhar", "अरहर", "तूर", "துவரம்", "కందిపప్పు", "തുവര"]):
        return language_data.get("tur", "₹8,450")
    elif any(k in query_text for k in ["moong", "मूंग", "பாசிப்பயறு", "పెసరపప్పు", "ചെറുപയർ"]):
        return language_data.get("moong", "₹8,780")
    elif any(k in query_text for k in ["urad", "उड़द", "உளுந்து", "మినపప్పు", "ഉഴുന്ന്"]):
        return language_data.get("urad", "₹8,200")
    elif any(k in query_text for k in ["groundnut", "peanut", "मूंगफली", "நிலக்கடலை", "వేరుశెనగ", "നിലക്കടల"]):
        return language_data.get("groundnut", "₹7,517")
    elif any(k in query_text for k in ["soybean", "सोयाबीन", "சோயாபீன்", "సోయాబీన్", "സോയാബീൻ"]):
        return language_data.get("soybean", "₹5,708")
    elif "cotton medium" in query_text or "medium staple" in query_text or "പരുത്തി" in query_text:
        return language_data.get("cotton_medium", "₹8,267")
    elif "cotton long" in query_text or "long staple" in query_text:
        return language_data.get("cotton_long", "₹8,667")

    # Stage 4: Legal, Compliance & Bids
    elif any(k in query_text for k in ["bid", "offer", "buyer", "contract", "agreement", "बोली", "ऑफर", "करार", "ஏலம்", "బిడ్", "ബിഡ്ഡിംഗ്"]):
        return language_data.get("bids_received", "You have pending corporate bids to review.")

    # Stage 5: Logistics & Delivery
    elif any(k in query_text for k in ["logistics", "transport", "delivery", "truck", "pickup", "ट्रक", "गाड़ी", "रवाણા", "டிரக்", "ట్రాన్స్పోర్ట్", "വണ്ടി", "ലോജിസ്റ്റिक्स"]):
        return language_data.get("logistics_hub", "Please select your preferred transport option.")

    # Default Companion Catch-all (Respectful Partner Persona)
    else:
        return language_data.get("dashboard_home", "How may I further assist you with your farming workflow?")


def main():

    print("   AASHI : your friend   ")

    print("\nSelect Your Language:")
    for key, lang in SUPPORTED_LANGUAGES.items():
        print(f"[{key}] {lang['name']}")

    user_choice = input("\nSelect language code (1-7): ").strip()
    active_language = SUPPORTED_LANGUAGES.get(user_choice, SUPPORTED_LANGUAGES["1"])

    print(f"\nActive Language Connection: {active_language['name']}")

    intro_message = KNOWLEDGE_BASE.get(active_language['code'], {}).get(
        "friend_intro", "Namaste! I am your respectful digital partner."
    )
    print(f"\nDigital Partner: {intro_message}")
    speak_response(intro_message, active_language['code'], active_language['tld'])
    print("\nYou can now ask questions. Type 'exit' or press Ctrl+C to quit.")

    while True:
        try:
            user_query = input("\nUser > ").strip()
            if user_query:
                assistant_reply = resolve_workflow_query(user_query, active_language['code'])
                print(f"Digital Partner: {assistant_reply}")
                speak_response(assistant_reply, active_language['code'], active_language['tld'])
        except KeyboardInterrupt:
            print("\nExiting workflow. Namaste! ")
            break


if __name__ == "__main__":
    main()
