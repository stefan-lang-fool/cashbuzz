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
import PasswordStrengthBar from '@/components/PasswordStrengthBar';
import APIService from '@/services/APIService';
import { checkPasswordStrength } from '@/utils/validation';
import { setFieldAsRequired } from '@/utils/validationRules';

export type ResetPasswordStepThreeFormData = {
  newPassword: string;
  newPasswordConfirm: string;
};

interface Props {
  code: string;
  email: string;
  onError?: () => void;
  onSuccess?: () => void;
}

const ResetPasswordStepThree = ({
  code,
  email,
  onError = (): void => {},
  onSuccess = (): void => {}
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = styles();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { register, handleSubmit, errors, getValues, watch } = useForm<ResetPasswordStepThreeFormData>();

  const password = watch('newPassword');

  const onSubmit = async (data: ResetPasswordStepThreeFormData): Promise<void> => {
    setIsLoading(true);
    try {
      await APIService.authentication.resetPasswordConfirmation(code, email, data.newPassword);

      onSuccess();
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
        error={ !!errors.newPassword }
        helperText={ errors.newPassword?.message }
        inputRef={ register({
          required: setFieldAsRequired('general'),
          validate: (value) => checkPasswordStrength(value) || t('validation.password.score').toString()
        }) }
        label={ t('auth.password') }
        name="newPassword"
        type="password"
        variant="outlined"
      />
      <TextField
        error={ !!errors.newPasswordConfirm }
        helperText={ errors.newPasswordConfirm?.message }
        inputRef={ register({
          required: setFieldAsRequired('general'),
          validate: () => getValues('newPassword') === getValues('newPasswordConfirm') || t('validation.password.confirmation').toString()
        }) }
        label={ t('auth.password_confirmation') }
        name="newPasswordConfirm"
        type="password"
        variant="outlined"
      />
      <PasswordStrengthBar password={ password } />
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

export default ResetPasswordStepThree;
