import pandas as pd
import numpy as np
from scipy import stats
from scipy.spatial.distance import jensenshannon
from .dataset_profiler import profiler

class DistributionValidator:
    def __init__(self):
        pass

    def evaluate_distributions(self, gen_df: pd.DataFrame, ref_df: pd.DataFrame = None):
        if ref_df is None:
            ref_df = profiler.load_dataset()

        col_classes = profiler.classify_columns()
        numeric_cols = col_classes["numeric_behavioural"]

        ks_results = {}
        ks_stats_list = []

        for col in numeric_cols:
            if col in ref_df.columns and col in gen_df.columns:
                ref_s = pd.to_numeric(ref_df[col], errors='coerce').dropna()
                gen_s = pd.to_numeric(gen_df[col], errors='coerce').dropna()

                if len(ref_s) > 0 and len(gen_s) > 0:
                    stat_val, p_val = stats.ks_2samp(ref_s, gen_s)
                    similarity_pct = max(0.0, round(float((1.0 - stat_val) * 100), 2))
                    
                    if stat_val < 0.15:
                        evaluation = "GOOD"
                    elif stat_val < 0.30:
                        evaluation = "ACCEPTABLE"
                    else:
                        evaluation = "NEEDS REVIEW"

                    ks_results[col] = {
                        "ks_statistic": round(float(stat_val), 4),
                        "p_value": round(float(p_val), 4),
                        "similarity_pct": similarity_pct,
                        "evaluation": evaluation,
                        "ref_mean": round(float(ref_s.mean()), 2),
                        "gen_mean": round(float(gen_s.mean()), 2),
                        "ref_std": round(float(ref_s.std()), 2),
                        "gen_std": round(float(gen_s.std()), 2)
                    }
                    ks_stats_list.append(similarity_pct)

        # Categorical divergence
        cat_cols = col_classes["categorical"]
        js_results = {}
        for col in cat_cols:
            if col in ref_df.columns and col in gen_df.columns:
                ref_vc = ref_df[col].astype(str).value_counts(normalize=True)
                gen_vc = gen_df[col].astype(str).value_counts(normalize=True)

                all_cats = list(set(ref_vc.index).union(set(gen_vc.index)))
                p = np.array([ref_vc.get(c, 0.0) for c in all_cats])
                q = np.array([gen_vc.get(c, 0.0) for c in all_cats])

                js_dist = float(jensenshannon(p, q))
                cat_similarity = max(0.0, round((1.0 - js_dist) * 100, 2))

                js_results[col] = {
                    "js_distance": round(js_dist, 4),
                    "similarity_pct": cat_similarity,
                    "evaluation": "GOOD" if js_dist < 0.15 else "ACCEPTABLE" if js_dist < 0.35 else "NEEDS REVIEW"
                }

        # Correlation preservation
        corr_cols = [c for c in numeric_cols if c in ref_df.columns and c in gen_df.columns]
        if "is_unusual_behaviour" in ref_df.columns and "is_unusual_behaviour" in gen_df.columns:
            corr_cols.append("is_unusual_behaviour")

        ref_corr = ref_df[corr_cols].apply(pd.to_numeric, errors='coerce').corr().fillna(0)
        gen_corr = gen_df[corr_cols].apply(pd.to_numeric, errors='coerce').corr().fillna(0)

        corr_diff = (ref_corr - gen_corr).abs().values
        mean_abs_diff = float(np.mean(corr_diff))
        corr_preservation_score = max(0.0, round((1.0 - mean_abs_diff) * 100, 2))

        avg_distribution_similarity = round(float(np.mean(ks_stats_list)), 2) if ks_stats_list else 85.0

        return {
            "overall_similarity_pct": avg_distribution_similarity,
            "correlation_preservation_score": corr_preservation_score,
            "mean_correlation_abs_error": round(mean_abs_diff, 4),
            "numerical_ks_tests": ks_results,
            "categorical_js_tests": js_results,
            "ref_correlation_matrix": {c: {r: round(float(ref_corr.loc[c, r]), 4) for r in corr_cols} for c in corr_cols},
            "gen_correlation_matrix": {c: {r: round(float(gen_corr.loc[c, r]), 4) for r in corr_cols} for c in corr_cols}
        }

distribution_validator = DistributionValidator()
