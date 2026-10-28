import React, { useState } from 'react';
import { Database, Filter, Tag, AlertTriangle } from 'lucide-react';

export default function DataProfile({ profile }) {
  const [activeTab, setActiveTab] = useState('CLASSIFICATION');

  if (!profile) {
    return (
      <div className="page-container">
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
          Loading Reference Dataset Profile...
        </div>
      </div>
    );
  }

  const { summary, column_classification, numeric_stats, categorical_stats, unusual_behaviour_distribution, reason_breakdown } = profile;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Reference Dataset Profile</h1>
          <p className="page-subtitle">Automated statistical profiling and column classification of {summary.dataset_filename}</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <span className="badge badge-info">{summary.row_count?.toLocaleString()} Rows</span>
          <span className="badge badge-neutral">{summary.column_count} Columns</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button className={`tab-btn ${activeTab === 'CLASSIFICATION' ? 'active' : ''}`} onClick={() => setActiveTab('CLASSIFICATION')}>
          Column Classification
        </button>
        <button className={`tab-btn ${activeTab === 'NUMERIC' ? 'active' : ''}`} onClick={() => setActiveTab('NUMERIC')}>
          Numeric Distributions
        </button>
        <button className={`tab-btn ${activeTab === 'CATEGORICAL' ? 'active' : ''}`} onClick={() => setActiveTab('CATEGORICAL')}>
          Categoricals & Behaviour
        </button>
      </div>

      {activeTab === 'CLASSIFICATION' && (
        <div className="grid-2">
          {Object.entries(column_classification || {}).map(([category, cols]) => (
            <div key={category} className="glass-panel" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Tag size={18} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, textTransform: 'capitalize', color: '#fff' }}>
                  {category.replace('_', ' ')} Fields
                </h3>
                <span className="badge badge-neutral" style={{ marginLeft: 'auto' }}>{cols.length} fields</span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {cols.map((c) => (
                  <span key={c} className="mono" style={{ background: 'rgba(255,255,255,0.06)', padding: '0.35rem 0.65rem', borderRadius: '6px', fontSize: '0.8rem', border: '1px solid var(--border-color)' }}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'NUMERIC' && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Numerical Feature Statistics</h3>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Field Name</th>
                  <th>Min</th>
                  <th>Mean</th>
                  <th>Median</th>
                  <th>Max</th>
                  <th>Std Dev</th>
                  <th>P25</th>
                  <th>P75</th>
                  <th>P95</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(numeric_stats || {}).map(([col, s]) => (
                  <tr key={col}>
                    <td className="mono" style={{ fontWeight: 600, color: 'var(--accent-cyan)' }}>{col}</td>
                    <td>{s.min}</td>
                    <td>{s.mean}</td>
                    <td>{s.median}</td>
                    <td>{s.max}</td>
                    <td>{s.std}</td>
                    <td>{s.p25}</td>
                    <td>{s.p75}</td>
                    <td>{s.p95}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'CATEGORICAL' && (
        <div className="grid-2">
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Unusual Behaviour Breakdown</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '6px' }}>
                <span>Normal Exam Sessions</span>
                <span className="mono" style={{ fontWeight: 700 }}>{unusual_behaviour_distribution?.normal_count?.toLocaleString()} ({100 - unusual_behaviour_distribution?.unusual_pct}%)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(244,63,94,0.1)', borderRadius: '6px', border: '1px solid rgba(244,63,94,0.3)' }}>
                <span style={{ color: '#fb7185' }}>Unusual / Flagged Sessions</span>
                <span className="mono" style={{ fontWeight: 700, color: '#fb7185' }}>{unusual_behaviour_distribution?.unusual_count?.toLocaleString()} ({unusual_behaviour_distribution?.unusual_pct}%)</span>
              </div>
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginTop: '1.5rem', marginBottom: '0.75rem' }}>Flagged Reason Frequencies</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {Object.entries(reason_breakdown || {}).map(([reason, count]) => (
                <div key={reason} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span className="mono">{reason.replace(/_/g, ' ')}</span>
                  <span className="badge badge-warning">{count} occurrences</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Categorical Frequencies</h3>
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Value</th>
                    <th>Count</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(categorical_stats || {}).flatMap(([col, valMap]) =>
                    Object.entries(valMap).map(([val, obj]) => (
                      <tr key={`${col}-${val}`}>
                        <td className="mono">{col}</td>
                        <td className="mono">{val}</td>
                        <td>{obj.count}</td>
                        <td>{obj.percentage}%</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
