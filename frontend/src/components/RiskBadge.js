import React from 'react';
import { getRiskConfig } from '../services/helpers';

export default function RiskBadge({ risk, large }) {
  const cfg = getRiskConfig(risk);
  return (
    <span
      className={`risk-badge ${large ? 'risk-badge--large' : ''} ${cfg.pulse ? 'risk-badge--pulse' : ''}`}
      style={{ '--rc': cfg.color, '--rb': cfg.bg }}
    >
      <span className="risk-badge__dot" />
      {risk}
    </span>
  );
}
