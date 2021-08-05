import {
  ListItem,
  Typography,
  useTheme
} from '@material-ui/core';
import classNames from 'classnames';
import React, { useCallback } from 'react';

import { useTranslation } from 'react-i18next';
import styles from './styles';

import { to6391Format } from '@/utils/languages';
import { CircularProgressbar } from 'react-circular-progressbar';

export interface SingleTransaction {
  percent: number;
  title: string;
  amount: number;
}

interface Props extends SingleTransaction {
  onSelect?: (percent: number, title: string, amount: number) => void | Promise<void>;
}

const RegiosItem = ({ percent, title, amount, onSelect = (): void => {} }: Props): JSX.Element => {
  const classes = styles();
  const theme = useTheme();
  const { i18n: i18nInstance } = useTranslation();

  const onClickHandler = useCallback(() => onSelect(percent, title, amount), [onSelect, percent, title, amount]);

  return (
    <ListItem
      button
      className={ classes.root }
      onClick={ onClickHandler }
    >
      <div className={ classes.progress }>
        <CircularProgressbar
          value={percent}
          text={`${percent}%`}
          styles={{
            path: {
              stroke: theme.custom.colors.primary,
              strokeLinecap: 'butt',
              transition: 'stroke-dashoffset 0.5s ease 0s',
              transformOrigin: 'center center',
            },
            trail: {
              stroke: '#d6d6d6',
              strokeLinecap: 'butt',
              transformOrigin: 'center center',
            },
            text: {
              fill: theme.custom.colors.primary,
              fontSize: '16px',
            },
          }}
          />
      </div>
      <Typography className={ classes.contentSection }>
        { title }
      </Typography>
      <Typography className={ classNames({ [classes.amountSection]: true, negative: amount < 0, positive: amount >= 0 }) }>
        { new Intl.NumberFormat(to6391Format(i18nInstance.language), { style: 'currency', currency: 'EUR' }).format(amount) }
      </Typography>
    </ListItem>
  );
};

export default RegiosItem;
