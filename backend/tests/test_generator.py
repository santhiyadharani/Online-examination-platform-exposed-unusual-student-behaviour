import pytest
import pandas as pd
from backend.services.synthetic_generator import proposed_gen
from backend.services.baseline_generator import baseline_gen
from backend.services.schema_engine import schema_engine

def test_generator_creates_records():
    df = proposed_gen.generate(n_records=100)
    assert isinstance(df, pd.DataFrame)
    assert len(df) == 100

def test_generated_ids_are_unique():
    df = proposed_gen.generate(n_records=100)
    assert df["student_id"].nunique() == 100
    assert df["session_id"].nunique() == 100

def test_schema_rules():
    df = proposed_gen.generate(n_records=100)
    res = schema_engine.validate_dataset(df)
    assert res["schema_validity_pct"] == 100.0

def test_numeric_ranges():
    df = proposed_gen.generate(n_records=100)
    assert (df["final_score"] >= 0).all() and (df["final_score"] <= 100).all()
    assert (df["face_not_detected_pct"] >= 0).all() and (df["face_not_detected_pct"] <= 100).all()

def test_categorical_values():
    df = proposed_gen.generate(n_records=100)
    assert df["is_unusual_behaviour"].isin([0, 1]).all()
    assert df["multiple_device_flag"].isin([True, False]).all()
