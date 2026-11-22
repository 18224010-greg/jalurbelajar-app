import { useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';

// Memuat ulang data setiap layar kembali terlihat (kecuali saat pertama kali dibuka).
export default function useFocusReload(reload) {
  const first = useRef(true);
  useFocusEffect(
    useCallback(() => {
      if (first.current) {
        first.current = false;
        return;
      }
      reload();
    }, [reload]),
  );
}
