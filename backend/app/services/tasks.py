from datetime import datetime
from typing import List, Optional
from uuid import UUID

from sqlalchemy.orm import Session

from app.models.task import Task, TaskStatus
from app.schemas.task import TaskCreate, TaskUpdate


def get_tasks(
    db: Session,
    user_id: UUID,
    status: Optional[str] = None,
    priority: Optional[str] = None,
) -> List[Task]:
    query = db.query(Task).filter(
        (Task.assignee_id == user_id) | (Task.created_by == user_id)
    )
    if status:
        query = query.filter(Task.status == status)
    if priority:
        query = query.filter(Task.priority == priority)
    return query.order_by(Task.created_at.desc()).all()


def create_task(
    db: Session, task_in: TaskCreate, user_id: UUID
) -> Task:
    task = Task(
        title=task_in.title,
        description=task_in.description,
        priority=task_in.priority or "medium",
        due_date=task_in.due_date,
        assignee_id=task_in.assignee_id,
        created_by=user_id,
    )
    db.add(task)
    db.commit()
    db.refresh(task)
    return task


def get_task(db: Session, task_id: UUID) -> Optional[Task]:
    return db.query(Task).filter(Task.id == task_id).first()


def update_task(
    db: Session, task: Task, task_in: TaskUpdate
) -> Task:
    update_data = task_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(task, field, value)
    task.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(task)
    return task


def delete_task(db: Session, task: Task) -> None:
    db.delete(task)
    db.commit()


def update_task_status(
    db: Session, task: Task, status: str
) -> Task:
    task.status = status
    task.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(task)
    return task
