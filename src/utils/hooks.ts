/* eslint-disable import/prefer-default-export */
import { useTheme } from '@material-ui/core';
import { useEffect, useRef, useState } from 'react';

export const useMobile = (): boolean => {
  const theme = useTheme();
  const [isMobile, setIsMobile] = useState(window.innerWidth < theme.breakpoints.width('md'));

  const isMobileRef = useRef(isMobile);

  useEffect(() => {
    const resizeHandler = (): void => {
      const isMobileTemp = window.innerWidth < theme.breakpoints.width('md');

      if (isMobileTemp !== isMobileRef.current) {
        isMobileRef.current = isMobileTemp;
        setIsMobile(isMobileRef.current);
      }
    };

    window.addEventListener('resize', resizeHandler);

    return (): void => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [theme]);

  return isMobile;
};
