import { useState, useEffect, useCallback } from 'react';
import type { Task, TaskStatus, TaskCreate, TaskUpdate } from '../types';
import { apiClient } from '../services/api';
import { KanbanColumn } from '../components/KanbanColumn';
import { TaskForm } from '../components/TaskForm';

const columns: { title: string; status: TaskStatus }[] = [
  { title: 'To Do', status: 'todo' },
  { title: 'In Progress', status: 'in_progress' },
  { title: 'Done', status: 'done' },
];

export function KanbanPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiClient.getTasks();
      setTasks(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const getColumnTasks = (status: TaskStatus) =>
    tasks.filter((t) => t.status === status);

  const handleDragStart = (_e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
  };

  const handleDrop = async (_e: React.DragEvent, status: TaskStatus) => {
    if (!draggedTask || draggedTask.status === status) {
      setDraggedTask(null);
      return;
    }

    // Optimistic update
    const updatedTasks = tasks.map((t) =>
      t.id === draggedTask.id ? { ...t, status } : t
    );
    setTasks(updatedTasks);
    setDraggedTask(null);

    try {
      await apiClient.updateTaskStatus(draggedTask.id, { status });
    } catch (err: unknown) {
      // Revert on error
      setError(err instanceof Error ? err.message : 'Failed to update status');
      fetchTasks();
    }
  };

  const handleCreate = () => {
    setEditingTask(null);
    setShowForm(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleSave = async (data: TaskCreate | TaskUpdate) => {
    try {
      if (editingTask) {
        await apiClient.updateTask(editingTask.id, data);
      } else {
        await apiClient.createTask(data as TaskCreate);
      }
      setShowForm(false);
      setEditingTask(null);
      fetchTasks();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save task');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  return (
    <div className="kanban-page">
      <div className="page-header">
        <h2>Kanban Board</h2>
        <button className="btn btn-primary" onClick={handleCreate}>
          + New Task
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-container">
          <div className="spinner" />
        </div>
      ) : (
        <div className="kanban-board">
          {columns.map((col) => (
            <KanbanColumn
              key={col.status}
              title={col.title}
              status={col.status}
              tasks={getColumnTasks(col.status)}
              onTaskClick={handleEdit}
              onDrop={handleDrop}
              onDragStart={handleDragStart}
            />
          ))}
        </div>
      )}

      <TaskForm
        isOpen={showForm}
        onClose={handleCloseForm}
        onSave={handleSave}
        task={editingTask}
      />
    </div>
  );
}
