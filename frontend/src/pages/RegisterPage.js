import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/images/CIOTBPRALogo.png';

export default function RegisterPage() {
  const { register, loading, error, setError, token } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', age: '', gender: 'Male', email: '', password: '' });
  const [success, setSuccess] = useState(false);

  useEffect(() => { if (token) navigate('/dashboard'); }, [token, navigate]);
  useEffect(() => { setError(null); }, [setError]);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await register(form.name, Number(form.age), form.gender, form.email, form.password);
    if (res.success) {
      setSuccess(true);
      setTimeout(() => navigate('/login'), 1500);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg">
        <div className="auth-bg__orb auth-bg__orb--1" />
        <div className="auth-bg__orb auth-bg__orb--2" />
        <div className="auth-bg__orb auth-bg__orb--3" />
      </div>

      <div className="auth-card auth-card--wide">
        <div className="auth-card__brand">
          <img src={logo} alt="CIOT-BPRA Logo" className="auth-card__logo-img" />
          <p className="auth-card__brand-name">CIOT-BPRA</p>
        </div>

        <h2 className="auth-card__title">Create account</h2>
        <p className="auth-card__desc">Start monitoring your blood pressure in real time</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Full name</label>
              <input className="form-input" type="text" name="name"
                placeholder="John Doe" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Age</label>
              <input className="form-input" type="number" name="age"
                placeholder="25" min="1" max="120" value={form.age} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Gender</label>
            <select className="form-input form-select" name="gender" value={form.gender} onChange={handleChange}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Email address</label>
            <input className="form-input" type="email" name="email"
              placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input className="form-input" type="password" name="password"
              placeholder="Min 8 characters" value={form.password} onChange={handleChange} required minLength={6} />
          </div>

          {error && <div className="form-error">{error}</div>}
          {success && <div className="form-success">✓ Account created! Redirecting to login…</div>}

          <button className={`btn-primary ${loading ? 'btn-primary--loading' : ''}`}
            type="submit" disabled={loading}>
            {loading ? <span className="spinner" /> : 'Create account'}
          </button>
        </form>

        <p className="auth-card__switch">
          Already have an account?{' '}
          <Link to="/login" className="auth-card__link">Sign in</Link>
        </p>
      </div>
    </div>
  );
}