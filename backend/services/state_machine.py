class ExamStateMachine:
    VALID_TRANSITIONS = {
        "CREATED": ["STARTED"],
        "STARTED": ["IN_PROGRESS", "SUBMITTED"],
        "IN_PROGRESS": ["IN_PROGRESS", "SUBMITTED"],
        "SUBMITTED": ["COMPLETED"],
        "COMPLETED": [] # Terminal state
    }

    ALLOWED_EVENTS_PER_STATE = {
        "CREATED": ["LOGIN", "EXAM_STARTED"],
        "STARTED": ["QUESTION_VIEWED", "ANSWER_SUBMITTED", "HEARTBEAT", "NETWORK_DISCONNECTED", "NETWORK_RECONNECTED"],
        "IN_PROGRESS": ["QUESTION_VIEWED", "ANSWER_SUBMITTED", "ANSWER_UPDATED", "QUESTION_SKIPPED", "HEARTBEAT", "NETWORK_DISCONNECTED", "NETWORK_RECONNECTED", "EXAM_SUBMITTED"],
        "SUBMITTED": ["EXAM_SUBMITTED", "LOGOUT", "COMPLETED"],
        "COMPLETED": ["LOGOUT"]
    }

    def __init__(self, initial_state="CREATED"):
        self.current_state = initial_state
        self.history = [initial_state]

    def transition_to(self, new_state):
        if new_state in self.VALID_TRANSITIONS.get(self.current_state, []):
            self.current_state = new_state
            self.history.append(new_state)
            return True, f"Successfully transitioned from {self.history[-2]} to {new_state}"
        else:
            return False, f"Invalid state transition attempted: {self.current_state} -> {new_state}"

    def can_process_event(self, event_type):
        allowed = self.ALLOWED_EVENTS_PER_STATE.get(self.current_state, [])
        if event_type in allowed:
            return True, f"Event {event_type} permitted in state {self.current_state}"
        else:
            return False, f"Event {event_type} rejected: Current state is {self.current_state}"

state_machine = ExamStateMachine()
