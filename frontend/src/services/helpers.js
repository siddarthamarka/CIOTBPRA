export function getRiskConfig(risk) {
  const configs = {
    Normal:    { color: '#10b981', bg: 'rgba(16,185,129,0.12)', label: 'Normal',    icon: '✓',  pulse: false },
    Alert:     { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)', label: 'Alert',     icon: '!',  pulse: true  },
    Warning:   { color: '#f97316', bg: 'rgba(249,115,22,0.12)', label: 'Warning',   icon: '⚠',  pulse: true  },
    Emergency: { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',  label: 'Emergency', icon: '🚨', pulse: true  },
  };
  return configs[risk] || configs.Normal;
}

export function getRecommendation(risk) {
  const recs = {
    Normal:    'Maintain healthy diet, drink enough water, 30 min walking daily.',
    Alert:     'Reduce salt intake, avoid junk food, daily exercise recommended.',
    Warning:   'Monitor BP twice daily, avoid stress, consult doctor within 48 hours.',
    Emergency: 'Immediate hospital visit required. Avoid any physical exertion.',
  };
  return recs[risk] || 'No recommendation available.';
}

export function aggregateByPeriod(records, period) {
  const groups = {};
  records.forEach((r) => {
    const d = new Date(r.timestamp);
    let key;
    if (period === 'day')   key = d.toISOString().split('T')[0];
    if (period === 'week') {
      const start = new Date(d);
      start.setDate(d.getDate() - d.getDay());
      key = start.toISOString().split('T')[0];
    }
    if (period === 'month') key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    if (!groups[key]) groups[key] = { sbp: [], dbp: [], hr: [] };
    groups[key].sbp.push(r.sbp);
    groups[key].dbp.push(r.dbp);
    groups[key].hr.push(r.hr);
  });
  return Object.entries(groups).map(([k, v]) => ({
    period: k,
    sbp: +(v.sbp.reduce((a,b)=>a+b,0)/v.sbp.length).toFixed(1),
    dbp: +(v.dbp.reduce((a,b)=>a+b,0)/v.dbp.length).toFixed(1),
    hr:  +(v.hr.reduce((a,b)=>a+b,0)/v.hr.length).toFixed(1),
  }));
}

export function riskDistribution(records) {
  const dist = { Normal: 0, Alert: 0, Warning: 0, Emergency: 0 };
  records.forEach((r) => { if (dist[r.prediction] !== undefined) dist[r.prediction]++; });
  return Object.entries(dist).map(([name, value]) => ({ name, value }));
}
