"""Event Generator module.
Provides utilities to synthesize exam interaction events for a session.
"""
import random
import datetime
import hashlib
import json

EVENT_TYPES = [
    "LOGIN",
    "EXAM_STARTED",
    "QUESTION_VIEWED",
    "ANSWER_SUBMITTED",
    "ANSWER_UPDATED",
    "QUESTION_SKIPPED",
    "HEARTBEAT",
    "NETWORK_DISCONNECTED",
    "NETWORK_RECONNECTED",
    "EXAM_SUBMITTED",
    "LOGOUT"
]

class EventGenerator:
    def __init__(self, seed=42):
        self.seed = seed

    def generate_events_for_session(self, session_data: dict, n_questions=10):
        session_id = session_data.get("session_id", "SES-SYN-000001")
        student_id = session_data.get("student_id", "STU-SYN-000001")
        exam_id = session_data.get("exam_id", "EXM-SYN-000001")
        
        start_str = session_data.get("exam_start_time", "2026-08-11 10:00:00")
        try:
            curr_time = datetime.datetime.strptime(start_str, "%Y-%m-%d %H:%M:%S")
        except Exception:
            curr_time = datetime.datetime.utcnow()

        events = []
        seq = 1

        # helper function to append event
        def add_evt(evt_type, payload_dict, delta_sec=2):
            nonlocal seq, curr_time
            curr_time += datetime.timedelta(seconds=delta_sec)
            evt_id = f"EVT-{session_id[-6:]}-{seq:04d}"
            
            payload_str = json.dumps(payload_dict, sort_keys=True)
            p_hash = hashlib.sha256(f"{evt_id}:{session_id}:{evt_type}:{payload_str}".encode()).hexdigest()[:16]

            evt = {
                "event_id": evt_id,
                "session_id": session_id,
                "student_id": student_id,
                "exam_id": exam_id,
                "event_type": evt_type,
                "sequence_number": seq,
                "event_timestamp": curr_time.strftime("%Y-%m-%d %H:%M:%S"),
                "received_timestamp": curr_time.strftime("%Y-%m-%d %H:%M:%S"),
                "payload": payload_str,
                "payload_hash": p_hash,
                "processing_status": "PROCESSED"
            }
            events.append(evt)
            seq += 1

        # Workflow creation
        add_evt("LOGIN", {"action": "user_login", "device": session_data.get("device_fingerprint", "SYN-DEV-001")}, delta_sec=0)
        add_evt("EXAM_STARTED", {"action": "start_exam", "allotted_min": session_data.get("allotted_duration_min", 90)}, delta_sec=5)

        # Questions walkthrough
        for q_num in range(1, n_questions + 1):
            add_evt("QUESTION_VIEWED", {"question_number": q_num}, delta_sec=random.randint(3, 10))
            
            # Simulated actions
            if random.random() < 0.8:
                ans = random.choice(["A", "B", "C", "D"])
                add_evt("ANSWER_SUBMITTED", {"question_number": q_num, "answer": ans}, delta_sec=random.randint(10, 45))
                
                # Answer update
                if random.random() < 0.2:
                    ans_new = random.choice(["A", "B", "C", "D"])
                    add_evt("ANSWER_UPDATED", {"question_number": q_num, "old_answer": ans, "new_answer": ans_new}, delta_sec=random.randint(5, 20))
            else:
                add_evt("QUESTION_SKIPPED", {"question_number": q_num, "reason": "user_skipped"}, delta_sec=random.randint(2, 8))

            # Periodic Heartbeat
            if q_num % 3 == 0:
                add_evt("HEARTBEAT", {"tab_switches": session_data.get("num_tab_switches", 0), "status": "active"}, delta_sec=15)

        # Network disconnect/reconnect check if unstable
        if session_data.get("is_unusual_behaviour", 0) and random.random() < 0.5:
            add_evt("NETWORK_DISCONNECTED", {"reason": "ping_timeout"}, delta_sec=10)
            add_evt("NETWORK_RECONNECTED", {"latency_ms": 140}, delta_sec=25)

        add_evt("EXAM_SUBMITTED", {"total_answered": n_questions - 1, "final_action": "user_submit"}, delta_sec=10)
        add_evt("LOGOUT", {"action": "session_close"}, delta_sec=2)

        return events

event_generator = EventGenerator()
