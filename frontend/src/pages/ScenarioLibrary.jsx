import React, { useState, useEffect } from 'react';
import { BookOpen, Download, Filter, Tag } from 'lucide-react';
import { api } from '../services/api';

export default function ScenarioLibrary() {
  const [scenarios, setScenarios] = useState([]);
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  useEffect(() => {
    api.getScenarios().then(setScenarios).catch(console.error);
  }, []);

  const filtered = scenarios.filter((s) => filterSeverity === 'ALL' || s.severity === filterSeverity);

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(filtered, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "synthetic_scenarios.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Synthetic Behaviour Scenario Library</h1>
          <p className="page-subtitle">Pre-configured examination behaviour profiles & network disruption scenario definitions.</p>
        </div>
        <button onClick={exportJSON} className="btn btn-secondary">
          <Download size={16} /> Export Scenarios (JSON)
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['ALL', 'LOW', 'MEDIUM', 'HIGH'].map((sev) => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            className={`btn ${filterSeverity === sev ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
          >
            {sev === 'ALL' ? 'All Severities' : `${sev} Severity`}
          </button>
        ))}
      </div>

      <div className="grid-2">
        {filtered.map((sc) => (
          <div key={sc.scenario_id} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 700 }}>{sc.scenario_id}</span>
                <span className={`badge badge-${sc.severity === 'HIGH' ? 'danger' : sc.severity === 'MEDIUM' ? 'warning' : 'info'}`}>
                  {sc.severity} SEVERITY
                </span>
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '0.5rem' }}>
                {sc.profile_type.replace('_', ' ')}
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                {sc.description}
              </p>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', fontSize: '0.8rem', display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
              <div>Network: <span className="mono" style={{ color: '#fff' }}>{sc.network_condition}</span></div>
              <div>Failure Injected: <span className="mono" style={{ color: '#fff' }}>{sc.failure_type}</span></div>
              <div>Expected: <span className="mono" style={{ color: 'var(--accent-emerald)' }}>{sc.expected_result}</span></div>
              <div>Status: <span className="badge badge-success">PASS</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
