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
import { AppState } from '@/reducers';
import ApiService from '@/services/APIService';
import { setFieldAsRequired } from '@/utils/validationRules';

export type ChangeEmailStepTwoFormData = {
  password: string;
};

interface Props {
  email: string;
  onError?: () => void;
  onSuccess?: () => void;
}

const ChangeEmailStepOne = ({
  email,
  onError = (): void => {},
  onSuccess = (): void => {}
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = styles();
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, errors } = useForm<ChangeEmailStepTwoFormData>();
  const oldEmail = useSelector((state: AppState) => state.auth.user?.email);

  const onSubmit = async (formData: ChangeEmailStepTwoFormData): Promise<void> => {
    setIsLoading(true);

    try {
      const { data } = await ApiService.user.getChangeToken(oldEmail || '', formData.password);
      await ApiService.user.changeEmail(oldEmail || '', email, data.changeToken);

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
        defaultValue=""
        error={ !!errors.password }
        helperText={ errors.password?.message }
        inputRef={ register({
          required: setFieldAsRequired('general')
        }) }
        label={ t('auth.password') }
        name="password"
        type="password"
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
          { isLoading ? <CircularProgress size={ 26 } /> : t('common.confirm') }
        </Button>
      </FormControl>
    </form>
  );
};

export default ChangeEmailStepOne;
