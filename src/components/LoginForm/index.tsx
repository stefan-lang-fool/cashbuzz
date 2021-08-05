import {
  Button,
  CircularProgress,
  FormControl,
  IconButton,
  InputAdornment,
  Link,
  TextField
} from '@material-ui/core';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon
} from '@material-ui/icons';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import styles from './styles';
import { AuthAction } from '@/actions';
import { showNotification } from '@/components/Notification';
import { HTTP_CODES } from '@/constants';
import { getPartnerId } from '@/utils/partnerId';
import { sendOnLoginButtonClickEvent } from '@/utils/trackingEvents';
import { checkEmail } from '@/utils/validation';
import { setFieldAsRequired } from '@/utils/validationRules';

export type LoginFormData = {
  email: string;
  password: string;
};

interface Props {
  forgotPasswordClicked?: () => void;
}

const LoginForm = ({ forgotPasswordClicked }: Props): JSX.Element => {
  const classes = styles();
  const dispatch = useDispatch();
  const { register, handleSubmit, errors } = useForm<LoginFormData>();
  const { t } = useTranslation();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (data: LoginFormData): Promise<void> => {
    setIsLoading(true);
    await sendOnLoginButtonClickEvent(getPartnerId());

    try {
      await dispatch(AuthAction.login(data));
    } catch (error) {
      const status = error.response.status === HTTP_CODES.STANDARD.UNAUTHORIZED
        ? t('login.invalid_credentials')
        : t('common.internal_error');

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
      <TextField
        defaultValue=""
        error={ !!errors.password }
        helperText={ errors.password?.message }
        InputProps={ {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={ (): void => { setShowPassword(!showPassword); } }
              >
                { showPassword ? <VisibilityIcon /> : <VisibilityOffIcon /> }
              </IconButton>
            </InputAdornment>
          )
        } }
        inputRef={ register({ required: setFieldAsRequired('general') }) }
        label={ t('auth.password') }
        name="password"
        type={ showPassword ? 'text' : 'password' }
        variant="outlined"
      />
      { forgotPasswordClicked && (
        <FormControl className="forgot-password">
          <Link
            component="button"
            onClick={ (): void => forgotPasswordClicked() }
            type="button"
          >
            { t('auth.forgot_password') }
          </Link>
        </FormControl>
      ) }
      <FormControl className="submit">
        <Button
          className="submit-button"
          color="primary"
          disabled={ isLoading }
          size="large"
          type="submit"
          variant="contained"
        >
          { isLoading ? <CircularProgress size={ 26 } /> : t('auth.login') }
        </Button>
      </FormControl>
    </form>
  );
};

export default LoginForm;
