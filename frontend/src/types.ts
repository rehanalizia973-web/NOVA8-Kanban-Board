export type TaskStatus = 'todo' | 'in-progress' | 'done';

export const TASK_STATUSES: readonly TaskStatus[] = ['todo', 'in-progress', 'done'] as const;

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: 'To do',
  'in-progress': 'In progress',
  done: 'Done',
};

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
  created_at: string;
}

export interface TaskCreateInput {
  title: string;
  status?: TaskStatus;
}

export interface TaskUpdateInput {
  title?: string;
  status?: TaskStatus;
}
