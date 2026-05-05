from typing import Dict
import requests


def run_transformer_insights(dpp_payload: dict) -> Dict[str, str]:
    user_message = dpp_payload.get("message", "")

    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "mistral",
            "prompt": (
                "You are an expert in Digital Product Passport (DPP) and ESPR regulation. "
                "Your answers must be precise, regulatory-aligned, and not generic. "
                "Focus on key ESPR concepts such as substances of concern, durability, "
                "repairability, energy performance, and lifecycle data. "
                "Always clarify that requirements depend on product category and delegated acts. "
                "Use the exact term 'Ecodesign for Sustainable Products Regulation (ESPR)'. "
                "Do not call it European Sustainable Product Policy. "
                "Avoid adding social or labor requirements unless the user explicitly asks. "
                "Do not cite regulation numbers unless you are certain. "
                "Avoid inventing legal references."
                "Avoid including irrelevant frameworks unless explicitly asked.\n\n"
                f"Question: {user_message}"
            ),
            "stream": False
        }
    )

    data = response.json()

    return {
        "status": "ok",
        "message": user_message,
        "answer": data.get("response", "")
    }