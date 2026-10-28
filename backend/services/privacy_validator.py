import re
import pandas as pd
from .dataset_profiler import profiler

class PrivacyValidator:
    def __init__(self):
        pass

    def scan_dataset(self, gen_df: pd.DataFrame, ref_df: pd.DataFrame = None):
        if ref_df is None:
            ref_df = profiler.load_dataset()

        # Extract reference values
        ref_stu_ids = set(ref_df["student_id"].dropna().astype(str)) if "student_id" in ref_df.columns else set()
        ref_exam_ids = set(ref_df["exam_id"].dropna().astype(str)) if "exam_id" in ref_df.columns else set()
        ref_ses_ids = set(ref_df["session_id"].dropna().astype(str)) if "session_id" in ref_df.columns else set()
        ref_ips = set(ref_df["ip_address"].dropna().astype(str)) if "ip_address" in ref_df.columns else set()
        ref_fps = set(ref_df["device_fingerprint"].dropna().astype(str)) if "device_fingerprint" in ref_df.columns else set()

        # Check generated values
        gen_stu_ids = set(gen_df["student_id"].dropna().astype(str)) if "student_id" in gen_df.columns else set()
        gen_exam_ids = set(gen_df["exam_id"].dropna().astype(str)) if "exam_id" in gen_df.columns else set()
        gen_ses_ids = set(gen_df["session_id"].dropna().astype(str)) if "session_id" in gen_df.columns else set()
        gen_ips = set(gen_df["ip_address"].dropna().astype(str)) if "ip_address" in gen_df.columns else set()
        gen_fps = set(gen_df["device_fingerprint"].dropna().astype(str)) if "device_fingerprint" in gen_df.columns else set()

        stu_leaks = len(gen_stu_ids.intersection(ref_stu_ids))
        exam_leaks = len(gen_exam_ids.intersection(ref_exam_ids))
        ses_leaks = len(gen_ses_ids.intersection(ref_ses_ids))
        ip_leaks = len(gen_ips.intersection(ref_ips))
        fp_leaks = len(gen_fps.intersection(ref_fps))

        source_ids_reproduced = stu_leaks + exam_leaks + ses_leaks

        # PII Regex Scanners
        email_regex = re.compile(r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}")
        phone_regex = re.compile(r"\b\d{3}[-.\s]?\d{3}[-.\s]?\d{4}\b")
        token_regex = re.compile(r"\b(bearer|jwt|token|secret|password)\b", re.IGNORECASE)

        credential_patterns_found = 0
        for col in gen_df.columns:
            col_text = " ".join(gen_df[col].astype(str).tolist())
            if email_regex.search(col_text):
                credential_patterns_found += 1
            if phone_regex.search(col_text):
                credential_patterns_found += 1
            if token_regex.search(col_text):
                credential_patterns_found += 1

        # Check synthetic identifier formatting
        valid_stu_format = all(s.startswith("STU-SYN-") or s.startswith("STU_") for s in gen_stu_ids)
        valid_ip_format = all(ip.startswith("10.200.") or ip.startswith("192.168.") or ip.startswith("10.") for ip in gen_ips)

        synthetic_format_pass = valid_stu_format and valid_ip_format
        overall_pass = (source_ids_reproduced == 0 and ip_leaks == 0 and fp_leaks == 0 and credential_patterns_found == 0)

        disclaimer = "This prototype performs automated privacy checks and source-value non-reproduction checks; these checks do not constitute a formal privacy guarantee."

        return {
            "overall_pass": overall_pass,
            "status": "PASS" if overall_pass else "FAIL",
            "source_ids_reproduced": source_ids_reproduced,
            "source_ips_reproduced": ip_leaks,
            "source_fingerprints_reproduced": fp_leaks,
            "credential_patterns_found": credential_patterns_found,
            "synthetic_identifier_validation": "PASS" if synthetic_format_pass else "WARN",
            "disclaimer": disclaimer,
            "breakdown": {
                "student_id_matches": stu_leaks,
                "exam_id_matches": exam_leaks,
                "session_id_matches": ses_leaks,
                "ip_matches": ip_leaks,
                "fingerprint_matches": fp_leaks
            }
        }

privacy_validator = PrivacyValidator()
