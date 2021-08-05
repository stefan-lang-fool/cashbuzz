import {
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  TextField,
  Typography
} from '@material-ui/core';
import React, { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import styles from './styles';
import { loading, closeLoading } from '@/components/CustomLoader';
import { showNotification } from '@/components/Notification';
import { HTTP_CODES } from '@/constants';
import { AppState } from '@/reducers';
import APIService from '@/services/APIService';
import { setFieldAsRequired } from '@/utils/validationRules';

type FormData = {
  code: string;
}

const Code = (): JSX.Element => {
  const { t } = useTranslation();
  const classes = styles();
  const { errors, register, handleSubmit, reset } = useForm<FormData>();
  const user = useSelector((state: AppState) => state.auth.user);

  const [isLoading, setIsLoading] = useState(true);
  const [isUseCodeLoading, setIsUseCodeLoading] = useState(false);

  const loadingIdRef = useRef<null|number>(null);

  const onSubmit = async (data: FormData): Promise<void> => {
    setIsUseCodeLoading(true);

    try {
      const { status } = await APIService.user.useCode(data.code);

      if (status === HTTP_CODES.USE_CODE.ALREADY_USED) {
        showNotification({ content: t('code.code_already_used'), type: 'error' });
      } else {
        showNotification({ content: t('code.submitted'), type: 'success' });
      }

      reset();
    } catch (error) {
      if (error.response.status === HTTP_CODES.USE_CODE.INVALID_CODE) {
        showNotification({ content: t('code.code_not_found'), type: 'error' });
      } else {
        showNotification({ content: t('common.internal_error'), type: 'error' });
      }
    } finally {
      setIsUseCodeLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (isLoading) {
      loadingIdRef.current = loading({ elementSelector: 'main .dashboard-view-element-root' });
    } else {
      closeLoading(loadingIdRef.current);
      loadingIdRef.current = null;
    }
  }, [isLoading]);

  useEffect(() => (): void => {
    if (loadingIdRef.current) {
      closeLoading(loadingIdRef.current);
    }
  }, []);

  return (
    <div className={ `${classes.root} dashboard-view-element-root` }>
      <div className={ `${classes.root}-enter-code` }>
        <Typography
          className="section-title"
          variant="h4"
        >
          { t('code.enter_code') }
        </Typography>
        <Typography
          className="section-info"
          variant="subtitle1"
        >
          { t('code.enter_code_info') }
        </Typography>
        <form
          className="use-code-form"
          onSubmit={ handleSubmit(onSubmit) }
        >
          <Grid
            alignItems="center"
            container
            spacing={ 4 }
          >
            <Grid
              className="responsive"
              item
              xs={ 6 }
            >
              <TextField
                error={ !!errors.code }
                helperText={ errors.code?.message }
                inputRef={ register({ required: setFieldAsRequired('general') }) }
                label={ t('code.enter_code_placeholder') }
                name="code"
                variant="outlined"
              />
            </Grid>
            <Grid item>
              <Button
                className="use-code-submit"
                color="primary"
                size="large"
                type="submit"
                variant="contained"
              >
                { isUseCodeLoading ? <CircularProgress size={ 26 } /> : t('common.confirm') }
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
      <Divider style={ { marginTop: '40px' } } />
      <div className={ `${classes.root}-your-code` }>
        <Typography
          className="section-title"
          variant="h4"
        >
          { t('code.your_code') }
        </Typography>
        <Typography
          className="section-info"
          variant="subtitle1"
        >
          { t('code.your_code_info') }
        </Typography>
        <Grid container>
          <Paper className={ classes.codePaper }>
            <Typography variant="h5">
              { user?.mgm_key }
            </Typography>
          </Paper>
        </Grid>
      </div>
    </div>
  );
};

export default Code;
