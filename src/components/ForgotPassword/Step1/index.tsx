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
import { getPartnerId } from '@/utils/partnerId';
import { sendPasswordResetEvent } from '@/utils/trackingEvents';
import { checkEmail } from '@/utils/validation';
import { setFieldAsRequired } from '@/utils/validationRules';

export type ResetPasswordStepOneFormData = {
  email: string;
};

interface Props {
  onError?: () => void;
  onSuccess?: (email: string) => void;
}

const ResetPasswordStepOne = ({
  onError = (): void => {},
  onSuccess = (): void => {}
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = styles();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { register, handleSubmit, errors } = useForm<ResetPasswordStepOneFormData>();

  const onSubmit = async (data: ResetPasswordStepOneFormData): Promise<void> => {
    setIsLoading(true);
    try {
      await APIService.authentication.resetPasswordRequest(data.email);

      sendPasswordResetEvent(getPartnerId(), data.email);

      onSuccess(data.email);
    } catch {
      showNotification({ content: t('common.internal_error'), type: 'error' });
      onError();
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
        inputRef={ register({
          required: setFieldAsRequired('general'),
          validate: (value) => checkEmail(value) || t('validation.pattern').toString()
        }) }
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
          { isLoading ? <CircularProgress size={ 26 } /> : t('common.proceed') }
        </Button>
      </FormControl>
    </form>
  );
};

export default ResetPasswordStepOne;
