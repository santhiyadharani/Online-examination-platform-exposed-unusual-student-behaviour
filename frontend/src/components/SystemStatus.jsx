import React from 'react';
import { Check, X } from 'lucide-react';

export default function SystemStatus({ checks }) {
  const items = [
    { label: 'Data Generation', key: 'data_generation' },
    { label: 'Schema Validation', key: 'schema_validation' },
    { label: 'Privacy Audit', key: 'privacy_audit' },
    { label: 'Failure Simulation', key: 'failure_simulation' },
    { label: 'Event Recovery', key: 'event_recovery' },
    { label: 'Experiment Engine', key: 'experiment_engine' },
  ];

  return (
    <div className="glass-panel" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff' }}>SYNTHETIC QA SYSTEM STATUS</h3>
        <span className="badge badge-info">LIVE VERIFICATION</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.85rem' }}>
        {items.map((item) => {
          const isPassed = checks ? checks[item.key] : true;
          return (
            <div
              key={item.key}
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>
                {item.label}
              </span>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: isPassed ? 'rgba(16, 185, 129, 0.2)' : 'rgba(244, 63, 94, 0.2)',
                color: isPassed ? '#34d399' : '#fb7185',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700
              }}>
                {isPassed ? <Check size={14} /> : <X size={14} />}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
