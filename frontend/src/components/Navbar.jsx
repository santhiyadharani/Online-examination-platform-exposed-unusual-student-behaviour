import React, { useState } from 'react';
import { Play, Sparkles, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { api } from '../services/api';

export default function Navbar({ onRunDemo, isDemoRunning, seed, setSeed, systemHealth }) {
  return (
    <header style={{
      height: '64px',
      background: 'rgba(15, 23, 42, 0.8)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 2rem',
      position: 'sticky',
      top: 0,
      zIndex: 40
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Status:</span>
          {systemHealth?.dataset_loaded ? (
            <span className="badge badge-success">
              <CheckCircle size={12} /> System Online
            </span>
          ) : (
            <span className="badge badge-warning">
              <AlertCircle size={12} /> Connecting...
            </span>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Random Seed:</span>
          <select 
            value={seed} 
            onChange={(e) => setSeed(Number(e.target.value))}
            className="form-select"
            style={{ padding: '0.25rem 0.6rem', fontSize: '0.8rem' }}
          >
            <option value={42}>42 (Default)</option>
            <option value={101}>101</option>
            <option value={2024}>2024</option>
            <option value={999}>999</option>
          </select>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onRunDemo}
          disabled={isDemoRunning}
          className="btn btn-primary"
          style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
        >
          {isDemoRunning ? (
            <>
              <RefreshCw size={16} className="animate-spin" />
              Executing Demo Pipeline...
            </>
          ) : (
            <>
              <Sparkles size={16} />
              RUN FULL DEMO
            </>
          )}
        </button>
      </div>
    </header>
  );
}
