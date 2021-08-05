import { useTheme } from '@material-ui/core';
import React, { useMemo } from 'react';
import SVG from 'react-inlinesvg';

import styles from './styles';

interface Props {
  icon: string;
  height?: number;
  type?: 'success' | 'error';
  width?: number;
}

const CircleIcon = ({
  icon,
  height = 24,
  type = 'success',
  width = 24
}: Props): JSX.Element => {
  const theme = useTheme();

  const color = useMemo(() => {
    switch (type) {
      case 'error':
        return theme.palette.error.main;
      case 'success':
      default:
        return theme.palette.success.main;
    }
  }, [theme, type]);
  const classes = styles({ color, height, width });

  return (
    <div className={ classes.root }>
      <SVG src={ icon } />
    </div>
  );
};

export default CircleIcon;
