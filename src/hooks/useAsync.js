import { useCallback, useEffect, useRef, useState } from 'react';

// Menjalankan fungsi async dan menyimpan { data, loading, error }.
// Hasil dari permintaan lama diabaikan bila permintaan baru sudah dimulai.
export default function useAsync(fn, deps = [], { auto = true } = {}) {
  const [state, setState] = useState({ data: null, loading: auto, error: null });
  const counter = useRef(0);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const run = useCallback(async () => {
    const mine = ++counter.current;
    setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await fn();
      if (mine === counter.current) setState({ data, loading: false, error: null });
    } catch (error) {
      if (mine === counter.current) {
        setState({ data: null, loading: false, error: error.message || 'Terjadi kesalahan' });
      }
    }
  }, deps);

  useEffect(() => {
    if (auto) run();
  }, [run, auto]);

  return { ...state, reload: run };
}
