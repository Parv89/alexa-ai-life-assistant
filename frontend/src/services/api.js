const BASE_URL = import.meta.env.VITE_API_URL || '/api';

async function fetchJSON(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!res.ok) {
      let errMsg = `Request failed: ${res.status} ${res.statusText}`;
      try {
        const errorData = await res.json();
        if (errorData.error) errMsg = errorData.error;
      } catch (e) {
        // Fallback to status text
      }
      throw new Error(errMsg);
    }

    return await res.json();
  } catch (error) {
    console.error(`[API Error] ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // System Health
  getHealth: () => fetchJSON('/health'),

  // Tasks
  getTasks: (params = {}) => {
    const query = new URLSearchParams();
    if (params.category && params.category !== 'All') query.append('category', params.category);
    if (params.priority && params.priority !== 'all') query.append('priority', params.priority);
    if (params.completed !== undefined) query.append('completed', params.completed);
    if (params.search) query.append('search', params.search);
    const qs = query.toString();
    return fetchJSON(`/tasks${qs ? `?${qs}` : ''}`);
  },
  createTask: (data) => fetchJSON('/tasks', { method: 'POST', body: JSON.stringify(data) }),
  updateTask: (id, data) => fetchJSON(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  toggleTask: (id) => fetchJSON(`/tasks/${id}/toggle`, { method: 'PATCH' }),
  deleteTask: (id) => fetchJSON(`/tasks/${id}`, { method: 'DELETE' }),

  // Smart Home Devices
  getDevices: () => fetchJSON('/devices'),
  updateDeviceState: (id, state) => fetchJSON(`/devices/${id}/state`, { method: 'PATCH', body: JSON.stringify(state) }),
  activateScene: (sceneName) => fetchJSON(`/devices/scene/${sceneName}`, { method: 'POST' }),

  // AI Chat
  getChatHistory: () => fetchJSON('/chat/history'),
  sendChatMessage: (text, context = {}) => fetchJSON('/chat/message', { method: 'POST', body: JSON.stringify({ text, context }) }),
  clearChatHistory: () => fetchJSON('/chat/history', { method: 'DELETE' }),

  // Productivity Metrics
  getProductivitySummary: () => fetchJSON('/productivity/summary'),

  // Amazon Alexa & ASK Webhook Simulator
  getAlexaManifest: () => fetchJSON('/alexa/manifest'),
  getAlexaComplianceReport: () => fetchJSON('/alexa/compliance-report'),
  simulateAlexaIntent: (intentName, slots = {}) => fetchJSON('/alexa/simulate', {
    method: 'POST',
    body: JSON.stringify({ intentName, slots }),
  }),
};
