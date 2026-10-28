import pytest
from backend.services.synthetic_generator import proposed_gen
from backend.services.privacy_validator import privacy_validator
from backend.services.dataset_profiler import profiler

def test_no_source_ids():
    gen_df = proposed_gen.generate(n_records=200)
    ref_df = profiler.load_dataset()
    res = privacy_validator.scan_dataset(gen_df, ref_df)
    assert res["source_ids_reproduced"] == 0

def test_no_source_ips():
    gen_df = proposed_gen.generate(n_records=200)
    ref_df = profiler.load_dataset()
    res = privacy_validator.scan_dataset(gen_df, ref_df)
    assert res["source_ips_reproduced"] == 0

def test_no_source_fingerprints():
    gen_df = proposed_gen.generate(n_records=200)
    ref_df = profiler.load_dataset()
    res = privacy_validator.scan_dataset(gen_df, ref_df)
    assert res["source_fingerprints_reproduced"] == 0

def test_pii_scanner():
    gen_df = proposed_gen.generate(n_records=100)
    res = privacy_validator.scan_dataset(gen_df)
    assert res["credential_patterns_found"] == 0
    assert res["status"] == "PASS"
