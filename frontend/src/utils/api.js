const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1';

async function request(path, options = {}) {
  const token = localStorage.getItem('dpp_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers ?? {})
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export function signIn(payload) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function signUp(payload) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export function createDpp(payload) {
  return request('/dpp', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

export async function auditDpp(file) {
  const token = localStorage.getItem('dpp_token');
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_BASE}/audit`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json();
}

export function getProfile() {
  return request('/users/me');
}

export function getDashboard() {
  return request('/users/dashboard');
}
