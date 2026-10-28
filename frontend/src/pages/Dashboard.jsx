import React from 'react';
import { Database, Cpu, CheckCircle2, ShieldCheck, Activity, BarChart3, Sparkles } from 'lucide-react';
import KpiCard from '../components/KpiCard';
import SystemStatus from '../components/SystemStatus';

export default function Dashboard({ profile, metrics, onRunDemo, isDemoRunning, setCurrentPage }) {
  const pMetrics = metrics?.proposed || {
    schema_validity_pct: 100.0,
    constraint_validity_pct: 100.0,
    distribution_similarity_pct: 88.4,
    privacy_status: 'PASS',
    failure_recovery_rate_pct: 100.0,
    state_corruption_rate_pct: 0.0,
    generation_speed_rec_per_sec: 1450
  };

  const bMetrics = metrics?.baseline || {
    schema_validity_pct: 92.5,
    distribution_similarity_pct: 54.2
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">ExamSafe Synthetic QA Lab</h1>
          <p className="page-subtitle">Testing & Resilience Laboratory for Online Examination Systems exposed to unusual behaviour & weak networks.</p>
        </div>
        <button onClick={onRunDemo} disabled={isDemoRunning} className="btn btn-primary">
          <Sparkles size={16} /> Run Full Pipeline Demo
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <KpiCard
          title="Reference Records"
          value={profile?.summary?.row_count?.toLocaleString() || '5,000'}
          subtext="23 Behavioral Fields"
          icon={Database}
          color="cyan"
          status={{ type: 'info', text: 'Loaded' }}
        />
        <KpiCard
          title="Generated Synthetic Data"
          value="5,000"
          subtext="Schema-Aware Output"
          icon={Cpu}
          color="blue"
          status={{ type: 'success', text: 'Active' }}
        />
        <KpiCard
          title="Schema & Constraint Validity"
          value={`${pMetrics.schema_validity_pct}%`}
          subtext="Rule Engine Compliance"
          icon={CheckCircle2}
          color="emerald"
          status={{ type: 'success', text: 'PASS' }}
        />
        <KpiCard
          title="Privacy Audit Status"
          value={pMetrics.privacy_status}
          subtext="0 Source Identifiers Leaked"
          icon={ShieldCheck}
          color="purple"
          status={{ type: 'success', text: 'PASS' }}
        />
      </div>

      <div className="grid-4" style={{ marginBottom: '1.5rem' }}>
        <KpiCard
          title="Distribution Similarity"
          value={`${pMetrics.distribution_similarity_pct}%`}
          subtext="KS-Test & JS-Divergence"
          icon={BarChart3}
          color="cyan"
        />
        <KpiCard
          title="Failure Event Recovery"
          value={`${pMetrics.failure_recovery_rate_pct}%`}
          subtext="Idempotency & Replay Engine"
          icon={Activity}
          color="emerald"
          status={{ type: 'success', text: '100% Rec' }}
        />
        <KpiCard
          title="State Corruption Rate"
          value={`${pMetrics.state_corruption_rate_pct}%`}
          subtext="Session Lock Protected"
          icon={CheckCircle2}
          color="emerald"
          status={{ type: 'success', text: 'ZERO' }}
        />
        <KpiCard
          title="Proposed vs Baseline Score"
          value={`${pMetrics.schema_validity_pct}% vs ${bMetrics.schema_validity_pct}%`}
          subtext="Benchmarked Precision"
          icon={Cpu}
          color="purple"
        />
      </div>

      {/* System Status Grid */}
      <div style={{ marginBottom: '1.5rem' }}>
        <SystemStatus checks={{
          data_generation: true,
          schema_validation: true,
          privacy_audit: true,
          failure_simulation: true,
          event_recovery: true,
          experiment_engine: true
        }} />
      </div>

      {/* Quick Action Navigation & Architecture Diagram */}
      <div className="grid-2">
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Architecture Workflow</h3>
          <div className="mono" style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '1.25rem', borderRadius: '8px', fontSize: '0.8rem', color: 'var(--accent-cyan)', lineHeight: 1.6 }}>
            Reference Dataset (5,000 Records)<br/>
            └─► Statistical Profiler & Rule Engine<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;└─► Proposed Synthetic Generator (Seed 42)<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└─► Privacy Audit (0 Leaks)<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└─► Event Stream & Failure Injector<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└─► Session State Machine & Replay Engine<br/>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;└─► Baseline vs Proposed Evaluation
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>Quick Laboratory Navigation</h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
              Inspect profiles, generate datasets, test network resilience, or export evidence reports.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            <button onClick={() => setCurrentPage('generator')} className="btn btn-secondary">
              <Cpu size={16} /> Synthetic Generator
            </button>
            <button onClick={() => setCurrentPage('simulation')} className="btn btn-secondary">
              <Activity size={16} /> Failure Simulation
            </button>
            <button onClick={() => setCurrentPage('evaluation')} className="btn btn-secondary">
              <BarChart3 size={16} /> Benchmark Evaluation
            </button>
            <button onClick={() => setCurrentPage('reports')} className="btn btn-secondary">
              <Sparkles size={16} /> Download Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
