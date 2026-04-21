from sqlalchemy import select
from app.models.task import Task
from sqlalchemy.orm import Session
from collections.abc import Sequence
from app.core.exceptions import TaskNotFound
from app.schemas.task import TaskCreate, TaskUpdate


def list_tasks(db: Session) -> Sequence[Task]:
    return db.scalars(select(Task).order_by(Task.created_at.asc())).all()


def create_task(db: Session, data: TaskCreate) -> Task:
    task = Task(title=data.title, status=data.status.value)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def update_task(db: Session, task_id: str, patch: TaskUpdate) -> Task:
    task = db.get(Task, task_id)
    if task is None:
        raise TaskNotFound(task_id)

    updates = patch.model_dump(exclude_unset=True)
    if "title" in updates:
        task.title = updates["title"]
    if "status" in updates:
        task.status = updates["status"].value

    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task_id: str) -> None:
    task = db.get(Task, task_id)
    if task is None:
        raise TaskNotFound(task_id)
    db.delete(task)
    db.commit()
