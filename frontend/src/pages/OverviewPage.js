import React from 'react';
import DashboardLayout from '../components/DashboardLayout';
import Topbar from '../components/Topbar';
import MetricCard from '../components/MetricCard';
import AlertBanner from '../components/AlertBanner';
import RiskBadge from '../components/RiskBadge';
import { useBPData } from '../hooks/useBPData';
import { format } from 'date-fns';

import balancedDiet from '../assets/images/BalancedDiet.jpg';
import water        from '../assets/images/water.jpeg';
import walking      from '../assets/images/walking.jpg';
import salt         from '../assets/images/salt.jpg';
import junkfood     from '../assets/images/junkfood.webp';
import exercise     from '../assets/images/exercise.jpg';
import bp           from '../assets/images/bp.jpg';
import stress       from '../assets/images/stress.png';
import doctor       from '../assets/images/doctor.jpg';
import emergency    from '../assets/images/emergency.jpg';
import overexertion from '../assets/images/overexhertion.jpeg';

// ✅ RISK_IMAGES is outside component — safe because it only uses imported constants, not component state
const RISK_IMAGES = {
  Normal:    [{ src: balancedDiet, alt: 'Balanced Diet' }, { src: water,        alt: 'Hydration'    }, { src: walking,     alt: 'Walking'     }],
  Alert:     [{ src: salt,         alt: 'Reduce Salt'  }, { src: junkfood,     alt: 'Avoid Junk'   }, { src: exercise,    alt: 'Exercise'    }],
  Warning:   [{ src: bp,           alt: 'Monitor BP'   }, { src: stress,       alt: 'Avoid Stress' }, { src: doctor,      alt: 'See Doctor'  }],
  Emergency: [{ src: emergency,    alt: 'Emergency'    }, { src: overexertion, alt: 'No Exertion'  }],
};

export default function OverviewPage() {
  const { records, loading, error, refresh, lastUpdated, download } = useBPData();

  const latest = records[records.length - 1];
  const prev   = records[records.length - 2];

  const delta = (key) => {
    if (!latest || !prev) return null;
    const d = latest[key] - prev[key];
    return d === 0 ? null : (d > 0 ? `+${d}` : `${d}`);
  };

  if (error) return (
    <DashboardLayout>
      <div className="page-error">
        <p>⚠ {error}</p>
        <button className="btn-primary" onClick={refresh}>Retry</button>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="page">
        <Topbar title="Overview" lastUpdated={lastUpdated} onRefresh={refresh} loading={loading} />

        {/* Alert Banner */}
        {latest && <AlertBanner risk={latest.prediction} />}

        {/* Recommendation Images — driven by latest risk */}
        {latest && RISK_IMAGES[latest.prediction] && (
          <div className="rec-images-row">
            {RISK_IMAGES[latest.prediction].map((img, i) => (
              <img key={i} src={img.src} alt={img.alt} className="rec-image" />
            ))}
          </div>
        )}

        {/* Metric Cards */}
        <section className="metrics-grid">
          <MetricCard
            label="Systolic BP"
            value={latest?.sbp}
            unit="mmHg"
            sub={delta('sbp') ? `${delta('sbp')} from last` : 'No change'}
            color="#e5001a"
            icon="↑"
          />
          <MetricCard
            label="Diastolic BP"
            value={latest?.dbp}
            unit="mmHg"
            sub={delta('dbp') ? `${delta('dbp')} from last` : 'No change'}
            color="#ffffff"
            icon="↓"
          />
          <MetricCard
            label="Heart Rate"
            value={latest?.hr}
            unit="bpm"
            sub={delta('hr') ? `${delta('hr')} from last` : 'No change'}
            color="#ff4444"
            icon="♥"
          />
          <MetricCard
            label="Risk Level"
            value={latest?.prediction ?? '—'}
            sub={latest ? format(new Date(latest.timestamp), 'HH:mm, dd MMM') : ''}
            color={
              latest?.prediction === 'Normal'    ? '#ffffff' :
              latest?.prediction === 'Emergency' ? '#e5001a' :
              latest?.prediction === 'Warning'   ? '#ff4444' : '#ff8080'
            }
            icon="⬡"
          />
        </section>

        {/* Recent Readings Table */}
        <section className="section">
          <div className="section__header">
            <h2 className="section__title">Recent Readings</h2>
            <button className="btn-ghost" onClick={download}>↓ Export CSV</button>
          </div>
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Time</th>
                  <th>SBP</th>
                  <th>DBP</th>
                  <th>HR</th>
                  <th>Risk</th>
                </tr>
              </thead>
              <tbody>
                {[...records].reverse().slice(0, 10).map((r, i) => (
                  <tr key={i}>
                    <td>{format(new Date(r.timestamp), 'dd MMM, HH:mm:ss')}</td>
                    <td><span className="td-value">{r.sbp}</span> <span className="td-unit">mmHg</span></td>
                    <td><span className="td-value">{r.dbp}</span> <span className="td-unit">mmHg</span></td>
                    <td><span className="td-value">{r.hr}</span> <span className="td-unit">bpm</span></td>
                    <td><RiskBadge risk={r.prediction} /></td>
                  </tr>
                ))}
                {records.length === 0 && !loading && (
                  <tr><td colSpan={5} className="td-empty">No records yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </DashboardLayout>
  );
}