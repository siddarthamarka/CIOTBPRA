import React, { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Topbar from '../components/Topbar';
import RiskBadge from '../components/RiskBadge';
import { useBPData } from '../hooks/useBPData';
import { format } from 'date-fns';

const RISK_FILTERS = ['All', 'Normal', 'Alert', 'Warning', 'Emergency'];

export default function HistoryPage() {
  const { records, loading, refresh, lastUpdated, download } = useBPData(false);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = [...records]
    .reverse()
    .filter((r) => filter === 'All' || r.prediction === filter)
    .filter((r) => {
      if (!search) return true;
      const s = search.toLowerCase();
      return (
        r.sbp.toString().includes(s) ||
        r.dbp.toString().includes(s) ||
        r.hr.toString().includes(s) ||
        r.prediction.toLowerCase().includes(s)
      );
    });

  return (
    <DashboardLayout>
      <div className="page">
        <Topbar title="Full History" lastUpdated={lastUpdated} onRefresh={refresh} loading={loading} />

        <div className="history-controls">
          <div className="tab-bar">
            {RISK_FILTERS.map((f) => (
              <button key={f} className={`tab ${filter === f ? 'tab--active' : ''}`}
                onClick={() => setFilter(f)}>
                {f}
              </button>
            ))}
          </div>
          <div className="search-row">
            <input
              className="form-input search-input"
              placeholder="Search readings…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn-ghost" onClick={download}>↓ Export CSV</button>
          </div>
        </div>

        <div className="section">
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Date &amp; Time</th>
                  <th>SBP</th>
                  <th>DBP</th>
                  <th>HR</th>
                  <th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={i}>
                    <td className="td-num">{filtered.length - i}</td>
                    <td>{format(new Date(r.timestamp), 'dd MMM yyyy, HH:mm:ss')}</td>
                    <td><span className="td-value">{r.sbp}</span> <span className="td-unit">mmHg</span></td>
                    <td><span className="td-value">{r.dbp}</span> <span className="td-unit">mmHg</span></td>
                    <td><span className="td-value">{r.hr}</span> <span className="td-unit">bpm</span></td>
                    <td><RiskBadge risk={r.prediction} /></td>
                  </tr>
                ))}
                {filtered.length === 0 && !loading && (
                  <tr><td colSpan={6} className="td-empty">No records match filters</td></tr>
                )}
              </tbody>
            </table>
          </div>
          <p className="table-count">{filtered.length} records</p>
        </div>
      </div>
    </DashboardLayout>
  );
}
