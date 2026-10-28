import pytest
from backend.services.state_machine import ExamStateMachine

def test_valid_transition():
    sm = ExamStateMachine(initial_state="CREATED")
    ok, msg = sm.transition_to("STARTED")
    assert ok is True
    assert sm.current_state == "STARTED"

    ok, msg = sm.transition_to("IN_PROGRESS")
    assert ok is True
    assert sm.current_state == "IN_PROGRESS"

def test_invalid_transition():
    sm = ExamStateMachine(initial_state="CREATED")
    ok, msg = sm.transition_to("COMPLETED")
    assert ok is False
    assert sm.current_state == "CREATED"

def test_terminal_state_protection():
    sm = ExamStateMachine(initial_state="COMPLETED")
    ok, msg = sm.transition_to("IN_PROGRESS")
    assert ok is False
    assert sm.current_state == "COMPLETED"
    
    can_proc, reason = sm.can_process_event("ANSWER_SUBMITTED")
    assert can_proc is False
