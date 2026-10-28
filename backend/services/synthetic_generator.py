import os
import random
import datetime
import pandas as pd
import numpy as np
from .dataset_profiler import profiler
from .behaviour_generator import BEHAVIOUR_PROFILES

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
GEN_CSV_PATH = os.path.join(BASE_DIR, "data", "generated", "generated_exam_behaviour.csv")

class ProposedSyntheticGenerator:
    def __init__(self, seed=42):
        self.seed = seed

    def generate(self, n_records=5000, profile_distribution=None):
        random.seed(self.seed)
        np.random.seed(self.seed)

        # Load reference profile to learn distributions
        ref_profile = profiler.generate_profile()
        num_stats = ref_profile.get("numeric_stats", {})

        exams = [f"EXM-SYN-{i:04d}" for i in range(1, 21)]
        rows = []

        # Profile selection distribution
        profiles = ["NORMAL", "FAST", "SLOW", "NETWORK_UNSTABLE", "SUSPICIOUS", "HIGHLY_UNUSUAL"]
        weights = [0.65, 0.10, 0.10, 0.05, 0.07, 0.03]

        for i in range(1, n_records + 1):
            stu_id = f"STU-SYN-{i:06d}"
            exam_id = random.choice(exams)
            ses_id = f"SES-SYN-{i:06d}"

            prof_name = np.random.choice(profiles, p=weights)
            prof = BEHAVIOUR_PROFILES[prof_name]

            # Allotted duration
            allotted = int(np.random.choice([60, 90, 120], p=[0.35, 0.35, 0.30]))

            # Conditional generation based on profile
            if prof_name in ["NORMAL", "FAST", "SLOW"]:
                is_unusual = 1 if random.random() < 0.02 else 0
                actual = round(float(allotted * random.uniform(0.72, 0.98)), 1)
                tab_switches = int(np.random.poisson(lam=1.1))
                copy_paste = int(np.random.poisson(lam=0.3))
                right_clicks = int(np.random.poisson(lam=0.4))
                mouse_idle = round(float(np.random.exponential(scale=40.0)), 1)
                keystroke_rate = round(float(np.random.normal(loc=3.2, scale=0.6)), 2)
                keystroke_rate = max(0.5, min(6.0, keystroke_rate))
                multiple_logins = 1 if random.random() < 0.03 else 0
                multiple_device = True if random.random() < 0.03 else False
                face_not_detected = round(float(np.random.exponential(scale=2.0)), 1)
                face_not_detected = min(prof["face_not_detected_max"], face_not_detected)
                answer_changes = int(np.random.poisson(lam=1.6))
                avg_q_time = round(float(np.random.normal(loc=65.0, scale=15.0)), 1)
                avg_q_time = max(15.0, min(130.0, avg_q_time))
                std_q_time = round(float(avg_q_time * random.uniform(0.3, 0.6)), 1)
                score = round(float(np.random.normal(loc=68.0, scale=14.0)), 1)
                score = max(20.0, min(100.0, score))
                flagged_reasons = ""
            else: # SUSPICIOUS / HIGHLY_UNUSUAL / NETWORK_UNSTABLE
                is_unusual = 1
                actual = round(float(min(126.0, allotted * random.uniform(0.5, 1.05))), 1)
                tab_switches = int(np.random.exponential(scale=prof["tab_switches_mean"]) + 5)
                copy_paste = int(np.random.exponential(scale=prof["copy_paste_mean"]) + 2)
                right_clicks = int(np.random.poisson(lam=3.5))
                mouse_idle = round(float(np.random.uniform(60.0, 310.0)), 1)
                keystroke_rate = round(float(np.random.uniform(0.2, 1.6)), 2)
                multiple_logins = int(np.random.choice([1, 2, 3, 4], p=[0.4, 0.3, 0.2, 0.1]))
                multiple_device = True if random.random() < 0.6 else False
                face_not_detected = round(float(np.random.uniform(12.0, prof["face_not_detected_max"])), 1)
                answer_changes = int(np.random.randint(5, 18))
                avg_q_time = round(float(np.random.uniform(5.0, 45.0)), 1)
                std_q_time = round(float(np.random.uniform(2.0, 25.0)), 1)
                score = round(float(np.random.uniform(70.0, 100.0)), 1)

                reasons = []
                if tab_switches > 10:
                    reasons.append("excessive_tab_switching")
                if copy_paste > 4:
                    reasons.append("high_copy_paste")
                if face_not_detected > 15.0:
                    reasons.append("face_not_detected")
                if multiple_device:
                    reasons.append("multiple_devices")
                if not reasons:
                    reasons.append("anomalous_timing")
                flagged_reasons = ";".join(reasons)

            # Start time
            day = random.choice([10, 11, 12])
            hour = random.randint(7, 21)
            minute = random.randint(0, 59)
            start_dt = datetime.datetime(2026, 8, day, hour, minute, 0)
            start_str = start_dt.strftime("%Y-%m-%d %H:%M:%S")

            end_dt = start_dt + datetime.timedelta(minutes=actual)
            end_str = end_dt.strftime("%Y-%m-%d %H:%M:%S")

            # Privacy-First Synthetic IP and Device Fingerprint Generation
            ip_addr = f"10.200.{random.randint(1, 50)}.{random.randint(1, 254)}"
            dev_fp = f"SYN-DEV-{random.getrandbits(32):08x}"

            rows.append({
                "student_id": stu_id,
                "exam_id": exam_id,
                "session_id": ses_id,
                "exam_start_time": start_str,
                "exam_end_time": end_str,
                "allotted_duration_min": allotted,
                "actual_duration_min": actual,
                "num_tab_switches": tab_switches,
                "num_copy_paste_events": copy_paste,
                "num_right_clicks": right_clicks,
                "mouse_idle_time_sec": mouse_idle,
                "avg_keystroke_rate_per_sec": keystroke_rate,
                "num_multiple_logins": multiple_logins,
                "multiple_device_flag": multiple_device,
                "face_not_detected_pct": face_not_detected,
                "answer_change_frequency": answer_changes,
                "avg_time_per_question_sec": avg_q_time,
                "std_time_per_question_sec": std_q_time,
                "ip_address": ip_addr,
                "device_fingerprint": dev_fp,
                "final_score": score,
                "is_unusual_behaviour": is_unusual,
                "flagged_reasons": flagged_reasons
            })

        df_gen = pd.DataFrame(rows)
        os.makedirs(os.path.dirname(GEN_CSV_PATH), exist_ok=True)
        df_gen.to_csv(GEN_CSV_PATH, index=False)
        return df_gen

proposed_gen = ProposedSyntheticGenerator()
