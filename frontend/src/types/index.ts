export type TaskStatus = 'todo' | 'in_progress' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';

export interface User {
  id: number;
  email: string;
  full_name: string;
  created_at: string;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  assignee_id: number | null;
  created_by: number;
  created_at: string;
  updated_at: string;
  assignee?: User | null;
}

export interface ApiError {
  detail: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  full_name: string;
  password: string;
}

export interface TaskCreate {
  title: string;
  description: string;
  status?: TaskStatus;
  priority: TaskPriority;
  due_date?: string | null;
  assignee_id?: number | null;
}

export interface TaskUpdate {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
  assignee_id?: number | null;
}

export interface TaskStatusUpdate {
  status: TaskStatus;
}
