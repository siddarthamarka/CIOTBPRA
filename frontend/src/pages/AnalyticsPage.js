import React, { useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell, PieChart, Pie, Legend
} from 'recharts';
import DashboardLayout from '../components/DashboardLayout';
import Topbar from '../components/Topbar';
import { useBPData } from '../hooks/useBPData';
import { aggregateByPeriod, riskDistribution, getRiskConfig } from '../services/helpers';

const PIE_COLORS = {
  Normal: '#ffffff', Alert: '#e5001a', Warning: '#cc0015', Emergency: '#880010'
};

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tooltip">
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color || '#fff' }}>
          {p.name.toUpperCase()}: <b>{p.value}</b>
        </p>
      ))}
    </div>
  );
}

export default function AnalyticsPage() {
  const { records, loading, refresh, lastUpdated } = useBPData(false);
  const [period, setPeriod] = useState('day');

  const agg  = aggregateByPeriod(records, period);
  const dist = riskDistribution(records);

  return (
    <DashboardLayout>
      <div className="page">
        <Topbar title="Analytics" lastUpdated={lastUpdated} onRefresh={refresh} loading={loading} />

        <div className="analytics-grid">
          {/* Averages chart */}
          <div className="chart-card chart-card--span2">
            <div className="chart-card__header">
              <h3 className="chart-card__title">Average Readings</h3>
              <div className="tab-bar tab-bar--small">
                {['day','week','month'].map((p) => (
                  <button key={p} className={`tab ${period === p ? 'tab--active' : ''}`}
                    onClick={() => setPeriod(p)}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={agg} barSize={14} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="period" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="sbp" fill="#e5001a" radius={[4,4,0,0]} name="sbp" />
                <Bar dataKey="dbp" fill="#ffffff" radius={[4,4,0,0]} name="dbp" />
                <Bar dataKey="hr"  fill="#888888" radius={[4,4,0,0]} name="hr" />
              </BarChart>
            </ResponsiveContainer>

            {/* Table below chart */}
            <div className="table-wrapper" style={{ marginTop: '1.5rem' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Period</th><th>Avg SBP</th><th>Avg DBP</th><th>Avg HR</th>
                  </tr>
                </thead>
                <tbody>
                  {agg.map((row, i) => (
                    <tr key={i}>
                      <td>{row.period}</td>
                      <td>{row.sbp} <span className="td-unit">mmHg</span></td>
                      <td>{row.dbp} <span className="td-unit">mmHg</span></td>
                      <td>{row.hr} <span className="td-unit">bpm</span></td>
                    </tr>
                  ))}
                  {agg.length === 0 && (
                    <tr><td colSpan={4} className="td-empty">No data</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Risk distribution pie */}
          <div className="chart-card">
            <div className="chart-card__header">
              <h3 className="chart-card__title">Risk Distribution</h3>
            </div>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={dist} dataKey="value" nameKey="name" cx="50%" cy="50%"
                  outerRadius={90} innerRadius={50} paddingAngle={3}>
                  {dist.map((d) => (
                    <Cell key={d.name} fill={PIE_COLORS[d.name]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            <div className="dist-list">
              {dist.map((d) => (
                <div key={d.name} className="dist-item">
                  <span className="dist-dot" style={{ background: PIE_COLORS[d.name] }} />
                  <span className="dist-name">{d.name}</span>
                  <span className="dist-count">{d.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
