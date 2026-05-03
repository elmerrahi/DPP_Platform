const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api/v1';

class ApiError extends Error {
  constructor(message, status, body) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

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
    // Parse the body if it claims to be JSON so callers can show
    // structured errors (e.g. our 422 validation report).
    let body;
    try {
      body = await response.json();
    } catch {
      body = null;
    }
    throw new ApiError(
      `Request failed: ${response.status}`,
      response.status,
      body
    );
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
    let body;
    try {
      body = await response.json();
    } catch {
      body = null;
    }
    throw new ApiError(
      `Request failed: ${response.status}`,
      response.status,
      body
    );
  }

  return response.json();
}

export function getProfile() {
  return request('/users/me');
}

export function getDashboard() {
  return request('/users/dashboard');
}

export { ApiError };
