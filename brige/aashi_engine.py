"""
Aashi agriculture-grounded Python engine.

This module is intentionally small and deterministic: answers are based on the
bundled agriculture_data_enriched.json instead of inventing agricultural facts.
"""

from __future__ import annotations

import json
import os
from typing import Any

from aashi_trainer import speak


DATA_FILE = os.path.join(os.path.dirname(__file__), "agriculture_data_enriched.json")


def load_knowledge() -> dict[str, Any]:
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as file:
            return json.load(file)
    except (OSError, json.JSONDecodeError):
        return {}


KNOWLEDGE = load_knowledge()


def _normalise(text: str) -> str:
    return " ".join(text.lower().strip().split())


def process_query(query: str, language: str = "en") -> str:
    q = _normalise(query)

    if q in {"hi", "hello", "hey", "namaste", "sat sri akal"}:
        return (
            KNOWLEDGE.get(language, {}).get("greeting_response")
            or KNOWLEDGE.get("en", {}).get("greeting_response")
            or "Namaste! I am Aashi. How can I help with your agricultural work?"
        )

    crop_aliases = {
        "wheat": ("wheat", "गेहूं", "ਗੇਹੂੰ"),
        "paddy": ("paddy", "rice", "चावल", "धान", "ਝੋਨਾ"),
        "maize": ("maize", "corn", "मक्का", "ਮੱਕੀ"),
    }

    for key, aliases in crop_aliases.items():
        if any(alias.lower() in q for alias in aliases):
            crop = KNOWLEDGE.get("en", {}).get("crop_knowledge", {}).get(key)
            if crop:
                return (
                    f"{crop.get('name', key)} is in the BRIDGE agricultural knowledge base. "
                    f"The bundled dataset records an MSP reference of {crop.get('msp', 'not available')}."
                )

    if any(word in q for word in ("crop", "farming", "msp", "mandi", "price", "rate", "फसल", "खेती", "ਮੰਡੀ")):
        return (
            "I can answer from the bundled BRIDGE agriculture dataset. "
            "Ask me about wheat, paddy/rice, maize, or the MSP reference stored for them."
        )

    return (
        "I can help with agricultural questions using the bundled BRIDGE dataset. "
        "Please mention the crop and what you want to know."
    )


if __name__ == "__main__":
    response = process_query("What is the MSP reference for wheat?")
    print("Aashi:", response)
    speak(response)
