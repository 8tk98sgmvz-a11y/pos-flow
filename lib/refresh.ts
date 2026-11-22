import { onLive } from '@/lib/live';

/** Primera carga al instante. Mutaciones y foco se agrupan para no disparar N fetches. */
export function onLiveRefresh(cb: () => void, wait = 80) {
  let t: ReturnType<typeof setTimeout> | undefined;
  const later = () => {
    clearTimeout(t);
    t = setTimeout(() => cb(), wait);
  };

  cb();
  const stop = onLive(later);
  const vis = () => {
    if (document.visibilityState === 'visible') later();
  };
  document.addEventListener('visibilitychange', vis);
  return () => {
    clearTimeout(t);
    stop();
    document.removeEventListener('visibilitychange', vis);
  };
}
