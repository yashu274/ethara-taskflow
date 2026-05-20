import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';
import { StatusBadge, PriorityBadge, Avatar, Skeleton, EmptyState } from '../components/common/UI';
import { ArrowLeft, Plus, CheckSquare, Users, Calendar, Trash2 } from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const [projRes, taskRes] = await Promise.all([
        api.get(`/projects/${id}`),
        api.get(`/tasks?project=${id}`),
      ]);
      setProject(projRes.data.project);
      setTasks(taskRes.data.tasks || []);
    } catch (err) {
      toast.error('Failed to load project');
      navigate('/projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProject(); }, [id]);

  if (loading) {
    return (
      <div style={{ padding: '32px 36px' }}>
        <Skeleton height={24} width={200} />
        <div style={{ marginTop: '24px', display: 'grid', gap: '12px' }}>
          {[...Array(5)].map((_, i) => <Skeleton key={i} height={56} />)}
        </div>
      </div>
    );
  }

  if (!project) return null;

  return (
    <div style={{ padding: '32px 36px', maxWidth: '1000px' }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <Link to="/projects" style={{ textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#444440', fontSize: '13px', marginBottom: '16px' }}>
            <ArrowLeft size={14} /> Projects
          </Link>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: `${project.color || '#6366f1'}15`, border: `1px solid ${project.color || '#6366f1'}25`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: project.color || '#6366f1' }} />
              </div>
              <div>
                <h1 style={{ fontSize: '22px', fontWeight: 800, color: '#f5f5f0', letterSpacing: '-0.03em' }}>{project.name}</h1>
                {project.description && <p style={{ fontSize: '13px', color: '#555550', marginTop: '2px' }}>{project.description}</p>}
              </div>
            </div>
            <StatusBadge status={project.status} />
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '24px' }}>
          {[
            { label: 'Total Tasks', value: tasks.length, icon: CheckSquare },
            { label: 'Completed', value: tasks.filter(t => t.status === 'completed').length, icon: CheckSquare },
            { label: 'Members', value: project.members?.length || 0, icon: Users },
            { label: 'Progress', value: `${project.progress || 0}%`, icon: Calendar },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="stats-card">
              <div style={{ fontSize: '22px', fontWeight: 800, color: '#f5f5f0', letterSpacing: '-0.04em' }}>{value}</div>
              <div style={{ fontSize: '11px', color: '#444440', marginTop: '2px' }}>{label}</div>
            </div>
          ))}
        </div>

        {/* Progress bar */}
        <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#555550' }}>Overall Progress</span>
            <span style={{ fontSize: '12px', color: '#6366f1', fontWeight: 600 }}>{project.progress || 0}%</span>
          </div>
          <div className="progress-bar" style={{ height: '5px' }}>
            <div className="progress-fill" style={{ width: `${project.progress || 0}%` }} />
          </div>
        </div>

        {/* Members */}
        {project.members?.length > 0 && (
          <div className="glass-card" style={{ padding: '16px 20px', marginBottom: '20px' }}>
            <h3 style={{ fontSize: '12px', color: '#555550', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Team</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {project.members.map(member => (
                <div key={member._id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', background: '#0d0d0d', borderRadius: '8px', border: '1px solid #1a1a1a' }}>
                  <Avatar name={member.name} size={24} />
                  <div>
                    <div style={{ fontSize: '12.5px', color: '#d0d0ca', fontWeight: 500 }}>{member.name}</div>
                    <div style={{ fontSize: '10.5px', color: '#444440' }}>{member.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tasks */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#f5f5f0' }}>Tasks ({tasks.length})</h3>
            {isAdmin && (
              <Link to={`/tasks?project=${id}`} style={{ textDecoration: 'none' }}>
                <button className="btn-secondary" style={{ fontSize: '12px', padding: '6px 12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <Plus size={12} /> Add Task
                </button>
              </Link>
            )}
          </div>

          {tasks.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#333330', fontSize: '13px' }}>
              No tasks for this project yet.
            </div>
          ) : (
            <table className="eth-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Assignee</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Due</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task._id}>
                    <td><span style={{ color: '#d0d0ca', fontWeight: 500 }}>{task.title}</span></td>
                    <td>
                      {task.assignedTo ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <Avatar name={task.assignedTo.name} size={22} />
                          <span style={{ fontSize: '12.5px' }}>{task.assignedTo.name}</span>
                        </div>
                      ) : <span style={{ color: '#333330' }}>—</span>}
                    </td>
                    <td><PriorityBadge priority={task.priority} /></td>
                    <td><StatusBadge status={task.status} /></td>
                    <td style={{ fontSize: '12px', color: '#444440' }}>
                      {task.deadline ? new Date(task.deadline).toLocaleDateString('en', { month: 'short', day: 'numeric' }) : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </motion.div>
    </div>
  );
}
