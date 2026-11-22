const KEY = '__retailos_ping';
const EVENT = 'retailos-live';

export function pingLive() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEY, String(Date.now()));
  } catch {
    /* ignore */
  }
  window.dispatchEvent(new Event(EVENT));
}

export function onLive(cb: () => void) {
  if (typeof window === 'undefined') return () => {};
  const wrap = () => cb();
  const onStorage = (e: StorageEvent) => {
    if (e.key === KEY) cb();
  };
  window.addEventListener(EVENT, wrap);
  window.addEventListener('storage', onStorage);
  return () => {
    window.removeEventListener(EVENT, wrap);
    window.removeEventListener('storage', onStorage);
  };
}

export async function apiSend(url: string, method: 'POST' | 'PATCH', body: unknown) {
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  pingLive();
  return res;
}
