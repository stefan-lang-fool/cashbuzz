import {
  Button,
  CircularProgress,
  FormControl,
  Link,
  TextField,
  Typography
} from '@material-ui/core';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import styles from './styles';
import { AuthAction } from '@/actions';
import { showNotification } from '@/components/Notification';
import { HTTP_CODES } from '@/constants';
import APIService from '@/services/APIService';
import { setFieldAsRequired } from '@/utils/validationRules';

export type ValidateEmailFormData = {
  validationcode: string;
};

interface Props {
  onUserValidated?: () => void | Promise<void>;
}

const ValidateEmailForm = ({ onUserValidated = (): void => {} }: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = styles();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingResend, setIsLoadingResend] = useState(false);
  const { register, handleSubmit, errors } = useForm<ValidateEmailFormData>();

  const resendValidationCode = async (): Promise<void> => {
    setIsLoadingResend(true);

    try {
      await APIService.user.resendValidationCode();

      showNotification({ content: t('email_confirmation.resend_code_success'), type: 'success' });
    } catch {
      showNotification({ content: t('common.internal_error'), type: 'error' });
    } finally {
      setIsLoadingResend(false);
    }
  };

  const onSubmit = async (data: ValidateEmailFormData): Promise<void> => {
    setIsLoading(true);

    try {
      await dispatch(AuthAction.validateEmail(data.validationcode));
      await onUserValidated();
    } catch (error) {
      const status = error.response.status === HTTP_CODES.EMAIL_VALIDATION.INCORRECT_CODE
        ? t('email_confirmation.invalid_code')
        : t('email_confirmation.error');
      showNotification({ content: status, type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      className={ classes.root }
      onSubmit={ handleSubmit(onSubmit) }
    >
      <FormControl className="info">
        <Typography variant="subtitle1">
          { t('auth.email_validation_info') }
        </Typography>
      </FormControl>
      <TextField
        defaultValue=""
        error={ !!errors.validationcode }
        helperText={ errors.validationcode?.message }
        inputRef={ register({ required: setFieldAsRequired('general') }) }
        label={ t('auth.email_validation_code') }
        name="validationcode"
        variant="outlined"
      />
      <div className="resend-code">
        <Typography variant="subtitle2">
          { `${t('email_confirmation.resend_code_info')} ` }
          <Link
            className="resend-code-submit-link"
            color="primary"
            onClick={ (): void => { resendValidationCode(); } }
          >
            { `${t('email_confirmation.resend_code_link')} ` }
            { isLoadingResend && <CircularProgress size={ 14 } /> }
          </Link>
        </Typography>
      </div>
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

export default ValidateEmailForm;
