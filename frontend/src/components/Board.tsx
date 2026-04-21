import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';

import { Column } from './Column';
import { NewTaskForm } from './NewTaskForm';
import { useTasks, useUpdateTask } from '../hooks/useTasks';
import { TASK_STATUSES, type Task, type TaskStatus } from '../types';


function groupByStatus(tasks: Task[]): Record<TaskStatus, Task[]> {
  const groups: Record<TaskStatus, Task[]> = {
    todo: [],
    'in-progress': [],
    done: [],
  };
  for (const t of tasks) groups[t.status].push(t);
  return groups;
}

function isTaskStatus(value: unknown): value is TaskStatus {
  return typeof value === 'string' && (TASK_STATUSES as readonly string[]).includes(value);
}

export function Board() {
  const { data: tasks, isLoading, error, refetch } = useTasks();
  const updateTask = useUpdateTask();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor),
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const targetStatus = over.id;
    if (!isTaskStatus(targetStatus)) return;
    const task = tasks?.find((t) => t.id === active.id);
    if (!task || task.status === targetStatus) return;
    updateTask.mutate({ id: task.id, patch: { status: targetStatus } });
  };

  return (
    <div className="board-wrapper">
      <header className="app-header">
        <h1>Kanban</h1>
        <NewTaskForm />
      </header>

      {isLoading && <p className="board-status">Loading tasks…</p>}
      {error && (
        <div className="board-status board-error">
          <p>Failed to load tasks: {(error as Error).message}</p>
          <button onClick={() => void refetch()}>Retry</button>
        </div>
      )}

      {tasks && (
        <DndContext sensors={sensors} onDragEnd={onDragEnd}>
          <div className="board">
            {TASK_STATUSES.map((status) => (
              <Column
                key={status}
                status={status}
                tasks={groupByStatus(tasks)[status]}
              />
            ))}
          </div>
        </DndContext>
      )}
    </div>
  );
}
