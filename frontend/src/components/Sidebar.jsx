import React from 'react';
import {
  LayoutDashboard,
  Database,
  Cpu,
  CheckCircle2,
  ShieldCheck,
  BookOpen,
  Activity,
  GitCommit,
  BarChart3,
  FlaskConical,
  AlertTriangle,
  FileText,
  HelpCircle,
  ShieldAlert
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'profile', label: 'Data Profile', icon: Database },
  { id: 'generator', label: 'Synthetic Generator', icon: Cpu },
  { id: 'quality', label: 'Data Quality', icon: CheckCircle2 },
  { id: 'privacy', label: 'Privacy Audit', icon: ShieldCheck },
  { id: 'scenarios', label: 'Scenario Library', icon: BookOpen },
  { id: 'simulation', label: 'Failure Simulation', icon: Activity },
  { id: 'events', label: 'Event Viewer', icon: GitCommit },
  { id: 'evaluation', label: 'Evaluation', icon: BarChart3 },
  { id: 'experiments', label: 'Experiments', icon: FlaskConical },
  { id: 'error-analysis', label: 'Error Analysis', icon: AlertTriangle },
  { id: 'risk-register', label: 'Risk Register', icon: ShieldAlert },
  { id: 'reports', label: 'Reports', icon: FileText },
  { id: 'guide', label: 'User Guide', icon: HelpCircle }
];

export default function Sidebar({ currentPage, setCurrentPage }) {
  return (
    <aside style={{
      position: 'fixed',
      top: 0,
      left: 0,
      bottom: 0,
      width: '260px',
      background: 'rgba(15, 23, 42, 0.95)',
      borderRight: '1px solid var(--border-color)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 50,
      backdropFilter: 'blur(16px)'
    }}>
      <div style={{
        padding: '1.5rem 1.25rem',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '10px',
          background: 'linear-gradient(135deg, var(--accent-cyan), var(--accent-blue))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fff',
          fontWeight: 800
        }}>
          ES
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.02em', color: '#fff' }}>EXAMSAFE</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 600 }}>Synthetic QA Lab</div>
        </div>
      </div>

      <nav style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.75rem' }}>
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.65rem 0.85rem',
                borderRadius: '8px',
                border: 'none',
                background: isActive ? 'linear-gradient(90deg, rgba(6,182,212,0.15) 0%, rgba(59,130,246,0.1) 100%)' : 'transparent',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 400,
                fontSize: '0.875rem',
                cursor: 'pointer',
                marginBottom: '0.25rem',
                borderLeft: isActive ? '3px solid var(--accent-cyan)' : '3px solid transparent',
                textAlign: 'left',
                transition: 'all 0.15s ease'
              }}
            >
              <Icon size={18} color={isActive ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div style={{ padding: '1rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <div>ExamSafe QA Lab v1.0</div>
        <div>Status: Field-Ready MVP</div>
      </div>
    </aside>
  );
}
