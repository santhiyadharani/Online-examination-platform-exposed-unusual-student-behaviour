import React, { useState } from 'react';
import { Clock, ShieldAlert, CheckCircle, AlertOctagon, Repeat, Layers } from 'lucide-react';

export default function TimelineViewer({ events = [] }) {
  const [filter, setFilter] = useState('ALL');

  const filteredEvents = events.filter((e) => {
    if (filter === 'ALL') return true;
    if (filter === 'PROCESSED') return e.processing_status === 'PROCESSED';
    if (filter === 'DELAYED') return e.is_delayed;
    if (filter === 'DUPLICATE') return e.is_duplicate || e.processing_status === 'DUPLICATE_IGNORED';
    if (filter === 'REJECTED') return e.processing_status === 'REJECTED';
    if (filter === 'OUT_OF_ORDER') return e.is_out_of_order;
    return true;
  });

  const getStatusBadge = (evt) => {
    if (evt.processing_status === 'DUPLICATE_IGNORED' || evt.is_duplicate) {
      return <span className="badge badge-warning"><Repeat size={12} /> DUPLICATE - IGNORED</span>;
    }
    if (evt.is_delayed) {
      return <span className="badge badge-info"><Clock size={12} /> DELAYED</span>;
    }
    if (evt.is_out_of_order) {
      return <span className="badge badge-warning"><Layers size={12} /> OUT OF ORDER</span>;
    }
    if (evt.processing_status === 'REJECTED') {
      return <span className="badge badge-danger"><AlertOctagon size={12} /> REJECTED</span>;
    }
    return <span className="badge badge-success"><CheckCircle size={12} /> PROCESSED</span>;
  };

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>Examination Event Stream Timeline</h3>
        
        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {['ALL', 'PROCESSED', 'DELAYED', 'DUPLICATE', 'REJECTED', 'OUT_OF_ORDER'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.3rem 0.65rem',
                borderRadius: '6px',
                border: '1px solid var(--border-color)',
                background: filter === f ? 'var(--accent-cyan)' : 'rgba(15,23,42,0.6)',
                color: filter === f ? '#fff' : 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {f.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '550px', overflowY: 'auto' }}>
        {filteredEvents.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No events match the selected filter criteria.
          </div>
        ) : (
          filteredEvents.map((evt, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(15, 23, 42, 0.5)',
                border: '1px solid var(--border-color)',
                borderRadius: '8px',
                padding: '0.85rem 1.1rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '1rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', fontWeight: 600, width: '45px' }}>
                  #{evt.sequence_number || idx + 1}
                </span>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#fff' }}>
                    {evt.event_type}
                  </div>
                  <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    ID: {evt.event_id} | TS: {evt.event_timestamp}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                {getStatusBadge(evt)}
                <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.05)', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                  State: {evt.session_state_after || 'IN_PROGRESS'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
