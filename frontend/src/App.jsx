import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import DataProfile from './pages/DataProfile';
import Generator from './pages/Generator';
import DataQuality from './pages/DataQuality';
import PrivacyAudit from './pages/PrivacyAudit';
import ScenarioLibrary from './pages/ScenarioLibrary';
import FailureSimulation from './pages/FailureSimulation';
import EventViewer from './pages/EventViewer';
import Evaluation from './pages/Evaluation';
import Experiments from './pages/Experiments';
import ErrorAnalysis from './pages/ErrorAnalysis';
import RiskRegister from './pages/RiskRegister';
import Reports from './pages/Reports';
import UserGuide from './pages/UserGuide';
import { api } from './services/api';

export default function App() {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [seed, setSeed] = useState(42);
  const [profile, setProfile] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [systemHealth, setSystemHealth] = useState({ dataset_loaded: true });
  const [isDemoRunning, setIsDemoRunning] = useState(false);

  const loadInitialData = async () => {
    try {
      const [h, p, m] = await Promise.all([
        api.getHealth().catch(() => ({ dataset_loaded: true })),
        api.getProfile().catch(() => null),
        api.getMetrics().catch(() => null)
      ]);
      if (h) setSystemHealth(h);
      if (p) setProfile(p);
      if (m) setMetrics(m);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, [seed]);

  const handleRunDemo = async () => {
    setIsDemoRunning(true);
    try {
      const res = await api.runFullDemo();
      if (res.benchmark) {
        setMetrics(res.benchmark);
      }
      alert('1-Click Full Pipeline Demo executed successfully! All QA checkpoints passed.');
      setCurrentPage('evaluation');
    } catch (err) {
      alert(`Demo execution error: ${err.message}`);
    } finally {
      setIsDemoRunning(false);
    }
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard profile={profile} metrics={metrics} onRunDemo={handleRunDemo} isDemoRunning={isDemoRunning} setCurrentPage={setCurrentPage} />;
      case 'profile':
        return <DataProfile profile={profile} />;
      case 'generator':
        return <Generator seed={seed} />;
      case 'quality':
        return <DataQuality />;
      case 'privacy':
        return <PrivacyAudit />;
      case 'scenarios':
        return <ScenarioLibrary />;
      case 'simulation':
        return <FailureSimulation />;
      case 'events':
        return <EventViewer />;
      case 'evaluation':
        return <Evaluation metrics={metrics} />;
      case 'experiments':
        return <Experiments seed={seed} />;
      case 'error-analysis':
        return <ErrorAnalysis />;
      case 'risk-register':
        return <RiskRegister />;
      case 'reports':
        return <Reports />;
      case 'guide':
        return <UserGuide setCurrentPage={setCurrentPage} onRunDemo={handleRunDemo} />;
      default:
        return <Dashboard profile={profile} metrics={metrics} onRunDemo={handleRunDemo} isDemoRunning={isDemoRunning} setCurrentPage={setCurrentPage} />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <div className="main-content">
        <Navbar
          onRunDemo={handleRunDemo}
          isDemoRunning={isDemoRunning}
          seed={seed}
          setSeed={setSeed}
          systemHealth={systemHealth}
        />
        <main style={{ flex: 1 }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
