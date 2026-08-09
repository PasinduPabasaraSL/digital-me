import { useEffect, useState } from 'react';

/**
 * Below this width a floating-window desktop stops being usable, so the shell
 * swaps to the Ubuntu Touch style launcher instead of scaling windows down.
 */
const MOBILE_QUERY = '(max-width: 820px), (pointer: coarse) and (max-width: 1024px)';

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(MOBILE_QUERY).matches,
  );

  useEffect(() => {
    const query = window.matchMedia(MOBILE_QUERY);
    const onChange = (event: MediaQueryListEvent) => setIsMobile(event.matches);
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  return isMobile;
}
