import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import api from '../services/api';
import toast from 'react-hot-toast';
import { PageHeader, Avatar, Skeleton } from '../components/common/UI';
import { Users, Crown, User } from 'lucide-react';

export default function Team() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/auth/users')
      .then(res => setUsers(res.data.users || []))
      .catch(() => toast.error('Failed to load team'))
      .finally(() => setLoading(false));
  }, []);

  const admins = users.filter(u => u.role === 'admin');
  const members = users.filter(u => u.role === 'member');

  return (
    <div style={{ padding: '32px 36px', maxWidth: '900px' }}>
      <PageHeader
        title="Team"
        subtitle={`${users.length} member${users.length !== 1 ? 's' : ''} in your workspace`}
      />

      {loading ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '12px' }}>
          {[...Array(6)].map((_, i) => <div key={i} className="glass-card" style={{ padding: '20px' }}><Skeleton height={80} /></div>)}
        </div>
      ) : (
        <>
          {admins.length > 0 && (
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontSize: '11px', color: '#333330', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Crown size={11} color="#f59e0b" /> Administrators
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px' }}>
                {admins.map((user, i) => (
                  <motion.div key={user._id} className="glass-card"
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}
                    whileHover={{ y: -2 }}>
                    <Avatar name={user.name} size={40} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#f5f5f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                      <div style={{ fontSize: '11.5px', color: '#444440', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                    </div>
                    <div style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.15)', borderRadius: '100px', padding: '2px 8px', fontSize: '10.5px', color: '#fbbf24', flexShrink: 0 }}>
                      Admin
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {members.length > 0 && (
            <div>
              <div style={{ fontSize: '11px', color: '#333330', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <User size={11} color="#6366f1" /> Members
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '10px' }}>
                {members.map((user, i) => (
                  <motion.div key={user._id} className="glass-card"
                    initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}
                    whileHover={{ y: -2 }}>
                    <Avatar name={user.name} size={40} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '13.5px', fontWeight: 600, color: '#f5f5f0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.name}</div>
                      <div style={{ fontSize: '11.5px', color: '#444440', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.email}</div>
                    </div>
                    <div style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '100px', padding: '2px 8px', fontSize: '10.5px', color: '#818cf8', flexShrink: 0 }}>
                      Member
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {users.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px', color: '#333330' }}>
              <Users size={40} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
              <p>No team members yet.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
