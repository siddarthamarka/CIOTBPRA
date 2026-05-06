import React from 'react';

export default function MetricCard({ label, value, unit, sub, color = '#6366f1', icon }) {
  return (
    <div className="metric-card" style={{ '--accent': color }}>
      <div className="metric-icon">{icon}</div>
      <div className="metric-body">
        <p className="metric-label">{label}</p>
        <div className="metric-value-row">
          <span className="metric-value">{value ?? '—'}</span>
          {unit && <span className="metric-unit">{unit}</span>}
        </div>
        {sub && <p className="metric-sub">{sub}</p>}
      </div>
      <div className="metric-glow" />
    </div>
  );
}
