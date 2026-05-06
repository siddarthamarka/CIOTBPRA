import React from 'react';
import { getRiskConfig, getRecommendation } from '../services/helpers';

export default function AlertBanner({ risk }) {
  if (!risk) return null;
  const cfg = getRiskConfig(risk);
  const rec = getRecommendation(risk);

  const messages = {
    Normal:    'All vitals are within healthy range. Keep up your healthy habits.',
    Alert:     'Your readings indicate an elevated alert condition.',
    Warning:   'Your readings require prompt medical attention.',
    Emergency: 'CRITICAL: Seek immediate emergency medical care.',
  };

  return (
    <div className="alert-banner" style={{ '--rc': cfg.color, '--rb': cfg.bg }}>
      <div className="alert-banner__left">
        <div className="alert-banner__icon">{cfg.icon}</div>
        <div>
          <p className="alert-banner__title">{cfg.label} Condition</p>
          <p className="alert-banner__msg">{messages[risk]}</p>
        </div>
      </div>
      <div className="alert-banner__rec">
        <p className="alert-banner__rec-label">Recommendation</p>
        <p className="alert-banner__rec-text">{rec}</p>
      </div>
    </div>
  );
}
