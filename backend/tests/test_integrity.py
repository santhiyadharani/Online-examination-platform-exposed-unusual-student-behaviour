import pytest
from backend.services.synthetic_generator import proposed_gen

def test_valid_relationships():
    df = proposed_gen.generate(n_records=50)
    assert df["student_id"].str.startswith("STU-SYN-").all()
    assert df["session_id"].str.startswith("SES-SYN-").all()
    assert df["exam_id"].str.startswith("EXM-SYN-").all()

def test_invalid_relationship_detection():
    df = proposed_gen.generate(n_records=50)
    df.loc[0, "student_id"] = None
    assert df.iloc[0]["student_id"] is None
