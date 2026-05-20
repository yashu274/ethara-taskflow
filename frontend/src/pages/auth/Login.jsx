import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Zap, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.password);
      toast.success('Welcome back!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex' }}>
      {/* Left: Brand */}
      <div className="hidden lg:flex flex-col justify-between" style={{
        width: '44%', padding: '48px', background: '#060606',
        borderRight: '1px solid #111111',
      }}>
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-8 h-8 rounded-xl"
            style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', boxShadow: '0 0 24px rgba(99,102,241,0.35)' }}>
            <Zap size={16} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '16px', color: '#f5f5f0', letterSpacing: '-0.02em' }}>
            Ethara<span style={{ fontWeight: 300, color: '#444440' }}>Flow</span>
          </span>
        </div>

        <div>
          <div style={{ fontSize: '11px', color: '#333330', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '20px' }}>
            Team Intelligence Platform
          </div>
          <h2 style={{ fontSize: '36px', fontWeight: 800, color: '#f5f5f0', lineHeight: 1.15, letterSpacing: '-0.04em', marginBottom: '20px' }}>
            Orchestrate your<br />
            <span style={{ background: 'linear-gradient(135deg, #6366f1, #818cf8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              team's work
            </span><br />
            with precision.
          </h2>
          <p style={{ fontSize: '14px', color: '#444440', lineHeight: 1.7, maxWidth: '340px' }}>
            Role-based task management for modern teams. Assign, track, and deliver with enterprise-grade clarity.
          </p>
        </div>

        <div style={{ fontSize: '12px', color: '#2a2a2a' }}>
          © 2024 Ethara AI. All rights reserved.
        </div>
      </div>

      {/* Right: Form */}
      <div className="flex flex-1 items-center justify-center" style={{ padding: '40px 24px' }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ width: '100%', maxWidth: '380px' }}
        >
          <div className="lg:hidden flex items-center gap-2 mb-10">
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #6366f1, #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={14} color="white" />
            </div>
            <span style={{ fontWeight: 700, fontSize: '15px', color: '#f5f5f0' }}>EtharaFlow</span>
          </div>

          <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#f5f5f0', letterSpacing: '-0.03em', marginBottom: '6px' }}>
            Sign in
          </h1>
          <p style={{ fontSize: '13.5px', color: '#555550', marginBottom: '32px' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#6366f1', textDecoration: 'none' }}>Sign up</Link>
          </p>

          <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label className="form-label">Email address</label>
              <input
                className="eth-input"
                type="email"
                placeholder="you@company.com"
                {...register('email', { required: 'Email is required' })}
              />
              {errors.email && <span style={{ color: '#fb7185', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.email.message}</span>}
            </div>

            <div>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  className="eth-input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  style={{ paddingRight: '42px' }}
                  {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#444440', padding: 0 }}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <span style={{ color: '#fb7185', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.password.message}</span>}
            </div>

            <button className="btn-primary" type="submit" disabled={isSubmitting} style={{ marginTop: '4px', padding: '12px' }}>
              {isSubmitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Demo credentials */}
          <div style={{ marginTop: '24px', padding: '14px', background: '#0d0d0d', border: '1px solid #1a1a1a', borderRadius: '10px' }}>
            <p style={{ fontSize: '11px', color: '#444440', marginBottom: '8px', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Demo Credentials</p>
            <div style={{ fontSize: '12.5px', color: '#555550', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <span><span style={{ color: '#333330' }}>Admin:</span> admin@ethara.ai / admin123</span>
              <span><span style={{ color: '#333330' }}>Member:</span> member@ethara.ai / member123</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
