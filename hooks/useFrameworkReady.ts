import { useEffect } from 'react';

export function useFrameworkReady() {
  useEffect(() => {
    // Mobile app - no web framework ready needed
    if (__DEV__) {
      // Development logging if needed
    }
  });
}
