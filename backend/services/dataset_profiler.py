import os
import pandas as pd
import numpy as np

BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
REF_CSV_PATH = os.path.join(BASE_DIR, "data", "reference", "synthetic_exam_behaviour_dataset.csv")

class DatasetProfiler:
    def __init__(self, csv_path=None):
        self.csv_path = csv_path or REF_CSV_PATH
        self.df = None
        self.profile_data = None

    def load_dataset(self):
        if not os.path.exists(self.csv_path):
            raise FileNotFoundError(f"Reference dataset not found at {self.csv_path}")
        self.df = pd.read_csv(self.csv_path)
        return self.df

    def classify_columns(self):
        if self.df is None:
            self.load_dataset()

        cols = list(self.df.columns)
        identity_cols = [c for c in cols if any(k in c.lower() for k in ["student_id", "exam_id", "session_id"])]
        timestamp_cols = [c for c in cols if "time" in c.lower() and not "sec" in c.lower() and not "min" in c.lower()]
        sensitive_cols = [c for c in cols if any(k in c.lower() for k in ["ip_address", "device_fingerprint", "email", "phone", "name"])]
        
        # Categorical / boolean
        categorical_cols = [
            c for c in cols 
            if c not in identity_cols + timestamp_cols + sensitive_cols 
            and (self.df[c].dtype == 'object' or self.df[c].dtype == 'bool' or self.df[c].nunique() < 5 or c == 'is_unusual_behaviour')
        ]
        
        # Numeric behavioral
        numeric_cols = [
            c for c in cols 
            if c not in identity_cols + timestamp_cols + sensitive_cols + categorical_cols
            and pd.api.types.is_numeric_dtype(self.df[c])
        ]

        return {
            "identity": identity_cols,
            "timestamp": timestamp_cols,
            "numeric_behavioural": numeric_cols,
            "categorical": categorical_cols,
            "sensitive": sensitive_cols
        }

    def generate_profile(self):
        if self.df is None:
            self.load_dataset()

        column_classes = self.classify_columns()
        total_rows = len(self.df)
        total_cols = len(self.df.columns)

        missing_values = self.df.isnull().sum().to_dict()
        data_types = {c: str(self.df[c].dtype) for c in self.df.columns}
        unique_counts = {c: int(self.df[c].nunique()) for c in self.df.columns}

        numeric_stats = {}
        for col in column_classes["numeric_behavioural"]:
            series = pd.to_numeric(self.df[col], errors='coerce').dropna()
            if len(series) > 0:
                numeric_stats[col] = {
                    "min": float(series.min()),
                    "max": float(series.max()),
                    "mean": float(series.mean()),
                    "median": float(series.median()),
                    "std": float(series.std()),
                    "p25": float(series.quantile(0.25)),
                    "p75": float(series.quantile(0.75)),
                    "p95": float(series.quantile(0.95))
                }

        categorical_stats = {}
        for col in column_classes["categorical"]:
            vc = self.df[col].value_counts(dropna=False)
            categorical_stats[col] = {
                str(k): {"count": int(v), "percentage": round(float(v / total_rows * 100), 2)}
                for k, v in vc.items()
            }

        # Correlation matrix for numeric columns
        corr_cols = column_classes["numeric_behavioural"]
        if "is_unusual_behaviour" in self.df.columns:
            corr_cols.append("is_unusual_behaviour")

        corr_df = self.df[corr_cols].apply(pd.to_numeric, errors='coerce').corr().fillna(0)
        correlation_matrix = {
            c: {r: round(float(corr_df.loc[c, r]), 4) for r in corr_cols}
            for c in corr_cols
        }

        # Unusual behaviour distribution
        unusual_dist = {}
        if "is_unusual_behaviour" in self.df.columns:
            ub_counts = self.df["is_unusual_behaviour"].value_counts()
            unusual_dist = {
                "normal_count": int(ub_counts.get(0, 0)),
                "unusual_count": int(ub_counts.get(1, 0)),
                "unusual_pct": round(float(ub_counts.get(1, 0) / total_rows * 100), 2)
            }

        # Reason breakdown
        reason_breakdown = {}
        if "flagged_reasons" in self.df.columns:
            reasons_series = self.df["flagged_reasons"].dropna().astype(str)
            all_reasons = []
            for item in reasons_series:
                if item and item != "nan":
                    all_reasons.extend(item.split(";"))
            from collections import Counter
            reason_counts = Counter(all_reasons)
            reason_breakdown = {k: int(v) for k, v in reason_counts.most_common()}

        self.profile_data = {
            "summary": {
                "row_count": total_rows,
                "column_count": total_cols,
                "dataset_filename": os.path.basename(self.csv_path)
            },
            "column_classification": column_classes,
            "missing_values": missing_values,
            "data_types": data_types,
            "unique_counts": unique_counts,
            "numeric_stats": numeric_stats,
            "categorical_stats": categorical_stats,
            "correlation_matrix": correlation_matrix,
            "unusual_behaviour_distribution": unusual_dist,
            "reason_breakdown": reason_breakdown
        }

        return self.profile_data

profiler = DatasetProfiler()
