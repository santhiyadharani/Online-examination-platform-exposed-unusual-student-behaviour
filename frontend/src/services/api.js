const API_BASE = '/api';

async function fetchAPI(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ detail: response.statusText }));
      throw new Error(errorData.detail || `HTTP Error ${response.status}`);
    }
    return await response.json();
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  getHealth: () => fetchAPI('/health'),
  getProfile: () => fetchAPI('/profile'),
  generateData: (data) => fetchAPI('/generate', { method: 'POST', body: JSON.stringify(data) }),
  generateBaseline: (data) => fetchAPI('/generate/baseline', { method: 'POST', body: JSON.stringify(data) }),
  validateSchema: () => fetchAPI('/validate/schema', { method: 'POST' }),
  validateReferential: () => fetchAPI('/validate/referential', { method: 'POST' }),
  validateDistribution: () => fetchAPI('/validate/distribution', { method: 'POST' }),
  validatePrivacy: () => fetchAPI('/validate/privacy', { method: 'POST' }),
  getScenarios: () => fetchAPI('/scenarios'),
  runSimulation: (data) => fetchAPI('/simulation/run', { method: 'POST', body: JSON.stringify(data) }),
  getEvents: () => fetchAPI('/events'),
  replayEvents: (events) => fetchAPI('/events/replay', { method: 'POST', body: JSON.stringify(events) }),
  runExperiment: (data) => fetchAPI('/experiments/run', { method: 'POST', body: JSON.stringify(data) }),
  getExperiments: () => fetchAPI('/experiments'),
  getMetrics: () => fetchAPI('/metrics'),
  getReports: () => fetchAPI('/reports'),
  runFullDemo: () => fetchAPI('/demo/run', { method: 'POST' }),
  getRiskRegister: () => fetchAPI('/risk-register'),
  addRiskItem: (data) => fetchAPI('/risk-register', { method: 'POST', body: JSON.stringify(data) }),
  getSchemaRules: () => fetchAPI('/schema/rules'),
};
