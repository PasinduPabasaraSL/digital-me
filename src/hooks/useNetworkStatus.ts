import { useEffect, useState } from 'react';

type Connection = {
  effectiveType?: string;
  type?: string;
  addEventListener?: (type: 'change', listener: () => void) => void;
  removeEventListener?: (type: 'change', listener: () => void) => void;
};

function connection(): Connection | undefined {
  return (navigator as Navigator & { connection?: Connection }).connection;
}

export type NetworkStatus = {
  online: boolean;
  /** "4g", "3g", … where the Network Information API is available. */
  effectiveType?: string;
};

/** Reports the visitor's real connectivity, not a simulated toggle. */
export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(() => ({
    online: typeof navigator === 'undefined' ? true : navigator.onLine,
    effectiveType: connection()?.effectiveType,
  }));

  useEffect(() => {
    const update = () =>
      setStatus({ online: navigator.onLine, effectiveType: connection()?.effectiveType });

    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    connection()?.addEventListener?.('change', update);

    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
      connection()?.removeEventListener?.('change', update);
    };
  }, []);

  return status;
}
