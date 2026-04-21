import { useDroppable } from '@dnd-kit/core';

import { TaskCard } from './TaskCard';
import { STATUS_LABELS, type Task, type TaskStatus } from '../types';


interface Props {
  status: TaskStatus;
  tasks: Task[];
}

export function Column({ status, tasks }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <section
      className={`column ${isOver ? 'column-over' : ''}`}
      ref={setNodeRef}
      aria-label={`${STATUS_LABELS[status]} column`}
    >
      <header className="column-header">
        <h2>{STATUS_LABELS[status]}</h2>
        <span className="column-count">{tasks.length}</span>
      </header>
      <div className="column-body">
        {tasks.length === 0 ? (
          <p className="column-empty">Drop tasks here</p>
        ) : (
          tasks.map((t) => <TaskCard key={t.id} task={t} />)
        )}
      </div>
    </section>
  );
}
