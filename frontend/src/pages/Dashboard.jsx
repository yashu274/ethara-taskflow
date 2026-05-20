import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { PageHeader, StatusBadge, PriorityBadge, Avatar, Skeleton } from '../components/common/UI';
import { CheckSquare, Clock, AlertCircle, TrendingUp, FolderKanban, Users, ArrowRight, Zap } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, Cell
} from 'recharts';

const StatCard = ({ icon: Icon, label, value, color, loading }) => (
  <motion.div
    className="stats-card"
    whileHover={{ y: -2 }}
    transition={{ duration: 0.15 }}
  >
    {loading ? (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <Skeleton height={32} width={32} />
        <Skeleton height={32} width="60%" />
        <Skeleton height={14} width="40%" />
      </div>
    ) : (
      <>
        <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: `${color}15`, border: `1px solid ${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
          <Icon size={15} color={color} />
        </div>
        <div style={{ fontSize: '28px', fontWeight: 800, color: '#f5f5f0', letterSpacing: '-0.04em', marginBottom: '4px' }}>
          {value}
        </div>
        <div style={{ fontSize: '12px', color: '#555550', fontWeight: 500 }}>{label}</div>
      </>
    )}
  </motion.div>
);

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div style={{ background: '#111111', border: '1px solid #1e1e1e', borderRadius: '8px', padding: '8px 12px' }}>
        <p style={{ color: '#f5f5f0', fontSize: '12px', fontWeight: 600 }}>{label}</p>
        <p style={{ color: '#6366f1', fontSize: '13px' }}>{payload[0].value} tasks</p>
      </div>
    );
  }
  return null;
};

export default function Dashboard() {
  const { user, isAdmin } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [myTasks, setMyTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const promises = [
          api.get('/tasks?limit=5'),
          api.get('/projects'),
        ];
        if (isAdmin) promises.push(api.get('/tasks/analytics'));

        const results = await Promise.allSettled(promises);
        if (results[0].status === 'fulfilled') setMyTasks(results[0].value.data.tasks?.slice(0, 5) || []);
        if (results[1].status === 'fulfilled') setProjects(results[1].value.data.projects || []);
        if (isAdmin && results[2].status === 'fulfilled') setAnalytics(results[2].value.data.analytics);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [isAdmin]);

  const chartData = analytics ? [
    { name: 'Todo', count: analytics.todoTasks, color: '#555550' },
    { name: 'In Progress', count: analytics.inProgressTasks, color: '#6366f1' },
    { name: 'Completed', count: analytics.completedTasks, color: '#10b981' },
    { name: 'Overdue', count: analytics.overdueTasks, color: '#f43f5e' },
  ] : [];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div style={{ padding: '32px 36px', maxWidth: '1200px' }}>
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} style={{ marginBottom: '32px' }}>
        <div style={{ fontSize: '12px', color: '#333330', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '6px' }}>
          {greeting}
        </div>
        <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#f5f5f0', letterSpacing: '-0.04em', marginBottom: '4px' }}>
          {user?.name}
        </h1>
        <p style={{ fontSize: '13.5px', color: '#444440' }}>
          {isAdmin ? "Here's your team's operations overview." : "Here's what's on your plate today."}
        </p>
      </motion.div>

      {/* Stats */}
      {isAdmin && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '32px' }}>
          <StatCard icon={CheckSquare} label="Total Tasks" value={analytics?.totalTasks ?? '—'} color="#6366f1" loading={loading} />
          <StatCard icon={TrendingUp} label="Completed" value={analytics?.completedTasks ?? '—'} color="#10b981" loading={loading} />
          <StatCard icon={Clock} label="In Progress" value={analytics?.inProgressTasks ?? '—'} color="#f59e0b" loading={loading} />
          <StatCard icon={AlertCircle} label="Overdue" value={analytics?.overdueTasks ?? '—'} color="#f43f5e" loading={loading} />
          <StatCard icon={FolderKanban} label="Projects" value={analytics?.totalProjects ?? '—'} color="#8b5cf6" loading={loading} />
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: isAdmin ? '1fr 1fr' : '1fr', gap: '20px', marginBottom: '20px' }}>
        {/* Chart (admin only) */}
        {isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="glass-card" style={{ padding: '20px' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#f5f5f0' }}>Task Distribution</h3>
              {analytics && (
                <div style={{ fontSize: '11px', color: '#555550' }}>
                  {analytics.completionRate}% completion rate
                </div>
              )}
            </div>
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[...Array(4)].map((_, i) => <Skeleton key={i} height={20} />)}
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={chartData} barSize={24}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#555550' }} />
                  <YAxis hide />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.02)' }} />
                  <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, idx) => <Cell key={idx} fill={entry.color} opacity={0.8} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </motion.div>
        )}

        {/* Projects */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="glass-card" style={{ padding: '20px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#f5f5f0' }}>Projects</h3>
            <Link to="/projects" style={{ fontSize: '12px', color: '#6366f1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
              View all <ArrowRight size={12} />
            </Link>
          </div>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[...Array(4)].map((_, i) => <Skeleton key={i} height={48} />)}
            </div>
          ) : projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px', color: '#333330', fontSize: '13px' }}>No projects yet</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {projects.slice(0, 5).map((project) => (
                <Link key={project._id} to={`/projects/${project._id}`}
                  style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', borderRadius: '8px', border: '1px solid #111111', background: '#0d0d0d', transition: 'all 0.15s ease' }}
                  onMouseEnter={e => e.currentTarget.style.borderColor = '#1e1e1e'}
                  onMouseLeave={e => e.currentTarget.style.borderColor = '#111111'}
                >
                  <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: project.color || '#6366f1', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '13px', fontWeight: 500, color: '#e0e0da', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {project.name}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <div className="progress-bar" style={{ flex: 1 }}>
                        <div className="progress-fill" style={{ width: `${project.progress || 0}%` }} />
                      </div>
                      <span style={{ fontSize: '10px', color: '#444440', flexShrink: 0 }}>{project.progress || 0}%</span>
                    </div>
                  </div>
                  <span style={{ fontSize: '10px', color: '#333330', flexShrink: 0 }}>{project.taskCount || 0} tasks</span>
                </Link>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* Recent Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
        className="glass-card" style={{ padding: '20px' }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '13px', fontWeight: 600, color: '#f5f5f0' }}>
            {isAdmin ? 'Recent Tasks' : 'My Tasks'}
          </h3>
          <Link to="/tasks" style={{ fontSize: '12px', color: '#6366f1', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}>
            View all <ArrowRight size={12} />
          </Link>
        </div>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[...Array(5)].map((_, i) => <Skeleton key={i} height={48} />)}
          </div>
        ) : myTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px', color: '#333330', fontSize: '13px' }}>No tasks assigned yet</div>
        ) : (
          <table className="eth-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Project</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due</th>
              </tr>
            </thead>
            <tbody>
              {myTasks.map((task) => (
                <tr key={task._id}>
                  <td>
                    <span style={{ color: '#d0d0ca', fontWeight: 500, fontSize: '13px' }}>{task.title}</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: task.project?.color || '#6366f1' }} />
                      <span style={{ fontSize: '12.5px' }}>{task.project?.name || '—'}</span>
                    </div>
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
      </motion.div>
    </div>
  );
}
