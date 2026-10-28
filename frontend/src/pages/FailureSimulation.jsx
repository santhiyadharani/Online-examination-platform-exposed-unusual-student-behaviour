import React, { useState } from 'react';
import { Activity, Play, RefreshCw, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { api } from '../services/api';
import TimelineViewer from '../components/TimelineViewer';

export default function FailureSimulation() {
  const [scenarioType, setScenarioType] = useState('Mixed Failure');
  const [eventsCount, setEventsCount] = useState(100);
  const [delayRate, setDelayRate] = useState(10);
  const [duplicateRate, setDuplicateRate] = useState(5);
  const [outOfOrderRate, setOutOfOrderRate] = useState(10);
  const [networkFailureRate, setNetworkFailureRate] = useState(5);

  const [loading, setLoading] = useState(false);
  const [simResult, setSimResult] = useState(null);

  const handleRunSimulation = async () => {
    setLoading(true);
    try {
      const res = await api.runSimulation({
        scenario_type: scenarioType,
        events_count: eventsCount,
        delay_rate: delayRate / 100.0,
        duplicate_rate: duplicateRate / 100.0,
        out_of_order_rate: outOfOrderRate / 100.0,
        network_failure_rate: networkFailureRate / 100.0
      });
      setSimResult(res);
    } catch (err) {
      alert(`Simulation failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Failure Injection & Network Resilience Simulation</h1>
          <p className="page-subtitle">Inject delayed events, packet duplicates, out-of-order delivery, and disconnects to evaluate exam workflow recovery.</p>
        </div>
      </div>

      <div className="grid-3" style={{ marginBottom: '1.5rem' }}>
        {/* Simulation Controls */}
        <div className="glass-panel" style={{ padding: '1.5rem', gridColumn: 'span 1' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Simulation Parameters</h3>

          <div className="form-group">
            <label className="form-label">Scenario Presets</label>
            <select className="form-select" value={scenarioType} onChange={(e) => setScenarioType(e.target.value)}>
              <option value="Mixed Failure">Mixed Failure (All Anomalies)</option>
              <option value="Delayed Events">Delayed Events Only</option>
              <option value="Duplicate Submissions">Duplicate Submissions Only</option>
              <option value="Out-of-Order Packets">Out-of-Order Delivery Only</option>
              <option value="Weak Network">Weak Network (Disconnects)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Base Events Count: {eventsCount}</label>
            <select className="form-select" value={eventsCount} onChange={(e) => setEventsCount(Number(e.target.value))}>
              <option value={100}>100 Events</option>
              <option value={500}>500 Events</option>
              <option value={1000}>1,000 Events</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Delay Rate: {delayRate}%</label>
            <input type="range" min="0" max="50" value={delayRate} onChange={(e) => setDelayRate(Number(e.target.value))} />
          </div>

          <div className="form-group">
            <label className="form-label">Duplicate Rate: {duplicateRate}%</label>
            <input type="range" min="0" max="30" value={duplicateRate} onChange={(e) => setDuplicateRate(Number(e.target.value))} />
          </div>

          <div className="form-group">
            <label className="form-label">Out-of-Order Rate: {outOfOrderRate}%</label>
            <input type="range" min="0" max="40" value={outOfOrderRate} onChange={(e) => setOutOfOrderRate(Number(e.target.value))} />
          </div>

          <div className="form-group">
            <label className="form-label">Network Disconnect Rate: {networkFailureRate}%</label>
            <input type="range" min="0" max="30" value={networkFailureRate} onChange={(e) => setNetworkFailureRate(Number(e.target.value))} />
          </div>

          <button onClick={handleRunSimulation} disabled={loading} className="btn btn-primary" style={{ width: '100%', marginTop: '0.75rem', justifyContent: 'center' }}>
            {loading ? <RefreshCw className="animate-spin" size={16} /> : <Play size={16} />}
            RUN SIMULATION
          </button>
        </div>

        {/* Simulation Output Dashboard */}
        <div className="glass-panel" style={{ padding: '1.5rem', gridColumn: 'span 2' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Replay Engine & Recovery Results</h3>

          {simResult ? (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.85rem', marginBottom: '1.5rem' }}>
                <div style={{ padding: '0.85rem', background: 'rgba(15,23,42,0.6)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Events Arrival</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>{simResult.modified_arrival_events}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Original: {simResult.events_generated}</div>
                </div>

                <div style={{ padding: '0.85rem', background: 'rgba(15,23,42,0.6)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Delayed / Dups / OOO</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-amber)' }}>
                    {simResult.delayed_events} / {simResult.duplicate_events} / {simResult.out_of_order_events}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Anomalies Injected</div>
                </div>

                <div style={{ padding: '0.85rem', background: 'rgba(15,23,42,0.6)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Recovery Rate</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{simResult.recovery_rate_pct}%</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)' }}>Idempotent Replay</div>
                </div>

                <div style={{ padding: '0.85rem', background: 'rgba(15,23,42,0.6)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>State Corruption</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-emerald)' }}>{simResult.state_corruption_rate_pct}%</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--accent-emerald)' }}>0 Corrupted States</div>
                </div>
              </div>

              <TimelineViewer events={simResult.timeline || []} />
            </div>
          ) : (
            <div style={{ padding: '5rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              Click <strong>RUN SIMULATION</strong> to inject failure events and test replay recovery.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
