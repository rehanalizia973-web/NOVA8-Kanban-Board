import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

import type { Task } from '../types';
import { formatDate } from '../lib/formatDate';
import { useDeleteTask } from '../hooks/useTasks';


interface Props {
  task: Task;
}

export function TaskCard({ task }: Props) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
  });
  const del = useDeleteTask();

  const style = {
    transform: CSS.Translate.toString(transform),
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div className="task-card" ref={setNodeRef} style={style}>
      {/* Drag handle is only the title/meta area so the delete button still receives clicks. */}
      <div className="task-card-drag" {...listeners} {...attributes}>
        <p className="task-card-title">{task.title}</p>
        <div className="task-card-meta">
          <span className="task-card-id" title={task.id}>
            #{task.id.slice(0, 8)}
          </span>
          <time dateTime={task.created_at}>{formatDate(task.created_at)}</time>
        </div>
      </div>
      <button
        type="button"
        className="task-card-delete"
        aria-label={`Delete task: ${task.title}`}
        onClick={() => del.mutate(task.id)}
      >
        ×
      </button>
    </div>
  );
}
