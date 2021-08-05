import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import React, { PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router';

import styles from './styles';
import { ICONS } from '@/assets';
import { AppState } from '@/reducers';

interface Props {
  noBack?: boolean;
  showLoading?: boolean;
  title?: string;
}

const UnauthorizedLayout = ({
  children,
  noBack = false,
  showLoading = false,
  title
}: PropsWithChildren<Props>): JSX.Element => {
  const { t } = useTranslation();
  const classes = styles();
  const authState = useSelector((state: AppState) => state.auth);
  const history = useHistory();

  return (
    <div className={ classes.root }>
      <div className={ classes.header }>
        { !noBack && (
          <Button
            className={ classes.returnButton }
            color="primary"
            onClick={ (): void => { history.goBack(); } }
            startIcon={ <SVG src={ ICONS.UNDO } /> }
            variant="outlined"
          >
            { t('common.return_to', [authState.user ? t('navigation.dashboard') : t('navigation.login')]) }
          </Button>
        ) }
        { title && (
          <Grid
            container
            spacing={ 3 }
          >
            <Grid item>
              <Typography
                className="section-title"
                variant="h4"
              >
                { title }
              </Typography>
            </Grid>
            <Grid item>
              { showLoading && <CircularProgress size={ 32 } /> }
            </Grid>
          </Grid>
        ) }
      </div>
      <div className={ classes.content }>
        { children }
      </div>
    </div>
  );
};

export default UnauthorizedLayout;
