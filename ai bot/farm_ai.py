import os
import json
import time
import subprocess
from gtts import gTTS

DATA_FILE = "agriculture_data.json"

def load_knowledge_base():
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, "r", encoding="utf-8") as file:
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
    "6": {"name": "Telugu (తెలుగు)", "code": "te", "tld": "co.in"}
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
        
        # 1. Assign word count to n
        n_words = len(text.split())
        
        # 2. Assign dynamic speech time to n based on words (avg ~2.5 words per second, plus buffer)
        # When n == n, the sleep timer scales dynamically to match text length perfectly
        n_speech_time = max(4, int(n_words * 0.45) + 2)
        
        # Generates voice using the soothing Indian accent profile
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

def resolve_farmer_query(query, lang_code):
    query_text = query.lower()
    language_data = KNOWLEDGE_BASE.get(lang_code, KNOWLEDGE_BASE.get("en", {}))
    
    if any(k in query_text for k in ["msp", "price", "rate", "bhav", "wheat", "paddy", "cotton", "mustard", "भाव", "मूल्य", "गेहूं", "धान", "விலை", "ధర"]):
        return language_data.get("rates", language_data.get("msp", "Current market pricing data is available."))
    elif any(k in query_text for k in ["scheme", "yojana", "pm-kisan", "insurance", "loan", "योजना", "बीमा", "கடன்", "పథకం"]):
        return language_data.get("schemes", "Government welfare schemes are active.")
    elif any(k in query_text for k in ["bid", "offer", "buyer", "बोली", "ऑफर"]):
        return language_data.get("bids", "You have pending corporate bids.")
    elif any(k in query_text for k in ["hello", "hi", "hey", "नमस्ते", "नमस्कार", "வணக்கம்", "నమస్కారం"]):
        return language_data.get("greeting", "Hello! How can I help you?")
    else:
        return language_data.get("msp", "I can help you with crop rates, market benchmarks, and government schemes.")

def main():
    print("your own friend")
    
    print("Language:")
    for key, lang in SUPPORTED_LANGUAGES.items():
        print(f"[{key}] {lang['name']}")
        
    user_choice = input("\nSelect language (1-6): ").strip()
    active_language = SUPPORTED_LANGUAGES.get(user_choice, SUPPORTED_LANGUAGES["1"])
    
    print(f"\nActive: {active_language['name']}")
    
    welcome_message = KNOWLEDGE_BASE.get(active_language['code'], {}).get(
        "greeting", "Hello! How can I help you today?"
    )
    print(f"Bot: {welcome_message}")
    speak_response(welcome_message, active_language['code'], active_language['tld'])
    
    print("\nType your query below (Ctrl+C to exit):")
    
    while True:
        try:
            user_query = input("\n> ").strip()
            if user_query:
                assistant_reply = resolve_farmer_query(user_query, active_language['code'])
                print(f"Bot: {assistant_reply}")
                speak_response(assistant_reply, active_language['code'], active_language['tld'])
        except KeyboardInterrupt:
            print("\nExiting. Ram Ram! 🙏")
            break

if __name__ == "__main__":
    main()