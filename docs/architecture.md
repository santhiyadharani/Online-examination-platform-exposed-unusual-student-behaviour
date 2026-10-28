# ExamSafe Synthetic QA Lab - Architecture Documentation

## System Overview
ExamSafe Synthetic QA Lab is an end-to-end testing and resilience laboratory built for online examination platforms. The system profiles empirical student examination data, generates privacy-safe synthetic records, injects streaming network failure events, and validates exam session state recovery.

```
                 ┌───────────────────────────────────────┐
                 │ React Dashboard (Vite + ChartJS/CSS) │
                 └──────────────────┬────────────────────┘
                                    │ HTTP REST API
                                    ▼
                 ┌───────────────────────────────────────┐
                 │       FastAPI Application Backend     │
                 └──────────────────┬────────────────────┘
                                    │
    ┌───────────────────────────────┼───────────────────────────────┐
    ▼                               ▼                               ▼
┌───────────────────────┐ ┌───────────────────┐ ┌───────────────────────┐
│ Dataset Profiler &    │ │ Resilience Engine │ │ Evaluation Engine &   │
│ Synthetic Generator   │ │ Event Processor & │ │ Baseline vs Proposed  │
│ (Rule + Dist + Faker) │ │ State Machine     │ │ Statistical Metrics   │
└───────────┬───────────┘ └─────────┬─────────┘ └───────────┬───────────┘
            │                       │                       │
            └───────────────────────┼───────────────────────┘
                                    ▼
                         ┌────────────────────┐
                         │   SQLite Database  │
                         │ (SQLAlchemy Models)│
                         └────────────────────┘
```

## Core Subsystems

### 1. Dataset Profiler (`backend/services/dataset_profiler.py`)
- Reads reference CSV data dynamically.
- Automatically classifies fields into Identity, Timestamp, Numeric Behavioural, Categorical, and Sensitive.
- Computes statistical moments (Min, Mean, Median, Std, Quantiles) and correlation matrices.

### 2. Schema Rule Engine (`backend/services/schema_engine.py`)
- Enforces domain constraints: score bounds (0-100), face detection (0-100%), duration > 0, timestamp sequence order.

### 3. Synthetic Generator (`backend/services/synthetic_generator.py`)
- Proposed multivariate generator preserving feature distributions & correlations while masking PII.

### 4. Event & Failure Engine (`backend/services/failure_injector.py` & `event_processor.py`)
- Simulates streaming exam events (`LOGIN`, `ANSWER_SUBMITTED`, `NETWORK_DISCONNECTED`, `EXAM_SUBMITTED`).
- Injects delay jitter, duplicate events, out-of-order delivery, and re-submits.
- State Machine locks terminal states to eliminate state corruption.

### 5. Benchmark & Evaluation Engine (`backend/services/evaluation_engine.py`)
- Measures KS-test distribution similarity, JS divergence, schema compliance, generation speed, and failure recovery.
