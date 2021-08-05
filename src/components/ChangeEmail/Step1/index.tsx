import {
  Button,
  FormControl,
  TextField
} from '@material-ui/core';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import styles from './styles';
import { checkEmail } from '@/utils/validation';
import { setFieldAsRequired } from '@/utils/validationRules';

export type ChangeEmailStepOneFormData = {
  confirmEmail: string;
  email: string;
};

interface Props {
  onSuccess?: (email: string) => void;
}

const ChangeEmailStepOne = ({
  onSuccess = (): void => {}
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = styles();
  const { getValues, register, handleSubmit, errors } = useForm<ChangeEmailStepOneFormData>();

  const onSubmit = async (data: ChangeEmailStepOneFormData): Promise<void> => {
    onSuccess(data.email);
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
        error={ !!errors.confirmEmail }
        helperText={ errors.confirmEmail?.message }
        inputRef={ register({
          required: setFieldAsRequired('general'),
          validate: {
            pattern: (value): string | true => checkEmail(value) || t('validation.pattern').toString(),
            emailMatch: (value): string | true => getValues('email') === value || t('validation.email.confirmation').toString()
          }
        }) }
        label={ t('change_email.confirm_email') }
        name="confirmEmail"
        variant="outlined"
      />
      <FormControl className="submit">
        <Button
          className="submit-button"
          color="primary"
          size="large"
          type="submit"
          variant="contained"
        >
          { t('common.proceed') }
        </Button>
      </FormControl>
    </form>
  );
};

export default ChangeEmailStepOne;
