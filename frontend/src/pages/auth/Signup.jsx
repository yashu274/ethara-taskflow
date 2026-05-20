import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Zap, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data) => {
    try {
      await signup(data.name, data.email, data.password, data.role);
      toast.success('Account created! Welcome to EtharaFlow.');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 24px' }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ width: '100%', maxWidth: '400px' }}
      >
        <div className="flex items-center justify-center gap-2 mb-10">
          <div style={{ width: '30px', height: '30px', borderRadius: '9px', background: 'linear-gradient(135deg, #6366f1, #818cf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(99,102,241,0.3)' }}>
            <Zap size={15} color="white" />
          </div>
          <span style={{ fontWeight: 700, fontSize: '16px', color: '#f5f5f0', letterSpacing: '-0.02em' }}>
            Ethara<span style={{ fontWeight: 300, color: '#444440' }}>Flow</span>
          </span>
        </div>

        <h1 style={{ fontSize: '22px', fontWeight: 700, color: '#f5f5f0', letterSpacing: '-0.03em', marginBottom: '6px', textAlign: 'center' }}>
          Create account
        </h1>
        <p style={{ fontSize: '13.5px', color: '#555550', marginBottom: '32px', textAlign: 'center' }}>
          Already have one?{' '}
          <Link to="/login" style={{ color: '#6366f1', textDecoration: 'none' }}>Sign in</Link>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label className="form-label">Full name</label>
            <input
              className="eth-input"
              type="text"
              placeholder="Alex Johnson"
              {...register('name', { required: 'Name is required', minLength: { value: 2, message: 'Min 2 characters' } })}
            />
            {errors.name && <span style={{ color: '#fb7185', fontSize: '12px', marginTop: '4px', display: 'block' }}>{errors.name.message}</span>}
          </div>

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

          <div>
            <label className="form-label">Role</label>
            <select className="eth-input" {...register('role')}>
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button className="btn-primary" type="submit" disabled={isSubmitting} style={{ marginTop: '8px', padding: '12px' }}>
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p style={{ fontSize: '12px', color: '#333330', textAlign: 'center', marginTop: '24px' }}>
          By signing up, you agree to our Terms of Service and Privacy Policy.
        </p>
      </motion.div>
    </div>
  );
}
