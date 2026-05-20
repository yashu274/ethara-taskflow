import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { StatusBadge, PriorityBadge, Avatar, Skeleton, EmptyState, ConfirmModal, PageHeader } from '../components/common/UI';
import { Plus, CheckSquare, X, Search, Filter, Trash2, ChevronDown } from 'lucide-react';

function TaskModal({ isOpen, onClose, onSuccess, task, defaultProject }) {
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm();
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    Promise.all([api.get('/projects'), api.get('/auth/users')])
      .then(([pRes, uRes]) => {
        setProjects(pRes.data.projects || []);
        setUsers(uRes.data.users || []);
      }).catch(() => {});

    if (task) {
      setValue('title', task.title);
      setValue('description', task.description);
      setValue('status', task.status);
      setValue('priority', task.priority);
      setValue('deadline', task.deadline ? task.deadline.split('T')[0] : '');
      setValue('project', task.project?._id || task.project);
      setValue('assignedTo', task.assignedTo?._id || task.assignedTo || '');
    } else {
      reset();
      if (defaultProject) setValue('project', defaultProject);
    }
  }, [task, isOpen, defaultProject]);

  const onSubmit = async (data) => {
    try {
      if (task) {
        await api.patch(`/tasks/${task._id}`, data);
        toast.success('Task updated');
      } else {
        await api.post('/tasks', data);
        toast.success('Task created');
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#f5f5f0' }}>
            {task ? 'Edit Task' : 'New Task'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#444440' }}>
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="form-label">Title</label>
            <input className="eth-input" placeholder="Task title" {...register('title', { required: 'Title is required' })} />
            {errors.title && <span style={{ color: '#fb7185', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.title.message}</span>}
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea className="eth-input" placeholder="What needs to be done?" rows={2} style={{ resize: 'vertical' }} {...register('description')} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label">Status</label>
              <select className="eth-input" {...register('status')}>
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="form-label">Priority</label>
              <select className="eth-input" {...register('priority')}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>
          </div>

          <div>
            <label className="form-label">Project</label>
            <select className="eth-input" {...register('project', { required: 'Project is required' })}>
              <option value="">Select project</option>
              {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
            </select>
            {errors.project && <span style={{ color: '#fb7185', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.project.message}</span>}
          </div>

          <div>
            <label className="form-label">Assign to</label>
            <select className="eth-input" {...register('assignedTo')}>
              <option value="">Unassigned</option>
              {users.map(u => <option key={u._id} value={u._id}>{u.name} ({u.role})</option>)}
            </select>
          </div>

          <div>
            <label className="form-label">Deadline</label>
            <input type="date" className="eth-input" {...register('deadline')} />
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '4px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : task ? 'Update' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Quick status change for members
function StatusDropdown({ task, onUpdate }) {
  const [open, setOpen] = useState(false);
  const statuses = ['todo', 'in-progress', 'completed'];

  const handleChange = async (status) => {
    try {
      await api.patch(`/tasks/${task._id}`, { status });
      toast.success('Status updated');
      onUpdate();
      setOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <button onClick={() => setOpen(!open)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <StatusBadge status={task.status} />
        <ChevronDown size={11} color="#444440" />
      </button>
      {open && (
        <div style={{ position: 'absolute', top: '100%', left: 0, zIndex: 50, background: '#111111', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '4px', minWidth: '130px', marginTop: '4px' }}>
          {statuses.map(s => (
            <button key={s} onClick={() => handleChange(s)}
              style={{ display: 'block', width: '100%', textAlign: 'left', background: 'none', border: 'none', cursor: 'pointer', padding: '6px 8px', borderRadius: '4px' }}
              onMouseEnter={e => e.currentTarget.style.background = '#1a1a1a'}
              onMouseLeave={e => e.currentTarget.style.background = 'none'}>
              <StatusBadge status={s} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Tasks() {
  const { isAdmin } = useAuth();
  const [searchParams] = useSearchParams();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: '', priority: '' });

  const defaultProject = searchParams.get('project');

  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.status) params.set('status', filters.status);
      if (filters.priority) params.set('priority', filters.priority);
      if (search) params.set('search', search);
      if (defaultProject) params.set('project', defaultProject);
      const res = await api.get(`/tasks?${params}`);
      setTasks(res.data.tasks || []);
    } catch (err) {
      toast.error('Failed to load tasks');
    } finally {
      setLoading(false);
    }
  }, [filters, search, defaultProject]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await api.delete(`/tasks/${deleteConfirm._id}`);
      toast.success('Task deleted');
      setDeleteConfirm(null);
      fetchTasks();
    } catch (err) {
      toast.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ padding: '32px 36px', maxWidth: '1100px' }}>
      <PageHeader
        title="Tasks"
        subtitle={`${tasks.length} task${tasks.length !== 1 ? 's' : ''}`}
        action={isAdmin && (
          <button className="btn-primary" onClick={() => { setEditTask(null); setModalOpen(true); }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '9px 16px' }}>
            <Plus size={14} /> New Task
          </button>
        )}
      />

      {/* Filters */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '200px' }}>
          <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#444440' }} />
          <input
            className="eth-input"
            placeholder="Search tasks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '36px' }}
          />
        </div>
        <select className="eth-input" value={filters.status} onChange={e => setFilters(f => ({ ...f, status: e.target.value }))} style={{ width: 'auto', minWidth: '130px' }}>
          <option value="">All Status</option>
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="overdue">Overdue</option>
        </select>
        <select className="eth-input" value={filters.priority} onChange={e => setFilters(f => ({ ...f, priority: e.target.value }))} style={{ width: 'auto', minWidth: '130px' }}>
          <option value="">All Priority</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="critical">Critical</option>
        </select>
      </div>

      {/* Table */}
      <div className="glass-card" style={{ overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[...Array(7)].map((_, i) => <Skeleton key={i} height={48} />)}
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState
            icon={<CheckSquare size={40} />}
            title="No tasks found"
            description={isAdmin ? "Create your first task to get started." : "No tasks assigned to you yet."}
            action={isAdmin && (
              <button className="btn-primary" onClick={() => setModalOpen(true)}>Create Task</button>
            )}
          />
        ) : (
          <table className="eth-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Assignee</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due</th>
                {isAdmin && <th></th>}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {tasks.map((task) => (
                  <motion.tr
                    key={task._id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <td>
                      <div>
                        <div style={{ color: '#d0d0ca', fontWeight: 500, fontSize: '13.5px' }}>{task.title}</div>
                        {task.description && (
                          <div style={{ color: '#444440', fontSize: '11.5px', marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '260px' }}>
                            {task.description}
                          </div>
                        )}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: task.project?.color || '#6366f1', flexShrink: 0 }} />
                        <span style={{ fontSize: '12.5px' }}>{task.project?.name || '—'}</span>
                      </div>
                    </td>
                    <td>
                      {task.assignedTo ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Avatar name={task.assignedTo.name} size={22} />
                          <span style={{ fontSize: '12.5px' }}>{task.assignedTo.name}</span>
                        </div>
                      ) : <span style={{ color: '#333330', fontSize: '13px' }}>—</span>}
                    </td>
                    <td><PriorityBadge priority={task.priority} /></td>
                    <td>
                      <StatusDropdown task={task} onUpdate={fetchTasks} />
                    </td>
                    <td style={{ fontSize: '12px', color: task.deadline && new Date(task.deadline) < new Date() ? '#fb7185' : '#444440' }}>
                      {task.deadline ? new Date(task.deadline).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : '—'}
                    </td>
                    {isAdmin && (
                      <td>
                        <div style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}>
                          <button onClick={() => { setEditTask(task); setModalOpen(true); }}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#444440', padding: '4px' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#a8a8a3'}
                            onMouseLeave={e => e.currentTarget.style.color = '#444440'}>
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                          </button>
                          <button onClick={() => setDeleteConfirm(task)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#444440', padding: '4px' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#fb7185'}
                            onMouseLeave={e => e.currentTarget.style.color = '#444440'}>
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    )}
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        )}
      </div>

      <TaskModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditTask(null); }}
        onSuccess={fetchTasks}
        task={editTask}
        defaultProject={defaultProject}
      />

      <ConfirmModal
        isOpen={!!deleteConfirm}
        title="Delete Task"
        message={`Delete "${deleteConfirm?.title}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(null)}
        loading={deleting}
      />
    </div>
  );
}
