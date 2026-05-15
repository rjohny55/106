import type { Task } from '../types';

interface TaskCardProps {
  task: Task;
  onClick?: (task: Task) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, task: Task) => void;
}

const priorityColors: Record<string, string> = {
  low: '#6b7280',
  medium: '#f59e0b',
  high: '#ef4444',
  critical: '#7c3aed',
};

export function TaskCard({ task, onClick, draggable, onDragStart }: TaskCardProps) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div
      className={`task-card priority-${task.priority}`}
      draggable={draggable ?? true}
      onDragStart={(e) => onDragStart?.(e, task)}
      onClick={() => onClick?.(task)}
    >
      <div className="task-card-header">
        <span className="task-card-title">{task.title}</span>
        <span
          className="priority-badge"
          style={{ backgroundColor: priorityColors[task.priority] || '#6b7280' }}
        >
          {task.priority}
        </span>
      </div>
      {task.description && (
        <p className="task-card-description">{task.description}</p>
      )}
      <div className="task-card-meta">
        {task.assignee && (
          <span className="task-card-assignee">
            {task.assignee.full_name}
          </span>
        )}
        {task.due_date && (
          <span className="task-card-due">{formatDate(task.due_date)}</span>
        )}
      </div>
    </div>
  );
}
