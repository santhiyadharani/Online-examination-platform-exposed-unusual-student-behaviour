import random
import copy
import datetime

class FailureInjector:
    def __init__(self, seed=42):
        self.seed = seed

    def inject_failures(
        self,
        events: list,
        delay_rate=0.10,
        duplicate_rate=0.05,
        out_of_order_rate=0.10,
        network_failure_rate=0.05,
        scenario_name="Mixed Failure"
    ):
        random.seed(self.seed)
        
        modified_events = []
        delayed_count = 0
        duplicate_count = 0
        out_of_order_count = 0
        network_failure_count = 0

        for idx, evt in enumerate(events):
            evt_copy = copy.deepcopy(evt)

            # 1. Inject Network Disconnect / Reconnect
            if random.random() < network_failure_rate and evt["event_type"] in ["ANSWER_SUBMITTED", "QUESTION_VIEWED"]:
                disc_evt = copy.deepcopy(evt_copy)
                disc_evt["event_type"] = "NETWORK_DISCONNECTED"
                disc_evt["event_id"] = f"{evt_copy['event_id']}-DISC"
                disc_evt["processing_status"] = "PROCESSED"
                modified_events.append(disc_evt)
                network_failure_count += 1

            # 2. Inject Delay
            if random.random() < delay_rate:
                try:
                    ts = datetime.datetime.strptime(evt_copy["event_timestamp"], "%Y-%m-%d %H:%M:%S")
                    rec_ts = ts + datetime.timedelta(seconds=random.randint(15, 180))
                    evt_copy["received_timestamp"] = rec_ts.strftime("%Y-%m-%d %H:%M:%S")
                    evt_copy["is_delayed"] = True
                    delayed_count += 1
                except Exception:
                    pass

            modified_events.append(evt_copy)

            # 3. Inject Duplicate
            if random.random() < duplicate_rate and evt["event_type"] in ["ANSWER_SUBMITTED", "EXAM_SUBMITTED"]:
                dup_evt = copy.deepcopy(evt_copy)
                dup_evt["is_duplicate"] = True
                modified_events.append(dup_evt)
                duplicate_count += 1

            # 4. Inject Network Reconnect
            if random.random() < network_failure_rate and evt["event_type"] in ["ANSWER_SUBMITTED", "QUESTION_VIEWED"]:
                rec_evt = copy.deepcopy(evt_copy)
                rec_evt["event_type"] = "NETWORK_RECONNECTED"
                rec_evt["event_id"] = f"{evt_copy['event_id']}-REC"
                rec_evt["processing_status"] = "PROCESSED"
                modified_events.append(rec_evt)

        # 5. Inject Out-of-Order shuffling
        n_mod = len(modified_events)
        if out_of_order_rate > 0 and n_mod > 4:
            n_swap = int(n_mod * out_of_order_rate / 2)
            for _ in range(n_swap):
                swap_idx = random.randint(1, n_mod - 3)
                modified_events[swap_idx], modified_events[swap_idx + 1] = (
                    modified_events[swap_idx + 1],
                    modified_events[swap_idx],
                )
                modified_events[swap_idx]["is_out_of_order"] = True
                out_of_order_count += 1

        return {
            "scenario_name": scenario_name,
            "events_generated": len(events),
            "modified_events_count": len(modified_events),
            "delayed_count": delayed_count,
            "duplicate_count": duplicate_count,
            "out_of_order_count": out_of_order_count,
            "network_failure_count": network_failure_count,
            "arrival_sequence": modified_events
        }

failure_injector = FailureInjector()
