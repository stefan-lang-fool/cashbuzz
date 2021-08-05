import {
  Button,
  CircularProgress,
  FormControl,
  TextField
} from '@material-ui/core';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import styles from './styles';
import PasswordStrengthBar from '@/components/PasswordStrengthBar';
import { AppState } from '@/reducers';
import APIService from '@/services/APIService';
import { checkPasswordStrength } from '@/utils/validation';
import { setFieldAsRequired } from '@/utils/validationRules';

type ChangePasswordFormData = {
  password: string;
  oldPassword: string;
  rePassword: string;
};

interface Props {
  onError?: () => void;
  onSuccess?: () => void;
}

const ChangePasswordForm = ({
  onError = (): void => {},
  onSuccess = (): void => {}
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = styles();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { register, handleSubmit, getValues, errors, watch } = useForm<ChangePasswordFormData>();
  const userEmail = useSelector((state: AppState) => state.auth.user?.email);

  const password = watch('password');

  const onSubmit = async (formData: ChangePasswordFormData): Promise<void> => {
    setIsLoading(true);

    try {
      const { data } = await APIService.user.getChangeToken(userEmail || '', formData.oldPassword);
      await APIService.user.changePassword(userEmail || '', formData.password, data.changeToken);

      onSuccess();
    } catch (error) {
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
        error={ !!errors.oldPassword }
        helperText={ errors.oldPassword?.message }
        inputRef={ register({
          required: setFieldAsRequired('general')
        }) }
        label={ t('change_password.old_password') }
        name="oldPassword"
        type="password"
        variant="outlined"
      />
      <TextField
        error={ !!errors.password }
        helperText={ errors.password?.message }
        inputRef={ register({
          required: setFieldAsRequired('general'),
          validate: (value) => checkPasswordStrength(value) || t('validation.password.score').toString()
        }) }
        label={ t('change_password.new_password') }
        name="password"
        type="password"
        variant="outlined"
      />
      <TextField
        error={ !!errors.rePassword }
        helperText={ errors.rePassword?.message }
        inputRef={ register({
          required: setFieldAsRequired('general'),
          validate: () => getValues('password') === getValues('rePassword') || t('validation.password.confirmation').toString()
        }) }
        label={ t('change_password.confirm_password') }
        name="rePassword"
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

export default ChangePasswordForm;
