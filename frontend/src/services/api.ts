import type {
  User,
  Task,
  TaskCreate,
  TaskUpdate,
  TaskStatusUpdate,
  LoginRequest,
  RegisterRequest,
  ApiError,
} from '../types';

const API_BASE = '/api';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

function buildQueryString(params: Record<string, string | undefined>): string {
  const entries = Object.entries(params).filter(
    ([, v]) => v !== undefined && v !== ''
  );
  if (entries.length === 0) return '';
  return '?' + new URLSearchParams(entries.map(([k, v]) => [k, v!])).toString();
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let detail = `HTTP ${response.status}`;
    try {
      const errorBody: ApiError = await response.json();
      if (errorBody.detail) {
        detail = errorBody.detail;
      }
    } catch {
      // ignore parse errors
    }
    throw new Error(detail);
  }
  return response.json();
}

export const apiClient = {
  // Auth
  async login(data: LoginRequest): Promise<{ access_token: string; token_type: string }> {
    const formData = new URLSearchParams();
    formData.append('username', data.email);
    formData.append('password', data.password);

    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString(),
    });
    return handleResponse(response);
  },

  async register(data: RegisterRequest): Promise<User> {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async getMe(): Promise<User> {
    const response = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  // Tasks
  async getTasks(params?: {
    status?: string;
    priority?: string;
    search?: string;
  }): Promise<Task[]> {
    const query = params ? buildQueryString(params) : '';
    const response = await fetch(`${API_BASE}/tasks${query}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async createTask(data: TaskCreate): Promise<Task> {
    const response = await fetch(`${API_BASE}/tasks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async getTask(id: number): Promise<Task> {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  async updateTask(id: number, data: TaskUpdate): Promise<Task> {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },

  async deleteTask(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/tasks/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) {
      await handleResponse(response);
    }
  },

  async updateTaskStatus(id: number, data: TaskStatusUpdate): Promise<Task> {
    const response = await fetch(`${API_BASE}/tasks/${id}/status`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse(response);
  },
};
