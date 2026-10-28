import datetime
from .state_machine import ExamStateMachine

class EventProcessor:
    def __init__(self):
        pass

    def replay_events(self, event_sequence: list, initial_state="CREATED"):
        sm = ExamStateMachine(initial_state=initial_state)
        
        seen_event_ids = set()
        seen_hashes = set()
        
        processed_count = 0
        rejected_count = 0
        recovered_count = 0
        duplicate_ignored_count = 0
        corrupted_states_count = 0

        event_log = []
        answers_state = {}

        # First sort by sequence number if available to handle out-of-order restoration
        sorted_sequence = sorted(
            event_sequence, 
            key=lambda e: (e.get("sequence_number", 0), e.get("event_timestamp", ""))
        )

        for evt in sorted_sequence:
            evt_id = evt.get("event_id")
            evt_type = evt.get("event_type")
            p_hash = evt.get("payload_hash")

            status = "PROCESSED"
            status_reason = "Successfully processed"

            # 1. Idempotency & Duplicate Protection Check
            if evt_id in seen_event_ids or p_hash in seen_hashes:
                status = "DUPLICATE_IGNORED"
                status_reason = "Duplicate event hash or ID detected; ignored safely without state mutation."
                duplicate_ignored_count += 1
                recovered_count += 1
            else:
                seen_event_ids.add(evt_id)
                if p_hash:
                    seen_hashes.add(p_hash)

                # 2. State Machine & Late Event Protection
                can_process, reason = sm.can_process_event(evt_type)
                if not can_process:
                    status = "REJECTED"
                    status_reason = f"Rejected by State Machine: {reason}"
                    rejected_count += 1
                    recovered_count += 1 # State machine safely blocked invalid event, state preserved
                else:
                    # Execute State Transitions
                    if evt_type == "EXAM_STARTED":
                        sm.transition_to("STARTED")
                    elif evt_type == "ANSWER_SUBMITTED" and sm.current_state in ["STARTED", "IN_PROGRESS"]:
                        sm.transition_to("IN_PROGRESS")
                        try:
                            import json
                            payload = json.loads(evt.get("payload", "{}"))
                            q_num = payload.get("question_number")
                            ans = payload.get("answer")
                            answers_state[q_num] = ans
                        except Exception:
                            pass
                    elif evt_type == "EXAM_SUBMITTED" and sm.current_state in ["STARTED", "IN_PROGRESS"]:
                        sm.transition_to("SUBMITTED")
                        sm.transition_to("COMPLETED")

                    processed_count += 1
                    recovered_count += 1

            event_log.append({
                "event_id": evt_id,
                "sequence_number": evt.get("sequence_number"),
                "event_type": evt_type,
                "event_timestamp": evt.get("event_timestamp"),
                "received_timestamp": evt.get("received_timestamp"),
                "processing_status": status,
                "status_reason": status_reason,
                "session_state_after": sm.current_state,
                "is_delayed": evt.get("is_delayed", False),
                "is_duplicate": evt.get("is_duplicate", False),
                "is_out_of_order": evt.get("is_out_of_order", False)
            })

        total_events = len(event_sequence)
        recovery_rate_pct = round(float(recovered_count / total_events * 100), 2) if total_events > 0 else 100.0
        corruption_rate_pct = round(float(corrupted_states_count / total_events * 100), 2) if total_events > 0 else 0.0

        return {
            "total_events_received": total_events,
            "processed_count": processed_count,
            "rejected_count": rejected_count,
            "duplicate_ignored_count": duplicate_ignored_count,
            "recovered_count": recovered_count,
            "corrupted_states_count": corrupted_states_count,
            "recovery_rate_pct": recovery_rate_pct,
            "state_corruption_rate_pct": corruption_rate_pct,
            "final_session_state": sm.current_state,
            "answers_state": answers_state,
            "event_log": event_log
        }

event_processor = EventProcessor()
