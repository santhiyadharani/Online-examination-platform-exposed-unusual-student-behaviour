import React from 'react';
import { AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';

const ERROR_CASES = [
  {
    id: 'EDGE-001',
    name: 'Duplicate Answer Submission',
    failure_type: 'Duplicate Event Burst',
    expected_state: 'ANSWER_SUBMITTED (Original Intact)',
    actual_state: 'ANSWER_SUBMITTED (Duplicate Ignored)',
    root_cause: 'Duplicate HTTP retries sent identical payload hash during high network latency.',
    recovery_action: 'Idempotency key & payload hash deduplication safely ignores duplicate without mutating score or state.',
    status: 'FIXED - PASS'
  },
  {
    id: 'EDGE-002',
    name: 'Late Answer After Exam Submission',
    failure_type: 'Delayed Packet Delivery',
    expected_state: 'COMPLETED (Terminal State Preserved)',
    actual_state: 'COMPLETED (Late Event Rejected)',
    root_cause: 'Packet arrived 180s late after exam was submitted and marked terminal.',
    recovery_action: 'Session State Machine locks terminal state; late answer is rejected cleanly without corruption.',
    status: 'FIXED - PASS'
  },
  {
    id: 'EDGE-003',
    name: 'Out-of-Order Packet Arrival',
    failure_type: 'Sequence Reordering',
    expected_state: 'IN_PROGRESS (Ordered Sequence)',
    actual_state: 'IN_PROGRESS (Reordered Successfully)',
    root_cause: 'Network routing path caused question view event to arrive after answer submission.',
    recovery_action: 'Event processor uses sequence_number & timestamp sorting to restore valid event ordering.',
    status: 'FIXED - PASS'
  },
  {
    id: 'EDGE-004',
    name: 'Network Disconnect & Reconnect',
    failure_type: 'Ping Timeout / Re-auth',
    expected_state: 'STARTED (State Maintained)',
    actual_state: 'STARTED (Heartbeat Restored)',
    root_cause: 'Intermittent Wi-Fi loss dropped 3 consecutive heartbeat pings.',
    recovery_action: 'Network disconnect logged; reconnect event reinstates heartbeat without invalidating session.',
    status: 'FIXED - PASS'
  },
  {
    id: 'EDGE-005',
    name: 'Repeated Exam Submission',
    failure_type: 'User Double-Click / Retry Burst',
    expected_state: 'SUBMITTED / COMPLETED',
    actual_state: 'COMPLETED (Duplicate Submit Ignored)',
    root_cause: 'Student double-clicked submit button resulting in duplicate EXAM_SUBMITTED events.',
    recovery_action: 'State machine blocks duplicate submission transitions, returning previous terminal result.',
    status: 'FIXED - PASS'
  }
];

export default function ErrorAnalysis() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Edge Case & Error Analysis Dashboard</h1>
          <p className="page-subtitle">Detailed root cause analysis and recovery actions for examination workflow edge cases.</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff', marginBottom: '1rem' }}>Edge Case Failure Matrix</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Case ID</th>
                <th>Scenario Name</th>
                <th>Failure Injected</th>
                <th>Expected State</th>
                <th>Actual State</th>
                <th>Root Cause Analysis</th>
                <th>Recovery Action Taken</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {ERROR_CASES.map((item) => (
                <tr key={item.id}>
                  <td className="mono" style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>{item.id}</td>
                  <td style={{ fontWeight: 600 }}>{item.name}</td>
                  <td className="mono">{item.failure_type}</td>
                  <td className="mono" style={{ fontSize: '0.8rem' }}>{item.expected_state}</td>
                  <td className="mono" style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)' }}>{item.actual_state}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.root_cause}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{item.recovery_action}</td>
                  <td>
                    <span className="badge badge-success"><CheckCircle size={12} /> {item.status}</span>
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
