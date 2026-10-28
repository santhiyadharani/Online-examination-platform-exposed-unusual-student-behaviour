import random
import datetime
import numpy as np

BEHAVIOUR_PROFILES = {
    "NORMAL": {
        "tab_switches_mean": 1.5,
        "copy_paste_mean": 0.3,
        "face_not_detected_max": 5.0,
        "unusual_probability": 0.02,
        "keystroke_rate_mean": 3.4,
        "network_drop_prob": 0.01,
        "description": "Typical student behaviour with low unusual activity and stable network."
    },
    "FAST": {
        "tab_switches_mean": 1.0,
        "copy_paste_mean": 0.2,
        "face_not_detected_max": 3.0,
        "unusual_probability": 0.01,
        "keystroke_rate_mean": 4.5,
        "network_drop_prob": 0.01,
        "description": "Rapid navigation, fast keystroke rates, and early completion."
    },
    "SLOW": {
        "tab_switches_mean": 1.2,
        "copy_paste_mean": 0.1,
        "face_not_detected_max": 4.0,
        "unusual_probability": 0.03,
        "keystroke_rate_mean": 2.1,
        "network_drop_prob": 0.02,
        "description": "High time per question, longer idle periods, late completion."
    },
    "NETWORK_UNSTABLE": {
        "tab_switches_mean": 2.5,
        "copy_paste_mean": 0.5,
        "face_not_detected_max": 8.0,
        "unusual_probability": 0.15,
        "keystroke_rate_mean": 2.8,
        "network_drop_prob": 0.45,
        "description": "Frequent disconnects, reconnects, delayed submissions, retries."
    },
    "SUSPICIOUS": {
        "tab_switches_mean": 12.0,
        "copy_paste_mean": 5.0,
        "face_not_detected_max": 25.0,
        "unusual_probability": 0.75,
        "keystroke_rate_mean": 1.2,
        "network_drop_prob": 0.05,
        "description": "Elevated tab switching, copy-pasting, multiple logins, or face absences."
    },
    "HIGHLY_UNUSUAL": {
        "tab_switches_mean": 18.0,
        "copy_paste_mean": 8.0,
        "face_not_detected_max": 50.0,
        "unusual_probability": 0.98,
        "keystroke_rate_mean": 0.6,
        "network_drop_prob": 0.30,
        "description": "Extreme behavior, multiple devices, heavy tab switching & high copy-paste."
    }
}

def sample_profile(profile_type="NORMAL", seed=42):
    np.random.seed(seed)
    random.seed(seed)
    prof = BEHAVIOUR_PROFILES.get(profile_type, BEHAVIOUR_PROFILES["NORMAL"])
    
    is_unusual = 1 if random.random() < prof["unusual_probability"] else 0
    return {
        "profile_type": profile_type,
        "is_unusual_behaviour": is_unusual,
        "description": prof["description"]
    }
