from typing import List, Optional
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from app.deps import get_current_user, get_db
from app.models.user import User
from app.schemas.task import (
    TaskCreate,
    TaskOut,
    TaskStatusUpdate,
    TaskUpdate,
)
from app.services import tasks as task_service

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


@router.get("/", response_model=List[TaskOut])
def list_tasks(
    status: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return task_service.get_tasks(
        db, user_id=current_user.id, status=status, priority=priority
    )


@router.post("/", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_task(
    payload: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return task_service.create_task(db, payload, current_user.id)


@router.get("/{task_id}", response_model=TaskOut)
def get_task(
    task_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = task_service.get_task(db, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )
    return task


@router.put("/{task_id}", response_model=TaskOut)
def update_task(
    task_id: UUID,
    payload: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = task_service.get_task(db, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )
    return task_service.update_task(db, task, payload)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = task_service.get_task(db, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )
    task_service.delete_task(db, task)


@router.patch("/{task_id}/status", response_model=TaskOut)
def update_task_status(
    task_id: UUID,
    payload: TaskStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = task_service.get_task(db, task_id)
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )
    return task_service.update_task_status(db, task, payload.status)
