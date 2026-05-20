import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Zap, CheckSquare, Users, BarChart3, Shield, ArrowRight } from 'lucide-react';

const features = [
  { icon: CheckSquare, title: 'Task Management', desc: 'Create, assign, and track tasks with priority levels, deadlines, and status workflows.' },
  { icon: Users, title: 'Team Collaboration', desc: 'Add team members to projects, assign roles, and track contributions with full visibility.' },
  { icon: BarChart3, title: 'Analytics Dashboard', desc: 'Real-time insights into project progress, task completion rates, and team performance.' },
  { icon: Shield, title: 'Role-Based Access', desc: 'Granular permissions for admins and members. Everyone sees exactly what they need.' },
];

export default function Landing() {
  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: '#f5f5f0' }}>
      {/* Nav */}
      <nav style={{ padding: '20px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #0f0f0f' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '30px', height: '30px', borderRadius: '9px', background: 'linear-gradient(135deg, #6366f1, #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(99,102,241,0.3)' }}>
            <Zap size={15} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '15px', letterSpacing: '-0.02em' }}>
            Ethara<span style={{ fontWeight: 300, color: '#444440' }}>Flow</span>
          </span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Link to="/login" style={{ textDecoration: 'none' }}>
            <button className="btn-secondary" style={{ fontSize: '13px', padding: '8px 16px' }}>Sign in</button>
          </Link>
          <Link to="/signup" style={{ textDecoration: 'none' }}>
            <button className="btn-primary" style={{ fontSize: '13px', padding: '8px 16px' }}>Get started</button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '120px 48px 80px', textAlign: 'center', position: 'relative' }}>
        {/* Background glow */}
        <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: '600px', height: '300px', background: 'radial-gradient(ellipse, rgba(99,102,241,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: '100px', marginBottom: '32px', fontSize: '12px', color: '#818cf8' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#6366f1' }} />
            Enterprise Task Intelligence Platform
          </div>

          <h1 style={{ fontSize: 'clamp(40px, 6vw, 68px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: '24px', maxWidth: '800px', margin: '0 auto 24px' }}>
            Orchestrate your team's<br />
            <span style={{ background: 'linear-gradient(135deg, #a5b4fc, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              work with precision
            </span>
          </h1>

          <p style={{ fontSize: '17px', color: '#555550', maxWidth: '520px', margin: '0 auto 44px', lineHeight: 1.7 }}>
            Role-based task management built for modern AI-forward teams. Assign, track, and deliver with enterprise-grade clarity.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/signup" style={{ textDecoration: 'none' }}>
              <motion.button className="btn-primary" whileHover={{ scale: 1.02 }} style={{ fontSize: '14px', padding: '13px 28px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                Start for free <ArrowRight size={15} />
              </motion.button>
            </Link>
            <Link to="/login" style={{ textDecoration: 'none' }}>
              <button className="btn-secondary" style={{ fontSize: '14px', padding: '13px 28px' }}>
                Sign in
              </button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* Dashboard Preview */}
      <section style={{ padding: '0 48px 80px' }}>
        <motion.div
          initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.6 }}
          style={{ background: '#0a0a0a', border: '1px solid #151515', borderRadius: '16px', padding: '24px', maxWidth: '900px', margin: '0 auto', position: 'relative', overflow: 'hidden' }}
        >
          {/* Fake dashboard preview */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            {[
              { label: 'Total Tasks', value: '124', color: '#6366f1' },
              { label: 'Completed', value: '89', color: '#10b981' },
              { label: 'In Progress', value: '23', color: '#f59e0b' },
              { label: 'Overdue', value: '12', color: '#f43f5e' },
            ].map(stat => (
              <div key={stat.label} style={{ flex: 1, background: '#111111', border: '1px solid #1a1a1a', borderRadius: '10px', padding: '14px', minWidth: 0 }}>
                <div style={{ fontSize: '22px', fontWeight: 800, color: stat.color, letterSpacing: '-0.04em' }}>{stat.value}</div>
                <div style={{ fontSize: '11px', color: '#444440', marginTop: '2px' }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: '#111111', border: '1px solid #1a1a1a', borderRadius: '10px', padding: '14px' }}>
              <div style={{ fontSize: '11px', color: '#444440', marginBottom: '10px' }}>Task Status</div>
              {['Completed', 'In Progress', 'Todo', 'Overdue'].map((s, i) => (
                <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                  <div style={{ flex: 1, height: '4px', background: '#1a1a1a', borderRadius: '2px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${[72, 19, 6, 3][i]}%`, background: ['#10b981', '#6366f1', '#555550', '#f43f5e'][i], borderRadius: '2px' }} />
                  </div>
                  <span style={{ fontSize: '10px', color: '#444440', minWidth: '60px' }}>{s}</span>
                </div>
              ))}
            </div>
            <div style={{ background: '#111111', border: '1px solid #1a1a1a', borderRadius: '10px', padding: '14px' }}>
              <div style={{ fontSize: '11px', color: '#444440', marginBottom: '10px' }}>Recent Tasks</div>
              {['Design system audit', 'API integration', 'Write documentation', 'Deploy to production'].map((t, i) => (
                <div key={t} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', borderBottom: i < 3 ? '1px solid #161616' : 'none' }}>
                  <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: ['#10b981', '#6366f1', '#f59e0b', '#555550'][i], flexShrink: 0 }} />
                  <span style={{ fontSize: '11.5px', color: '#666660' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Overlay gradient */}
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '80px', background: 'linear-gradient(to top, #0a0a0a, transparent)', pointerEvents: 'none' }} />
        </motion.div>
      </section>

      {/* Features */}
      <section style={{ padding: '40px 48px 100px' }}>
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <div style={{ fontSize: '11px', color: '#333330', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '14px' }}>Platform</div>
          <h2 style={{ fontSize: 'clamp(28px, 4vw, 40px)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '12px' }}>
            Everything your team needs
          </h2>
          <p style={{ fontSize: '15px', color: '#444440', maxWidth: '400px', margin: '0 auto' }}>
            A complete task intelligence platform designed for high-performance teams.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', maxWidth: '900px', margin: '0 auto' }}>
          {features.map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={title}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 * i }}
              className="glass-card" style={{ padding: '24px' }}
              whileHover={{ y: -3, borderColor: '#252525' }}
            >
              <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <Icon size={16} color="#818cf8" />
              </div>
              <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#e0e0da', marginBottom: '8px' }}>{title}</h3>
              <p style={{ fontSize: '13px', color: '#444440', lineHeight: 1.6 }}>{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '60px 48px', borderTop: '1px solid #0f0f0f', textAlign: 'center' }}>
        <h2 style={{ fontSize: '28px', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '12px' }}>
          Ready to get started?
        </h2>
        <p style={{ fontSize: '14px', color: '#444440', marginBottom: '28px' }}>
          Join your team on EtharaFlow today.
        </p>
        <Link to="/signup" style={{ textDecoration: 'none' }}>
          <button className="btn-primary" style={{ fontSize: '14px', padding: '12px 28px' }}>
            Create free account
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ padding: '24px 48px', borderTop: '1px solid #0f0f0f', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px', color: '#2a2a2a' }}>
          © 2024 Ethara AI · EtharaFlow
        </span>
        <div style={{ display: 'flex', gap: '20px' }}>
          {['Privacy', 'Terms', 'Contact'].map(l => (
            <span key={l} style={{ fontSize: '12px', color: '#2a2a2a', cursor: 'pointer' }}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  );
}
