import React, { useState } from 'react';
import { Cpu, Play, CheckCircle, ShieldCheck, Download, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export default function Generator({ seed }) {
  const [recordCount, setRecordCount] = useState(1000);
  const [generatorType, setGeneratorType] = useState('Proposed');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const res = await api.generateData({
        records: recordCount,
        seed: seed,
        generator: generatorType
      });
      setResult(res);
    } catch (err) {
      alert(`Generation failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Synthetic Test-Data Generator</h1>
          <p className="page-subtitle">Generate schema-aware, distribution-preserving synthetic examination datasets with privacy transformations.</p>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        {/* Controls Card */}
        <div className="glass-panel" style={{ padding: '1.5rem', gridColumn: 'span 1' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Configuration</h3>

          <div className="form-group">
            <label className="form-label">Reference Dataset</label>
            <input className="form-input mono" value="synthetic_exam_behaviour_dataset.csv" disabled />
          </div>

          <div className="form-group">
            <label className="form-label">Record Count</label>
            <select className="form-select" value={recordCount} onChange={(e) => setRecordCount(Number(e.target.value))}>
              <option value={100}>Generate 100</option>
              <option value={500}>Generate 500</option>
              <option value={1000}>Generate 1,000</option>
              <option value={5000}>Generate 5,000</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Random Seed</label>
            <input className="form-input mono" value={seed} disabled />
          </div>

          <div className="form-group">
            <label className="form-label">Generator Model</label>
            <select className="form-select" value={generatorType} onChange={(e) => setGeneratorType(e.target.value)}>
              <option value="Proposed">Proposed (Schema & Distribution-Aware)</option>
              <option value="Baseline">Baseline (Simple Independent Sampling)</option>
            </select>
          </div>

          <button onClick={handleGenerate} disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '0.75rem', justifyContent: 'center' }}>
            {loading ? <RefreshCw className="animate-spin" size={16} /> : <Play size={16} />}
            GENERATE SYNTHETIC DATA
          </button>
        </div>

        {/* Results Overview */}
        <div className="glass-panel" style={{ padding: '1.5rem', gridColumn: 'span 2' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Generation Metrics & Validation</h3>

          {result ? (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '1rem', background: 'rgba(15,23,42,0.6)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Records Generated</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fff' }}>{result.records_generated?.toLocaleString()}</div>
                </div>
                <div style={{ padding: '1rem', background: 'rgba(15,23,42,0.6)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Schema Validity</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{result.schema_validity_pct}%</div>
                </div>
                <div style={{ padding: '1rem', background: 'rgba(15,23,42,0.6)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Privacy Scan</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>{result.privacy_status}</div>
                </div>
              </div>

              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>Generated Data Sample Preview</h4>
              <div className="table-container" style={{ maxHeight: '280px', overflowY: 'auto' }}>
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Student ID</th>
                      <th>Exam ID</th>
                      <th>Session ID</th>
                      <th>Tab Switches</th>
                      <th>Copy-Paste</th>
                      <th>Face %</th>
                      <th>Score</th>
                      <th>Unusual</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.sample?.map((row, idx) => (
                      <tr key={idx}>
                        <td className="mono" style={{ color: 'var(--accent-cyan)' }}>{row.student_id}</td>
                        <td className="mono">{row.exam_id}</td>
                        <td className="mono">{row.session_id}</td>
                        <td>{row.num_tab_switches}</td>
                        <td>{row.num_copy_paste_events}</td>
                        <td>{row.face_not_detected_pct}%</td>
                        <td>{row.final_score}</td>
                        <td>
                          {row.is_unusual_behaviour ? (
                            <span className="badge badge-warning">Unusual</span>
                          ) : (
                            <span className="badge badge-success">Normal</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Click <strong>GENERATE SYNTHETIC DATA</strong> to execute the synthetic data engine.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
