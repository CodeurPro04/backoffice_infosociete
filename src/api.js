const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8000'

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
    ...options,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || 'Une erreur est survenue.')
  }

  return data
}

export function adminLogin(payload) {
  return request('/api/admin/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function fetchAdminSubmissions(token) {
  return request('/api/admin/submissions', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export function fetchAdminSubmissionsByType(token, type) {
  return request(`/api/admin/submissions/${type}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

