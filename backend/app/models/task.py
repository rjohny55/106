import uuid
from datetime import datetime

from sqlalchemy import Column, DateTime, Enum, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class TaskStatus(str, Enum):
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"


class TaskPriority(str, Enum):
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class Task(Base):
    __tablename__ = "tasks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    status = Column(
        Enum(TaskStatus),
        default=TaskStatus.TODO,
        nullable=False,
    )
    priority = Column(
        Enum(TaskPriority),
        default=TaskPriority.MEDIUM,
        nullable=False,
    )
    due_date = Column(DateTime, nullable=True)
    assignee_id = Column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=True
    )
    created_by = Column(
        UUID(as_uuid=True), ForeignKey("users.id"), nullable=False
    )
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(
        DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False
    )

    assignee = relationship("User", foreign_keys=[assignee_id])
    creator = relationship("User", foreign_keys=[created_by])
