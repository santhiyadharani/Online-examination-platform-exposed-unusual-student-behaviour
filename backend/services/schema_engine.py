import pandas as pd

DEFAULT_RULES = [
    {"field": "student_id", "rule_type": "required", "params": {}, "description": "student_id is required"},
    {"field": "exam_id", "rule_type": "required", "params": {}, "description": "exam_id is required"},
    {"field": "session_id", "rule_type": "required", "params": {}, "description": "session_id is required"},
    {"field": "student_id", "rule_type": "unique", "params": {}, "description": "student_id must be unique"},
    {"field": "session_id", "rule_type": "unique", "params": {}, "description": "session_id must be unique"},
    {"field": "final_score", "rule_type": "range", "params": {"min": 0.0, "max": 100.0}, "description": "final_score between 0 and 100"},
    {"field": "face_not_detected_pct", "rule_type": "range", "params": {"min": 0.0, "max": 100.0}, "description": "face_not_detected_pct between 0 and 100"},
    {"field": "num_tab_switches", "rule_type": "min_value", "params": {"min": 0}, "description": "num_tab_switches >= 0"},
    {"field": "num_copy_paste_events", "rule_type": "min_value", "params": {"min": 0}, "description": "num_copy_paste_events >= 0"},
    {"field": "num_right_clicks", "rule_type": "min_value", "params": {"min": 0}, "description": "num_right_clicks >= 0"},
    {"field": "mouse_idle_time_sec", "rule_type": "min_value", "params": {"min": 0.0}, "description": "mouse_idle_time_sec >= 0"},
    {"field": "num_multiple_logins", "rule_type": "min_value", "params": {"min": 0}, "description": "num_multiple_logins >= 0"},
    {"field": "answer_change_frequency", "rule_type": "min_value", "params": {"min": 0}, "description": "answer_change_frequency >= 0"},
    {"field": "avg_time_per_question_sec", "rule_type": "gt_value", "params": {"gt": 0.0}, "description": "avg_time_per_question_sec > 0"},
    {"field": "std_time_per_question_sec", "rule_type": "min_value", "params": {"min": 0.0}, "description": "std_time_per_question_sec >= 0"},
    {"field": "allotted_duration_min", "rule_type": "gt_value", "params": {"gt": 0}, "description": "allotted_duration_min > 0"},
    {"field": "actual_duration_min", "rule_type": "gt_value", "params": {"gt": 0.0}, "description": "actual_duration_min > 0"},
    {"field": "exam_end_time", "rule_type": "time_order", "params": {"compare_field": "exam_start_time"}, "description": "exam_end_time >= exam_start_time"}
]

class SchemaEngine:
    def __init__(self):
        self.rules = list(DEFAULT_RULES)

    def get_rules(self):
        return self.rules

    def update_rules(self, new_rules):
        self.rules = new_rules
        return self.rules

    def validate_dataset(self, df: pd.DataFrame):
        total_records = len(df)
        if total_records == 0:
            return {
                "total_records": 0,
                "valid_records": 0,
                "schema_validity_pct": 100.0,
                "constraint_validity_pct": 100.0,
                "rule_evaluations": []
            }

        rule_results = []
        record_violations = set()

        for idx, rule in enumerate(self.rules):
            field = rule["field"]
            rule_type = rule["rule_type"]
            params = rule.get("params", {})
            desc = rule.get("description", f"{rule_type} on {field}")

            passed = True
            violations_count = 0

            if field not in df.columns and rule_type != "required":
                passed = False
                violations_count = total_records
                record_violations.update(range(total_records))
            elif rule_type == "required":
                if field not in df.columns:
                    passed = False
                    violations_count = total_records
                    record_violations.update(range(total_records))
                else:
                    null_mask = df[field].isnull()
                    violations_count = int(null_mask.sum())
                    if violations_count > 0:
                        passed = False
                        record_violations.update(df.index[null_mask].tolist())

            elif rule_type == "unique":
                dups_mask = df[field].duplicated()
                violations_count = int(dups_mask.sum())
                if violations_count > 0:
                    passed = False
                    record_violations.update(df.index[dups_mask].tolist())

            elif rule_type == "range":
                min_val = params.get("min", float("-inf"))
                max_val = params.get("max", float("inf"))
                num_series = pd.to_numeric(df[field], errors='coerce')
                out_mask = (num_series < min_val) | (num_series > max_val) | num_series.isnull()
                violations_count = int(out_mask.sum())
                if violations_count > 0:
                    passed = False
                    record_violations.update(df.index[out_mask].tolist())

            elif rule_type == "min_value":
                min_val = params.get("min", 0)
                num_series = pd.to_numeric(df[field], errors='coerce')
                out_mask = (num_series < min_val) | num_series.isnull()
                violations_count = int(out_mask.sum())
                if violations_count > 0:
                    passed = False
                    record_violations.update(df.index[out_mask].tolist())

            elif rule_type == "gt_value":
                gt_val = params.get("gt", 0)
                num_series = pd.to_numeric(df[field], errors='coerce')
                out_mask = (num_series <= gt_val) | num_series.isnull()
                violations_count = int(out_mask.sum())
                if violations_count > 0:
                    passed = False
                    record_violations.update(df.index[out_mask].tolist())

            elif rule_type == "time_order":
                compare_field = params.get("compare_field")
                if compare_field in df.columns:
                    t1 = pd.to_datetime(df[compare_field], errors='coerce')
                    t2 = pd.to_datetime(df[field], errors='coerce')
                    out_mask = (t2 < t1) | t1.isnull() | t2.isnull()
                    violations_count = int(out_mask.sum())
                    if violations_count > 0:
                        passed = False
                        record_violations.update(df.index[out_mask].tolist())

            rule_results.append({
                "rule_id": idx + 1,
                "field": field,
                "rule_type": rule_type,
                "description": desc,
                "passed": passed,
                "violations_count": violations_count
            })

        valid_records = total_records - len(record_violations)
        schema_validity_pct = round(float(valid_records / total_records * 100), 2)
        
        rules_passed = sum(1 for r in rule_results if r["passed"])
        constraint_validity_pct = round(float(rules_passed / len(rule_results) * 100), 2)

        return {
            "total_records": total_records,
            "valid_records": valid_records,
            "schema_validity_pct": schema_validity_pct,
            "constraint_validity_pct": constraint_validity_pct,
            "rule_evaluations": rule_results
        }

schema_engine = SchemaEngine()
