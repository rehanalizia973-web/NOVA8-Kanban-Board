import type { Task, TaskCreateInput, TaskUpdateInput } from '../types';
import { request } from './client';

export const listTasks = (): Promise<Task[]> => request<Task[]>('/tasks');

export const createTask = (input: TaskCreateInput): Promise<Task> =>
  request<Task>('/tasks', { method: 'POST', body: JSON.stringify(input) });

export const updateTask = (id: string, patch: TaskUpdateInput): Promise<Task> =>
  request<Task>(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(patch) });

export const deleteTask = (id: string): Promise<void> =>
  request<void>(`/tasks/${id}`, { method: 'DELETE' });
