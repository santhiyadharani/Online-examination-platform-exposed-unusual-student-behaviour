import React, { useState, useEffect } from 'react';
import { GitCommit, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import TimelineViewer from '../components/TimelineViewer';

export default function EventViewer() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const data = await api.getEvents();
      setEvents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Real-Time Examination Event Log & Stream Inspector</h1>
          <p className="page-subtitle">Inspect granular event sequences, payload hashes, delayed delivery badges, and idempotency status.</p>
        </div>
        <button onClick={fetchEvents} disabled={loading} className="btn btn-secondary">
          <RefreshCw className={loading ? 'animate-spin' : ''} size={16} /> Refresh Event Stream
        </button>
      </div>

      <TimelineViewer events={events} />
    </div>
  );
}
