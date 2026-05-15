import type { Task, TaskStatus } from '../types';
import { TaskCard } from './TaskCard';

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  onDrop: (e: React.DragEvent, status: TaskStatus) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
}

const statusColors: Record<TaskStatus, string> = {
  todo: '#3b82f6',
  in_progress: '#f59e0b',
  done: '#10b981',
};

export function KanbanColumn({
  title,
  status,
  tasks,
  onTaskClick,
  onDrop,
  onDragStart,
}: KanbanColumnProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  return (
    <div
      className="kanban-column"
      onDragOver={handleDragOver}
      onDrop={(e) => onDrop(e, status)}
    >
      <div className="kanban-column-header" style={{ borderColor: statusColors[status] }}>
        <h3>{title}</h3>
        <span className="task-count">{tasks.length}</span>
      </div>
      <div className="kanban-column-body">
        {tasks.length === 0 ? (
          <div className="empty-column">No tasks</div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onClick={onTaskClick}
              onDragStart={onDragStart}
            />
          ))
        )}
      </div>
    </div>
  );
}
