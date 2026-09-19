"""
Aashi voice trainer / runtime reference.

The web app uses the same selection strategy in browser speech synthesis:
prefer an Indian locale and a female/Indian voice. This Python module is useful
when running Aashi locally on Windows and gives SAPI/pyttsx3 the same policy.
"""

from __future__ import annotations

import os
from typing import Any, Optional


INDIAN_FEMALE_HINTS = (
    "heera",
    "swara",
    "kalpana",
    "neerja",
    "veena",
    "female",
    "hindi india",
    "india female",
    "en-in",
)


def _voice_description(voice: Any) -> str:
    for attr in ("name", "id"):
        value = getattr(voice, attr, "")
        if value:
            return str(value).lower()
    try:
        return str(voice).lower()
    except Exception:
        return ""


def choose_indian_female_voice(voices: list[Any]) -> Optional[Any]:
    """Choose an Indian female voice, preferring known Indian female names."""
    if not voices:
        return None

    def score(voice: Any) -> int:
        text = _voice_description(voice)
        value = 0
        if any(hint in text for hint in INDIAN_FEMALE_HINTS):
            value += 100
        if "heera" in text or "swara" in text or "kalpana" in text:
            value += 50
        if "india" in text or "in)" in text or "hi-in" in text or "en-in" in text:
            value += 30
        if "female" in text:
            value += 20
        return value

    return max(voices, key=score)


def create_speaker() -> Optional[Any]:
    """
    Return a configured Windows SAPI speaker when available.

    pywin32 is preferred because it exposes SAPI voice metadata directly.
    pyttsx3 is the cross-platform fallback.
    """
    try:
        import win32com.client  # type: ignore

        speaker = win32com.client.Dispatch("SAPI.SpVoice")
        voices = [speaker.GetVoices().Item(i) for i in range(speaker.GetVoices().Count)]
        selected = choose_indian_female_voice(voices)
        if selected is not None:
            speaker.Voice = selected
        speaker.Rate = -1
        speaker.Volume = 100
        return speaker
    except Exception:
        pass

    try:
        import pyttsx3  # type: ignore

        engine = pyttsx3.init()
        voices = engine.getProperty("voices") or []
        selected = choose_indian_female_voice(list(voices))
        if selected is not None:
            engine.setProperty("voice", selected.id)
        engine.setProperty("rate", 155)
        engine.setProperty("volume", 1.0)
        return engine
    except Exception:
        return None


def speak(text: str) -> bool:
    """Speak text using the selected Indian female voice when installed."""
    if not text or not text.strip():
        return False

    speaker = create_speaker()
    if speaker is None:
        return False

    try:
        # SAPI.SpVoice and pyttsx3 expose different playback APIs.
        if hasattr(speaker, "Speak"):
            speaker.Speak(text.strip())
        else:
            speaker.say(text.strip())
            speaker.runAndWait()
        return True
    except Exception:
        return False


if __name__ == "__main__":
    print("Aashi Indian female voice trainer/runtime")
    ok = speak("Namaste! Main Aashi hoon. Main aapki kheti aur BRIDGE ke kaam mein madad kar sakti hoon.")
    print("Voice test:", "OK" if ok else "No compatible Indian female voice/runtime found.")
