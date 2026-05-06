def get_recommendation(risk: str) -> str:
    recs = {
        "Normal":    "Maintain healthy diet, drink enough water, 30 min walking daily.",
        "Alert":     "Reduce salt intake, avoid junk food, daily exercise recommended.",
        "Warning":   "Monitor BP twice daily, avoid stress, consult doctor within 48 hours.",
        "Emergency": "Immediate hospital visit required. Avoid any physical exertion.",
    }
    return recs.get(risk.strip().capitalize(), "Consult a medical professional.")