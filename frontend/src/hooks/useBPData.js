import { useState, useEffect, useCallback } from 'react';
import { bpService } from '../services/api';

export function useBPData(autoRefresh = true) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetch = useCallback(async () => {
    try {
      const res = await bpService.getRecords();
      const sorted = [...res.data].sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
      setRecords(sorted);
      setLastUpdated(new Date());
      setError(null);
    } catch {
      setError('Failed to fetch records');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
    if (!autoRefresh) return;
    const interval = setInterval(fetch, 5000);
    return () => clearInterval(interval);
  }, [fetch, autoRefresh]);

  const download = async () => {
    try {
      const res = await bpService.downloadCSV();
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement('a');
      a.href = url;
      a.download = 'bp_data.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    } catch {
      alert('Download failed');
    }
  };

  return { records, loading, error, refresh: fetch, download, lastUpdated };
}
