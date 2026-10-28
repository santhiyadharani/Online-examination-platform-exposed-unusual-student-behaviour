import pytest
from backend.services.evaluation_engine import evaluation_engine

def test_baseline_metrics():
    res = evaluation_engine.run_benchmark(n_records=100, seed=42)
    assert "baseline" in res
    assert "schema_validity_pct" in res["baseline"]
    assert "generation_speed_rec_per_sec" in res["baseline"]

def test_proposed_metrics():
    res = evaluation_engine.run_benchmark(n_records=100, seed=42)
    assert "proposed" in res
    assert res["proposed"]["schema_validity_pct"] == 100.0
    assert res["proposed"]["privacy_status"] == "PASS"

def test_reproducibility():
    res1 = evaluation_engine.run_benchmark(n_records=100, seed=42)
    res2 = evaluation_engine.run_benchmark(n_records=100, seed=42)
    assert res1["proposed"]["schema_validity_pct"] == res2["proposed"]["schema_validity_pct"]
    assert res1["reproducibility"] == "PASS"
