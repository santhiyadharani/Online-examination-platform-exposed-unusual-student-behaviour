import React from 'react';
import { HelpCircle, ArrowRight, Play, CheckCircle2 } from 'lucide-react';

const STEPS = [
  { step: 1, title: 'Open Dashboard', desc: 'Inspect high-level KPIs, system health checkmarks, and overall laboratory status.' },
  { step: 2, title: 'Inspect Reference Dataset Profile', desc: 'Navigate to Data Profile to view learned distributions, numeric ranges, and unusual behaviour breakdown.' },
  { step: 3, title: 'Configure Synthetic Generation', desc: 'Open Synthetic Generator page, choose record count (100, 500, 1k, 5k), seed (42), and generator model.' },
  { step: 4, title: 'Generate Synthetic Records', desc: 'Click GENERATE SYNTHETIC DATA to build new dataset saved as data/generated/generated_exam_behaviour.csv.' },
  { step: 5, title: 'Run Schema & Constraint Validation', desc: 'Navigate to Data Quality to inspect required fields, score range 0-100, and referential integrity.' },
  { step: 6, title: 'Run Privacy Audit', desc: 'Navigate to Privacy Audit to scan for zero reproduction of source student IDs, source IPs, or credentials.' },
  { step: 7, title: 'Generate Examination Scenarios', desc: 'Navigate to Scenario Library to view Normal, Unstable, and Suspicious behaviour profiles.' },
  { step: 8, title: 'Inject Network & Behavior Failures', desc: 'Open Failure Simulation page and set Delay %, Duplicate %, Out-of-Order %, and Disconnect rates.' },
  { step: 9, title: 'Replay Events & Inspect Timeline', desc: 'Open Event Viewer to view timeline badges (PROCESSED, DELAYED, DUPLICATE - IGNORED, REJECTED).' },
  { step: 10, title: 'Validate Final Session State', desc: 'Verify that session state machine locks terminal states and preserves score without data corruption.' },
  { step: 11, title: 'Run Baseline vs Proposed Experiment', desc: 'Navigate to Evaluation or Experiments page to run reproducible side-by-side benchmark.' },
  { step: 12, title: 'Download Reports & Evidence', desc: 'Open Reports page to export CSV metrics, JSON evidence, or full Markdown executive report.' }
];

export default function UserGuide({ setCurrentPage, onRunDemo }) {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">ExamSafe Step-by-Step User Guide</h1>
          <p className="page-subtitle">Walkthrough guide for operating the synthetic QA & resilience laboratory.</p>
        </div>
        <button onClick={onRunDemo} className="btn btn-primary">
          <Play size={16} /> Execute 1-Click Auto Demo
        </button>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {STEPS.map((s) => (
          <div key={s.step} className="glass-panel" style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
              color: '#fff',
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.1rem',
              flexShrink: 0
            }}>
              {s.step}
            </div>

            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.25rem' }}>{s.title}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{s.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
