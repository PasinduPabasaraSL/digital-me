import { useEffect, useState } from 'react';

type BatteryManager = EventTarget & {
  level: number;
  charging: boolean;
};

export type BatteryStatus = { level: number; charging: boolean };

/**
 * Reads the visitor's actual battery via the Battery Status API. Firefox and
 * Safari removed it, so this returns null there and the caller hides the row
 * rather than inventing a number.
 */
export function useBattery(): BatteryStatus | null {
  const [battery, setBattery] = useState<BatteryStatus | null>(null);

  useEffect(() => {
    const getBattery = (
      navigator as Navigator & { getBattery?: () => Promise<BatteryManager> }
    ).getBattery;
    if (!getBattery) return;

    let manager: BatteryManager | null = null;
    let cancelled = false;
    const update = () => {
      if (manager) setBattery({ level: manager.level, charging: manager.charging });
    };

    void getBattery.call(navigator).then((result) => {
      if (cancelled) return;
      manager = result;
      update();
      manager.addEventListener('levelchange', update);
      manager.addEventListener('chargingchange', update);
    });

    return () => {
      cancelled = true;
      manager?.removeEventListener('levelchange', update);
      manager?.removeEventListener('chargingchange', update);
    };
  }, []);

  return battery;
}
