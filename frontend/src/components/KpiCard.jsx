import React from 'react';

export default function KpiCard({ title, value, subtext, icon: Icon, color = 'cyan', status }) {
  const colorMap = {
    cyan: 'var(--accent-cyan)',
    blue: 'var(--accent-blue)',
    purple: 'var(--accent-purple)',
    emerald: 'var(--accent-emerald)',
    amber: 'var(--accent-amber)',
    rose: 'var(--accent-rose)',
  };

  const accentColor = colorMap[color] || colorMap.cyan;

  return (
    <div className="glass-panel" style={{ padding: '1.25rem', position: 'relative', overflow: 'hidden' }}>
      <div style={{
        position: 'absolute',
        top: '-15px',
        right: '-15px',
        width: '70px',
        height: '70px',
        borderRadius: '50%',
        background: accentColor,
        opacity: 0.08,
        filter: 'blur(15px)',
        pointerEvents: 'none'
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{title}</span>
        {Icon && (
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: `${accentColor}18`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accentColor
          }}>
            <Icon size={18} />
          </div>
        )}
      </div>

      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', marginBottom: '0.25rem' }}>
        {value}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{subtext}</span>
        {status && (
          <span className={`badge badge-${status.type}`}>
            {status.text}
          </span>
        )}
      </div>
    </div>
  );
}
