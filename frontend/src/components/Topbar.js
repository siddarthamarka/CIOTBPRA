import React from 'react';
import { format } from 'date-fns';

export default function Topbar({ title, lastUpdated, onRefresh, loading }) {
  return (
    <header className="topbar">
      <div>
        <h1 className="topbar__title">{title}</h1>
        {lastUpdated && (
          <p className="topbar__sub">
            Last updated {format(lastUpdated, 'HH:mm:ss')}
            {' '}· Auto-refreshes every 5s
          </p>
        )}
      </div>
      <div className="topbar__actions">
        <div className={`topbar__live ${loading ? 'topbar__live--loading' : ''}`}>
          <span className="topbar__live-dot" />
          <span>{loading ? 'Syncing…' : 'Live'}</span>
        </div>
        <button className="topbar__refresh" onClick={onRefresh} disabled={loading}>
          ↻
        </button>
      </div>
    </header>
  );
}
