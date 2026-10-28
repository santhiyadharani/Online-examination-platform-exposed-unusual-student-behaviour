"""Baseline Generator.
Generates deterministic synthetic exam data for benchmarking.
"""
import random
import datetime
import pandas as pd
import numpy as np
from faker import Faker

fake = Faker()

class BaselineGenerator:
    def __init__(self, seed=42):
        self.seed = seed

    def generate(self, n_records=1000):
        random.seed(self.seed)
        np.random.seed(self.seed)
        Faker.seed(self.seed)

        exams = [f"EXM10{i:02d}" for i in range(20)]
        rows = []

        for i in range(1, n_records + 1):
            student_id = f"STU_{fake.unique.random_number(digits=6)}"
            exam_id = random.choice(exams)
            session_id = fake.uuid4()[:10]

            day = random.randint(10, 12)
            hour = random.randint(8, 20)
            minute = random.randint(0, 59)
            start_dt = datetime.datetime(2026, 8, day, hour, minute, 0)
            start_str = start_dt.strftime("%Y-%m-%d %H:%M:%S")

            allotted = random.choice([60, 90, 120])
            actual = round(float(random.uniform(20.0, 130.0)), 1)
            end_dt = start_dt + datetime.timedelta(minutes=actual)
            end_str = end_dt.strftime("%Y-%m-%d %H:%M:%S")

            # Independent uniform / random sampling without conditional logic
            tab_switches = random.randint(0, 25)
            copy_paste = random.randint(0, 15)
            right_clicks = random.randint(0, 10)
            mouse_idle = round(float(random.uniform(0.0, 300.0)), 1)
            keystroke_rate = round(float(random.uniform(0.1, 5.0)), 2)
            multiple_logins = random.randint(0, 4)
            multiple_device = random.choice([True, False])
            face_not_detected = round(float(random.uniform(0.0, 60.0)), 1)
            answer_changes = random.randint(0, 15)
            avg_q_time = round(float(random.uniform(5.0, 120.0)), 1)
            std_q_time = round(float(random.uniform(1.0, 50.0)), 1)
            
            ip_addr = fake.ipv4()
            dev_fp = fake.hexify(text="^^^^^^^^^^^^")
            score = round(float(random.uniform(10.0, 100.0)), 1)
            is_unusual = random.choice([0, 1])
            flagged_reasons = "unusual_activity" if is_unusual else ""

            rows.append({
                "student_id": student_id,
                "exam_id": exam_id,
                "session_id": session_id,
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

        return pd.DataFrame(rows)

baseline_gen = BaselineGenerator()
