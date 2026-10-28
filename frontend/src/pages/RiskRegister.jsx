import React, { useState, useEffect } from 'react';
import { ShieldAlert, Plus, CheckCircle, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export default function RiskRegister() {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newRisk, setNewRisk] = useState('');
  const [newImpact, setNewImpact] = useState('Medium');
  const [newProb, setNewProb] = useState('Medium');
  const [newMitigation, setNewMitigation] = useState('');

  const fetchRisks = async () => {
    setLoading(true);
    try {
      const data = await api.getRiskRegister();
      setRisks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRisks();
  }, []);

  const handleAddRisk = async (e) => {
    e.preventDefault();
    if (!newRisk || !newMitigation) return;

    try {
      await api.addRiskItem({
        risk: newRisk,
        impact: newImpact,
        probability: newProb,
        mitigation: newMitigation,
        status: 'Active'
      });
      setNewRisk('');
      setNewMitigation('');
      fetchRisks();
    } catch (err) {
      alert(`Failed to add risk: ${err.message}`);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Project Risk Register</h1>
          <p className="page-subtitle">Technical and operational risk register for synthetic examination data generation & failure testing.</p>
        </div>
      </div>

      {/* Add Risk Form */}
      <div className="glass-panel" style={{ padding: '1.25rem', marginBottom: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#fff', marginBottom: '0.75rem' }}>Add New Risk Entry</h3>
        <form onSubmit={handleAddRisk} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 3fr 1fr', gap: '0.75rem', alignItems: 'end' }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Risk Description</label>
            <input className="form-input" placeholder="e.g. Memory spike on large CSV" value={newRisk} onChange={(e) => setNewRisk(e.target.value)} required />
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Impact</label>
            <select className="form-select" value={newImpact} onChange={(e) => setNewImpact(e.target.value)}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Probability</label>
            <select className="form-select" value={newProb} onChange={(e) => setNewProb(e.target.value)}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Mitigation Strategy</label>
            <input className="form-input" placeholder="e.g. Chunked streaming" value={newMitigation} onChange={(e) => setNewMitigation(e.target.value)} required />
          </div>

          <button type="submit" className="btn btn-primary" style={{ justifyContent: 'center' }}>
            <Plus size={16} /> Add Risk
          </button>
        </form>
      </div>

      {/* Risk Register Table */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Active Risk Matrix</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Risk ID</th>
                <th>Risk Description</th>
                <th>Impact</th>
                <th>Probability</th>
                <th>Mitigation Strategy</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {risks.map((item) => (
                <tr key={item.id}>
                  <td className="mono" style={{ color: 'var(--accent-cyan)' }}>RSK-{item.id.toString().padStart(3, '0')}</td>
                  <td style={{ fontWeight: 600 }}>{item.risk}</td>
                  <td>
                    <span className={`badge badge-${item.impact === 'Critical' || item.impact === 'High' ? 'danger' : item.impact === 'Medium' ? 'warning' : 'neutral'}`}>
                      {item.impact}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${item.probability === 'High' ? 'warning' : 'neutral'}`}>
                      {item.probability}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{item.mitigation}</td>
                  <td>
                    <span className={`badge badge-${item.status === 'Mitigated' ? 'success' : 'info'}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
