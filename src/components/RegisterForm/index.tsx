import {
  Button,
  CircularProgress,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
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
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import styles from './styles';
import { AuthAction } from '@/actions';
import { showNotification } from '@/components/Notification';
import PasswordStrengthBar from '@/components/PasswordStrengthBar';
import { HTTP_CODES } from '@/constants';
import PolicyPreviewDialog from '@/dialogs/PolicyPreview';
import { AppState } from '@/reducers';
import APIService from '@/services/APIService';
import { to6393Format } from '@/utils/languages';
import { sendOnRegisterButtonClickEvent } from '@/utils/trackingEvents';
import { checkEmail, checkPasswordStrength } from '@/utils/validation';
import { setFieldAsRequired } from '@/utils/validationRules';

type RegisterFormData = {
  email: string;
  password: string;
  rePassword: string;
  privacyPolicyAcceptance: boolean;
};

interface Props {
  onUserCreated?: () => void | Promise<void>;
}

const RegisterForm = ({ onUserCreated = (): void => {} }: Props): JSX.Element => {
  const classes = styles();
  const dispatch = useDispatch();
  const { register, handleSubmit, getValues, errors, watch } = useForm<RegisterFormData>();
  const { t, i18n: i18Instance } = useTranslation();

  const cashbuzzData = useSelector((state: AppState) => state.cashbuzz.data);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [policePreviewDialogOpened, setPolicyPreviewDialogOpened] = useState(false);
  const [policyPreviewContent, setPolicyPreviewContent] = useState<{content?: string; title?: string}>();
  const [showPassword, setShowPassword] = useState(false);
  const [showRePassword, setShowRePassword] = useState(false);

  const password = watch('password');

  const onSubmit = async (data: RegisterFormData): Promise<void> => {
    setIsLoading(true);

    try {
      const query = new URLSearchParams(window.location.search);
      const campaignQuery = query.get('campaign') || undefined;
      const partnerQuery = query.get('partner');
      const partnerId = partnerQuery ? Number.parseInt(partnerQuery, 10) : undefined;

      await sendOnRegisterButtonClickEvent(partnerId || 0);

      await APIService.authentication.register(
        data.email,
        data.password,
        data.privacyPolicyAcceptance,
        to6393Format(i18Instance.languages[0])?.toUpperCase(),
        partnerId,
        campaignQuery
      );

      await onUserCreated();
      await dispatch(AuthAction.login({ email: data.email, password: data.password }, true));
    } catch (error) {
      if (error.response.status === HTTP_CODES.REGISTER.ALREADY_EXIST) {
        showNotification({ content: t('register.email_already_exists'), type: 'error' });
      } else {
        showNotification({ content: t('common.internal_error'), type: 'error' });
      }
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
        autoComplete="new-password"
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
        autoComplete="new-password"
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
        inputRef={ register({
          required: setFieldAsRequired('general'),
          validate: (value) => checkPasswordStrength(value) || t('validation.password.score').toString()
        }) }
        label={ t('auth.password') }
        name="password"
        type={ showPassword ? 'text' : 'password' }
        variant="outlined"
      />
      <TextField
        autoComplete="new-password"
        error={ !!errors.rePassword }
        helperText={ errors.rePassword?.message }
        InputProps={ {
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={ (): void => { setShowRePassword(!showRePassword); } }
              >
                { showRePassword ? <VisibilityIcon /> : <VisibilityOffIcon /> }
              </IconButton>
            </InputAdornment>
          )
        } }
        inputRef={ register({
          required: setFieldAsRequired('general'),
          validate: (value) => getValues('password') === getValues('rePassword') || checkPasswordStrength(value) || t('validation.password.confirmation').toString()
        }) }
        label={ t('auth.password_confirmation') }
        name="rePassword"
        type={ showRePassword ? 'text' : 'password' }
        variant="outlined"
      />
      <PasswordStrengthBar password={ password } />
      <FormControl
        className="checkbox policy-checkbox"
        error={ !!errors.privacyPolicyAcceptance }
      >
        <FormControlLabel
          control={ (
            <Checkbox
              color="primary"
              inputRef={ register({ required: setFieldAsRequired('checkbox') }) }
              name="privacyPolicyAcceptance"
            />
          ) }
          label={ (
            <Trans i18nKey="register.terms_of_use">
              <Link onClick={ (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
                event.preventDefault();
                setPolicyPreviewContent({ content: cashbuzzData?.tospp, title: t('menu.terms_of_use') });
                setPolicyPreviewDialogOpened(true);
              } }
              />
              <Link onClick={ (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
                event.preventDefault();
                setPolicyPreviewContent({ content: cashbuzzData?.gdp, title: t('menu.privacy_policy') });
                setPolicyPreviewDialogOpened(true);
              } }
              />
            </Trans>
          ) }
          onClick={ (event): void => {
            event.persist();

            const isCheckbox = (event.target as HTMLElement).classList.contains('MuiCheckbox-root');
            const hasCheckboxParent = !!(event.target as HTMLElement).closest('.MuiCheckbox-root');

            if (!isCheckbox && !hasCheckboxParent) {
              event.preventDefault();
            }
          } }
        />
        <FormHelperText>{ errors.privacyPolicyAcceptance?.message }</FormHelperText>
      </FormControl>
      <FormControl className="submit">
        <Button
          className="submit-button"
          color="primary"
          disabled={ isLoading }
          size="large"
          type="submit"
          variant="contained"
        >
          { isLoading ? <CircularProgress size={ 26 } /> : t('register.button_text') }
        </Button>
      </FormControl>
      <PolicyPreviewDialog
        content={ policyPreviewContent?.content }
        isOpened={ policePreviewDialogOpened }
        onClose={ (): void => { setPolicyPreviewDialogOpened(false); } }
        title={ policyPreviewContent?.title }
      />
    </form>
  );
};

export default RegisterForm;
