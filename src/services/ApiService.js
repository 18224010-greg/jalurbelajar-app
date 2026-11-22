import { API_BASE_URL, REQUEST_TIMEOUT_MS } from '../config';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status; // 0 = tidak ada respons dari server
  }
}

let authToken = null;
let unauthorizedHandler = null;

export function setAuthToken(token) {
  authToken = token;
}

// Dipanggil saat server menjawab 401 untuk permintaan yang memakai token (token kedaluwarsa).
export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = handler;
}

export function extractMessage(data, status) {
  if (data && typeof data.detail === 'string') return data.detail;
  if (data && Array.isArray(data.detail)) return 'Data yang dikirim tidak valid';
  return `Terjadi kesalahan pada server (kode ${status})`;
}

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (auth && authToken) headers.Authorization = `Bearer ${authToken}`;

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });
  } catch (error) {
    const message =
      error && error.name === 'AbortError'
        ? 'Server tidak merespons. Coba lagi sebentar lagi.'
        : 'Tidak dapat terhubung ke server. Periksa koneksi internet.';
    throw new ApiError(message, 0);
  } finally {
    clearTimeout(timer);
  }

  let data = null;
  const text = await response.text();
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = null;
    }
  }

  if (!response.ok) {
    if (response.status === 401 && auth && unauthorizedHandler) unauthorizedHandler();
    throw new ApiError(extractMessage(data, response.status), response.status);
  }
  return data;
}

function query(params) {
  const pairs = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '');
  if (pairs.length === 0) return '';
  return `?${pairs.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&')}`;
}

const ApiService = {
  register: (name, email, password) =>
    request('/auth/register', { method: 'POST', auth: false, body: { name, email, password } }),
  login: (email, password) =>
    request('/auth/login', { method: 'POST', auth: false, body: { email, password } }),
  getMe: () => request('/auth/me'),
  getModules: ({ topic, level } = {}) => request(`/modules${query({ topic, level })}`),
  getQuiz: (moduleId) => request(`/modules/${moduleId}/quiz`),
  submitQuiz: (quizId, answers) =>
    request(`/quizzes/${quizId}/submit`, { method: 'POST', body: { answers } }),
  getRecommendations: (topic) => request(`/recommendations${query({ topic })}`),
  getProgress: () => request('/students/me/progress'),
};

export default ApiService;
