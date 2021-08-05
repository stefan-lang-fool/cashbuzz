import {
  Paper,
  Typography,
  useTheme
} from '@material-ui/core';
import { Markup } from 'interweave';
import React from 'react';
import SVG from 'react-inlinesvg';

import styles from './styles';
import { ICONS } from '@/assets';

export type CardType = 'welcome' | 'connect' | 'resync' | 'primary' | 'warning' | 'other' | 'cashbacks';

interface Props {
  title: string | React.ReactNode;
  text: string | React.ReactNode;
  type: CardType;
  icon?: string;
}

const Card = ({ title, text, type, icon = undefined }: Props): JSX.Element => {
  const classes = styles();
  const theme = useTheme();

  const typeToColor: { [cardType: string]: string } = {
    accountVisibility: theme.custom.colors.error,
    welcome: theme.custom.colors.primary,
    connect: theme.custom.colors.error,
    resync: theme.custom.colors.error,
    cashbacks: theme.custom.colors.primary,
    primary: theme.palette.primary.main,
    warning: theme.palette.error.main,
    other: theme.custom.colors.inactiveText
  };

  const typeToIcon: { [cardType: string]: string } = {
    accountVisibility: ICONS.EYE,
    welcome: ICONS.ROCKET_LAUNCH,
    connect: ICONS.FLASH_ALERT,
    resync: ICONS.CONNECTION,
    cashbacks: ICONS.CURRENCY_USD_OUTLINE,
    primary: ICONS.FLASH_ALERT,
    warning: ICONS.FLASH_ALERT,
    other: ICONS.FLASH_ALERT
  };

  return (
    <Paper className={ classes.root }>
      <SVG
        src={ icon || typeToIcon[type] }
        style={ { width: '32px', minWidth: '32px', fill: typeToColor[type] } }
      />
      <div className={ classes.content }>
        <Typography
          style={ { fontWeight: 'bold' } }
          variant="h6"
        >
          { title }
        </Typography>
        <Typography
          className={ classes.subTitle }
          variant="h6"
        >
          { typeof text === 'string' ? <Markup content={ text } /> : text }
        </Typography>
      </div>
    </Paper>
  );
};

export default Card;
