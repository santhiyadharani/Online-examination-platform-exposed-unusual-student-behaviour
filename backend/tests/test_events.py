import pytest
from backend.services.event_generator import event_generator
from backend.services.failure_injector import failure_injector
from backend.services.event_processor import event_processor

sample_session = {
    "session_id": "SES-SYN-000001",
    "student_id": "STU-SYN-000001",
    "exam_id": "EXM-SYN-000001",
    "exam_start_time": "2026-08-11 10:00:00",
    "allotted_duration_min": 90
}

def test_duplicate_event():
    evts = event_generator.generate_events_for_session(sample_session, n_questions=3)
    inj = failure_injector.inject_failures(evts, duplicate_rate=1.0, delay_rate=0, out_of_order_rate=0, network_failure_rate=0)
    replay = event_processor.replay_events(inj["arrival_sequence"])
    assert replay["duplicate_ignored_count"] > 0
    assert replay["corrupted_states_count"] == 0

def test_delayed_event():
    evts = event_generator.generate_events_for_session(sample_session, n_questions=3)
    inj = failure_injector.inject_failures(evts, delay_rate=1.0, duplicate_rate=0, out_of_order_rate=0)
    replay = event_processor.replay_events(inj["arrival_sequence"])
    assert replay["recovery_rate_pct"] == 100.0

def test_out_of_order_event():
    evts = event_generator.generate_events_for_session(sample_session, n_questions=5)
    inj = failure_injector.inject_failures(evts, out_of_order_rate=0.5, delay_rate=0, duplicate_rate=0)
    replay = event_processor.replay_events(inj["arrival_sequence"])
    assert replay["corrupted_states_count"] == 0

def test_reconnect():
    evts = event_generator.generate_events_for_session(sample_session, n_questions=3)
    inj = failure_injector.inject_failures(evts, network_failure_rate=1.0)
    types = [e["event_type"] for e in inj["arrival_sequence"]]
    assert "NETWORK_DISCONNECTED" in types
    assert "NETWORK_RECONNECTED" in types

def test_repeated_submission():
    evts = event_generator.generate_events_for_session(sample_session, n_questions=2)
    # duplicate EXAM_SUBMITTED
    submit_evt = [e for e in evts if e["event_type"] == "EXAM_SUBMITTED"][0]
    evts.append(submit_evt)
    replay = event_processor.replay_events(evts)
    assert replay["duplicate_ignored_count"] >= 1
    assert replay["final_session_state"] in ["SUBMITTED", "COMPLETED"]
