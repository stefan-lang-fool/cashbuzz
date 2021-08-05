import {
  Button,
  CircularProgress,
  FormControl,
  TextField
} from '@material-ui/core';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import styles from './styles';
import { showNotification } from '@/components/Notification';
import APIService from '@/services/APIService';
import { setFieldAsRequired } from '@/utils/validationRules';

export type ValidateEmailFormData = {
  email: string;
};

const ResetPasswordRequestForm = (): JSX.Element => {
  const { t } = useTranslation();
  const classes = styles();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { register, handleSubmit, errors } = useForm<ValidateEmailFormData>();

  const onSubmit = async (data: ValidateEmailFormData): Promise<void> => {
    setIsLoading(true);
    try {
      await APIService.authentication.resetPasswordRequest(data.email);
    } catch {
      showNotification({ content: t('common.internal_error'), type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className={ classes.root }
      onSubmit={ handleSubmit(onSubmit) }
    >
      <TextField
        defaultValue=""
        error={ !!errors.email }
        helperText={ errors.email?.message }
        inputRef={ register({ required: setFieldAsRequired('general') }) }
        label={ t('auth.email') }
        name="email"
        variant="outlined"
      />
      <FormControl className="submit">
        <Button
          className="submit-button"
          color="primary"
          disabled={ isLoading }
          size="large"
          type="submit"
          variant="contained"
        >
          { isLoading ? <CircularProgress size={ 26 } /> : t('common.confirm') }
        </Button>
      </FormControl>
    </form>
  );
};

export default ResetPasswordRequestForm;
