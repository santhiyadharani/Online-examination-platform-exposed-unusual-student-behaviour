import datetime
from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship
from .database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(String, primary_key=True, index=True) # e.g. STU-SYN-000001
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    sessions = relationship("ExamSession", back_populates="student")

class Exam(Base):
    __tablename__ = "exams"

    id = Column(String, primary_key=True, index=True) # e.g. EXM-SYN-000001
    title = Column(String, default="Standard Online Assessment")
    duration_min = Column(Integer, default=90)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    sessions = relationship("ExamSession", back_populates="exam")
    questions = relationship("Question", back_populates="exam")

class Question(Base):
    __tablename__ = "questions"

    id = Column(String, primary_key=True, index=True)
    exam_id = Column(String, ForeignKey("exams.id"))
    question_number = Column(Integer)
    prompt = Column(Text)
    correct_answer = Column(String)

    exam = relationship("Exam", back_populates="questions")
    answers = relationship("Answer", back_populates="question")

class ExamSession(Base):
    __tablename__ = "sessions"

    id = Column(String, primary_key=True, index=True) # e.g. SES-SYN-000001
    student_id = Column(String, ForeignKey("students.id"))
    exam_id = Column(String, ForeignKey("exams.id"))
    status = Column(String, default="CREATED") # CREATED, STARTED, IN_PROGRESS, SUBMITTED, COMPLETED
    exam_start_time = Column(DateTime, nullable=True)
    exam_end_time = Column(DateTime, nullable=True)
    allotted_duration_min = Column(Integer, default=90)
    actual_duration_min = Column(Float, default=0.0)
    num_tab_switches = Column(Integer, default=0)
    num_copy_paste_events = Column(Integer, default=0)
    num_right_clicks = Column(Integer, default=0)
    mouse_idle_time_sec = Column(Float, default=0.0)
    avg_keystroke_rate_per_sec = Column(Float, default=0.0)
    num_multiple_logins = Column(Integer, default=0)
    multiple_device_flag = Column(Boolean, default=False)
    face_not_detected_pct = Column(Float, default=0.0)
    answer_change_frequency = Column(Integer, default=0)
    avg_time_per_question_sec = Column(Float, default=0.0)
    std_time_per_question_sec = Column(Float, default=0.0)
    ip_address = Column(String, default="10.200.1.1")
    device_fingerprint = Column(String, default="SYN-DEV-00000000")
    final_score = Column(Float, default=0.0)
    is_unusual_behaviour = Column(Boolean, default=False)
    flagged_reasons = Column(String, default="")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    student = relationship("Student", back_populates="sessions")
    exam = relationship("Exam", back_populates="sessions")
    answers = relationship("Answer", back_populates="session")
    events = relationship("Event", back_populates="session")

class Answer(Base):
    __tablename__ = "answers"

    id = Column(String, primary_key=True, index=True)
    session_id = Column(String, ForeignKey("sessions.id"))
    question_id = Column(String, ForeignKey("questions.id"))
    submitted_answer = Column(String)
    is_correct = Column(Boolean, default=False)
    submitted_at = Column(DateTime, default=datetime.datetime.utcnow)

    session = relationship("ExamSession", back_populates="answers")
    question = relationship("Question", back_populates="answers")

class Event(Base):
    __tablename__ = "events"

    id = Column(String, primary_key=True, index=True) # e.g. EVT-SYN-000001
    session_id = Column(String, ForeignKey("sessions.id"))
    event_type = Column(String) # LOGIN, EXAM_STARTED, QUESTION_VIEWED, ANSWER_SUBMITTED, etc.
    sequence_number = Column(Integer)
    event_timestamp = Column(DateTime)
    received_timestamp = Column(DateTime)
    payload = Column(Text, default="{}")
    payload_hash = Column(String)
    processing_status = Column(String, default="PROCESSED") # PROCESSED, REJECTED, RECOVERED, DUPLICATE_IGNORED
    status_reason = Column(String, default="")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    session = relationship("ExamSession", back_populates="events")

class GeneratedScenario(Base):
    __tablename__ = "generated_scenarios"

    id = Column(String, primary_key=True, index=True)
    profile_type = Column(String) # NORMAL, FAST, SLOW, NETWORK_UNSTABLE, SUSPICIOUS, HIGHLY_UNUSUAL
    network_condition = Column(String)
    failure_type = Column(String)
    severity = Column(String)
    expected_result = Column(String)
    actual_result = Column(String)
    passed = Column(Boolean, default=True)
    details = Column(Text, default="{}")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

class ExperimentResult(Base):
    __tablename__ = "experiment_results"

    id = Column(String, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    random_seed = Column(Integer, default=42)
    configuration = Column(Text)
    generator_name = Column(String) # Baseline vs Proposed
    records_generated = Column(Integer)
    schema_validity = Column(Float)
    constraint_validity = Column(Float)
    distribution_similarity = Column(Float)
    correlation_preservation = Column(Float)
    privacy_result = Column(String) # PASS / FAIL
    generation_time_sec = Column(Float)
    failure_count = Column(Integer)
    recovery_rate = Column(Float)
    state_corruption_rate = Column(Float)

class ValidationResult(Base):
    __tablename__ = "validation_results"

    id = Column(String, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    target_dataset = Column(String)
    rule_type = Column(String) # Schema, Referential, Distribution, Privacy
    passed = Column(Boolean, default=True)
    metric_name = Column(String)
    metric_value = Column(Float)
    details = Column(Text)

class RiskItem(Base):
    __tablename__ = "risk_register"

    id = Column(Integer, primary_key=True, autoincrement=True)
    risk = Column(String)
    impact = Column(String) # Low, Medium, High, Critical
    probability = Column(String) # Low, Medium, High
    mitigation = Column(Text)
    status = Column(String, default="Active")
