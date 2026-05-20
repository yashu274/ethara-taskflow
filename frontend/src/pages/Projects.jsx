import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { useForm } from 'react-hook-form';
import { PageHeader, StatusBadge, Avatar, Skeleton, EmptyState, ConfirmModal } from '../components/common/UI';
import { Plus, FolderKanban, Trash2, Users, X, ChevronRight, Calendar } from 'lucide-react';

const PROJECT_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#f43f5e', '#8b5cf6', '#06b6d4', '#ec4899', '#14b8a6'];

function ProjectModal({ isOpen, onClose, onSuccess, project }) {
  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm();
  const [selectedColor, setSelectedColor] = useState(project?.color || PROJECT_COLORS[0]);
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState(project?.members?.map(m => m._id || m) || []);

  useEffect(() => {
    api.get('/auth/users').then(res => setUsers(res.data.users || [])).catch(() => {});
    if (project) {
      setValue('name', project.name);
      setValue('description', project.description);
      setValue('status', project.status);
      setValue('priority', project.priority);
      setValue('deadline', project.deadline ? project.deadline.split('T')[0] : '');
      setSelectedColor(project.color || PROJECT_COLORS[0]);
      setSelectedMembers(project.members?.map(m => m._id || m) || []);
    } else {
      reset();
      setSelectedColor(PROJECT_COLORS[0]);
      setSelectedMembers([]);
    }
  }, [project, isOpen]);

  const toggleMember = (id) => {
    setSelectedMembers(prev => prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]);
  };

  const onSubmit = async (data) => {
    try {
      const payload = { ...data, color: selectedColor, members: selectedMembers };
      if (project) {
        await api.put(`/projects/${project._id}`, payload);
        toast.success('Project updated');
      } else {
        await api.post('/projects', payload);
        toast.success('Project created');
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
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '560px', maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#f5f5f0' }}>
            {project ? 'Edit Project' : 'New Project'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#444440', padding: '4px' }}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="form-label">Project name</label>
            <input className="eth-input" placeholder="e.g. Product Redesign Q1" {...register('name', { required: 'Name is required' })} />
            {errors.name && <span style={{ color: '#fb7185', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.name.message}</span>}
          </div>

          <div>
            <label className="form-label">Description</label>
            <textarea className="eth-input" placeholder="What is this project about?" rows={2}
              style={{ resize: 'vertical' }} {...register('description')} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div>
              <label className="form-label">Status</label>
              <select className="eth-input" {...register('status')}>
                <option value="active">Active</option>
                <option value="on-hold">On Hold</option>
                <option value="completed">Completed</option>
                <option value="archived">Archived</option>
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
            <label className="form-label">Deadline</label>
            <input type="date" className="eth-input" {...register('deadline')} />
          </div>

          <div>
            <label className="form-label">Color</label>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {PROJECT_COLORS.map(c => (
                <button key={c} type="button" onClick={() => setSelectedColor(c)}
                  style={{ width: '24px', height: '24px', borderRadius: '50%', background: c, border: `2px solid ${selectedColor === c ? '#fff' : 'transparent'}`, cursor: 'pointer', outline: selectedColor === c ? `2px solid ${c}` : 'none', outlineOffset: '2px', transition: 'all 0.15s' }} />
              ))}
            </div>
          </div>

          {users.length > 0 && (
            <div>
              <label className="form-label">Members</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '160px', overflowY: 'auto' }}>
                {users.map(u => (
                  <label key={u._id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: '6px', cursor: 'pointer', background: selectedMembers.includes(u._id) ? '#111111' : 'transparent', border: `1px solid ${selectedMembers.includes(u._id) ? '#1e1e1e' : 'transparent'}`, transition: 'all 0.15s' }}>
                    <input type="checkbox" checked={selectedMembers.includes(u._id)} onChange={() => toggleMember(u._id)} style={{ accentColor: '#6366f1' }} />
                    <Avatar name={u.name} size={24} />
                    <div>
                      <div style={{ fontSize: '13px', color: '#d0d0ca' }}>{u.name}</div>
                      <div style={{ fontSize: '11px', color: '#444440' }}>{u.role}</div>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '8px' }}>
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : project ? 'Update' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Projects() {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await api.get('/projects');
      setProjects(res.data.projects || []);
    } catch (err) {
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProjects(); }, []);

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await api.delete(`/projects/${deleteConfirm._id}`);
      toast.success('Project deleted');
      setDeleteConfirm(null);
      fetchProjects();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Delete failed');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div style={{ padding: '32px 36px', maxWidth: '1100px' }}>
      <PageHeader
        title="Projects"
        subtitle={`${projects.length} project${projects.length !== 1 ? 's' : ''}`}
        action={isAdmin && (
          <button className="btn-primary" onClick={() => { setEditProject(null); setModalOpen(true); }}
            style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', padding: '9px 16px' }}>
            <Plus size={14} /> New Project
          </button>
        )}
      />

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
          {[...Array(6)].map((_, i) => <div key={i} className="glass-card" style={{ padding: '20px' }}><Skeleton height={120} /></div>)}
        </div>
      ) : projects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban size={40} />}
          title="No projects yet"
          description={isAdmin ? "Create your first project to get started." : "You haven't been added to any projects yet."}
          action={isAdmin && <button className="btn-primary" onClick={() => setModalOpen(true)}>Create Project</button>}
        />
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '14px' }}>
          <AnimatePresence>
            {projects.map((project, i) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass-card"
                style={{ padding: '20px', cursor: 'pointer', transition: 'all 0.2s ease' }}
                whileHover={{ y: -3, borderColor: '#252525' }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: `${project.color || '#6366f1'}15`, border: `1px solid ${project.color || '#6366f1'}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FolderKanban size={16} color={project.color || '#6366f1'} />
                  </div>
                  {isAdmin && (
                    <div style={{ display: 'flex', gap: '4px' }}>
                      <button onClick={e => { e.stopPropagation(); setEditProject(project); setModalOpen(true); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#444440', padding: '4px', borderRadius: '4px' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#a8a8a3'}
                        onMouseLeave={e => e.currentTarget.style.color = '#444440'}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button onClick={e => { e.stopPropagation(); setDeleteConfirm(project); }}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#444440', padding: '4px', borderRadius: '4px' }}
                        onMouseEnter={e => e.currentTarget.style.color = '#fb7185'}
                        onMouseLeave={e => e.currentTarget.style.color = '#444440'}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )}
                </div>

                <Link to={`/projects/${project._id}`} style={{ textDecoration: 'none' }}>
                  <h3 style={{ fontSize: '14.5px', fontWeight: 600, color: '#f5f5f0', marginBottom: '4px' }}>{project.name}</h3>
                  {project.description && (
                    <p style={{ fontSize: '12.5px', color: '#444440', marginBottom: '14px', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {project.description}
                    </p>
                  )}

                  <div style={{ marginBottom: '14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontSize: '11px', color: '#444440' }}>Progress</span>
                      <span style={{ fontSize: '11px', color: '#555550' }}>{project.progress || 0}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${project.progress || 0}%` }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ display: 'flex' }}>
                        {project.members?.slice(0, 3).map((m, i) => (
                          <div key={m._id || i} style={{ marginLeft: i > 0 ? '-6px' : 0 }}>
                            <Avatar name={m.name} size={22} />
                          </div>
                        ))}
                      </div>
                      {project.members?.length > 0 && (
                        <span style={{ fontSize: '11px', color: '#444440' }}>{project.members.length} member{project.members.length !== 1 ? 's' : ''}</span>
                      )}
                    </div>
                    <StatusBadge status={project.status} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <ProjectModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditProject(null); }}
        onSuccess={fetchProjects}
        project={editProject}
      />

      <ConfirmModal
        isOpen={!!deleteConfirm}
        title="Delete Project"
        message={`Are you sure you want to delete "${deleteConfirm?.name}"? This will also delete all associated tasks.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteConfirm(null)}
        loading={deleting}
      />
    </div>
  );
}
