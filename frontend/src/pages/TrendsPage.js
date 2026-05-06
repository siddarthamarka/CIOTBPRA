import React, { useState } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend
} from 'recharts';
import DashboardLayout from '../components/DashboardLayout';
import Topbar from '../components/Topbar';
import { useBPData } from '../hooks/useBPData';
import { format } from 'date-fns';

const COLORS = { sbp: '#e8001e', dbp: '#ffffff', hr: '#ff6b6b' };

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip__label">{label}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name.toUpperCase()}: <b>{p.value}</b>
        </p>
      ))}
    </div>
  );
}

export default function TrendsPage() {
  const { records, loading, refresh, lastUpdated } = useBPData();
  const [view, setView] = useState('bp');

  const chartData = records.map((r) => ({
    time: format(new Date(r.timestamp), 'HH:mm'),
    sbp: r.sbp,
    dbp: r.dbp,
    hr: r.hr,
  }));

  return (
    <DashboardLayout>
      <div className="page">
        <Topbar title="Trends" lastUpdated={lastUpdated} onRefresh={refresh} loading={loading} />

        <div className="tab-bar">
          <button className={`tab ${view === 'bp' ? 'tab--active' : ''}`} onClick={() => setView('bp')}>
            Blood Pressure
          </button>
          <button className={`tab ${view === 'hr' ? 'tab--active' : ''}`} onClick={() => setView('hr')}>
            Heart Rate
          </button>
        </div>

        {view === 'bp' && (
          <div className="chart-card">
            <div className="chart-card__header">
              <h3 className="chart-card__title">Systolic &amp; Diastolic Pressure</h3>
              <div className="chart-legend">
                <span style={{ color: COLORS.sbp }}>● SBP</span>
                <span style={{ color: COLORS.dbp }}>● DBP</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={360}>
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="gSbp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.sbp} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={COLORS.sbp} stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gDbp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={COLORS.dbp} stopOpacity={0.1} />
                    <stop offset="95%" stopColor={COLORS.dbp} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="time" tick={{ fill: '#555', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#555', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="sbp" stroke={COLORS.sbp} fill="url(#gSbp)" strokeWidth={2} dot={false} name="sbp" />
                <Area type="monotone" dataKey="dbp" stroke={COLORS.dbp} fill="url(#gDbp)" strokeWidth={2} dot={false} name="dbp" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {view === 'hr' && (
          <div className="chart-card">
            <div className="chart-card__header">
              <h3 className="chart-card__title">Heart Rate Over Time</h3>
              <div className="chart-legend">
                <span style={{ color: COLORS.hr }}>● HR (bpm)</span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={360}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="time" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="hr" stroke={COLORS.hr} strokeWidth={2.5}
                  dot={{ fill: COLORS.hr, r: 3 }} name="hr" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {records.length === 0 && !loading && (
          <div className="empty-state">
            <p>No data available yet. Connect your IoT device to begin monitoring.</p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
