from app.api.deps import get_db
from sqlalchemy.orm import Session
from fastapi import APIRouter, Depends, status
from app.services import tasks as tasks_service
from app.schemas.task import TaskCreate, TaskOut, TaskUpdate


router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("", response_model=list[TaskOut])
def list_tasks(db: Session = Depends(get_db)) -> list[TaskOut]:
    return [TaskOut.model_validate(t) for t in tasks_service.list_tasks(db)]


@router.post("", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(payload: TaskCreate, db: Session = Depends(get_db)) -> TaskOut:
    return TaskOut.model_validate(tasks_service.create_task(db, payload))


@router.patch("/{task_id}", response_model=TaskOut)
def update_task(
    task_id: str,
    payload: TaskUpdate,
    db: Session = Depends(get_db),
) -> TaskOut:
    return TaskOut.model_validate(tasks_service.update_task(db, task_id, payload))


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: str, db: Session = Depends(get_db)) -> None:
    tasks_service.delete_task(db, task_id)
