import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/CIOTBPRALogo.png';

export default function LoginPage() {
  const { login, loading, error, setError, token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (token) navigate('/dashboard');
  }, [token, navigate]);

  useEffect(() => { setError(null); }, [setError]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(form.email, form.password);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 600);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg__orb auth-bg__orb--1" />
        <div className="auth-bg__orb auth-bg__orb--2" />
        <div className="auth-bg__orb auth-bg__orb--3" />
      </div>

      <div className="auth-card">
        <div className="auth-card__brand">
          <img src={logo} alt="CIOT-BPRA Logo" className="auth-card__logo-img" />
          <p className="auth-card__brand-name">CIOT-BPRA</p>
          <p className="auth-card__brand-sub">Cloud-Integrated IoT Blood Pressure Risk Analyser</p>
        </div>

        <h2 className="auth-card__title">Welcome back</h2>
        <p className="auth-card__desc">Sign in to your monitoring dashboard</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label className="form-label">Email address</label>
            <input
              className="form-input"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              name="password"
              placeholder="••••••••"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">✓ Login successful. Redirecting…</div>}

          <button
            className={`btn-primary ${loading ? 'btn-primary--loading' : ''}`}
            type="submit"
            disabled={loading}
          >
            {loading ? <span className="spinner" /> : 'Sign in'}
          </button>
        </form>

        <p className="auth-card__switch">
          Don't have an account?{' '}
          <Link to="/register" className="auth-card__link">Create account</Link>
        </p>
      </div>
    </div>
  );
}