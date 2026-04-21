import { useState, type FormEvent } from 'react';

import { useCreateTask } from '../hooks/useTasks';

export function NewTaskForm() {
  const [title, setTitle] = useState('');
  const create = useCreateTask();

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    create.mutate(
      { title: trimmed },
      { onSuccess: () => setTitle('') },
    );
  };

  return (
    <form className="new-task-form" onSubmit={submit}>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="New task title"
        aria-label="New task title"
        maxLength={200}
        disabled={create.isPending}
      />
      <button type="submit" disabled={create.isPending || !title.trim()}>
        {create.isPending ? 'Adding…' : 'Add'}
      </button>
    </form>
  );
}
