import {
  Button,
  FormControl,
  TextField
} from '@material-ui/core';
import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import styles from './styles';
import { setFieldAsRequired } from '@/utils/validationRules';

export type ResetPasswordStepTwoFormData = {
  code: string;
};

interface Props {
  onSuccess?: (code: string) => void;
}

const ResetPasswordStepTwo = ({
  onSuccess = (): void => {}
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = styles();
  const { register, handleSubmit, errors } = useForm<ResetPasswordStepTwoFormData>();

  const onSubmit = async (data: ResetPasswordStepTwoFormData): Promise<void> => {
    onSuccess(data.code);
  };

  return (
    <form
      className={ classes.root }
      onSubmit={ handleSubmit(onSubmit) }
    >
      <TextField
        defaultValue=""
        error={ !!errors.code }
        helperText={ errors.code?.message }
        inputRef={ register({ required: setFieldAsRequired('general') }) }
        label={ t('auth.forgot_password_code') }
        name="code"
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

export default ResetPasswordStepTwo;
