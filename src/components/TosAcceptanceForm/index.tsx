import {
  Button,
  CircularProgress,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Link,
  Typography
} from '@material-ui/core';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import styles from './styles';
import { AuthAction } from '@/actions';
import { showNotification } from '@/components/Notification';
import PolicyPreviewDialog from '@/dialogs/PolicyPreview';
import { AppState } from '@/reducers';
import { setFieldAsRequired } from '@/utils/validationRules';

export type TosAcceptanceFormData = {
  acceptance: boolean;
};

const TosAcceptanceForm = (): JSX.Element => {
  const { t } = useTranslation();
  const classes = styles();
  const dispatch = useDispatch();
  const { register, handleSubmit, errors } = useForm<TosAcceptanceFormData>();

  const cashbuzzData = useSelector((state: AppState) => state.cashbuzz.data);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [policePreviewDialogOpened, setPolicyPreviewDialogOpened] = useState(false);
  const [policyPreviewContent, setPolicyPreviewContent] = useState<{content?: string; title?: string}>();

  const onSubmit = async (): Promise<void> => {
    setIsLoading(true);

    try {
      await dispatch(AuthAction.acceptToS());
    } catch (error) {
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
      <FormControl className="info">
        <Typography variant="subtitle1">
          { t('auth.tos_acceptance_info') }
        </Typography>
      </FormControl>
      <FormControl
        className="checkbox policy-checkbox"
        error={ !!errors.acceptance }
      >
        <FormControlLabel
          control={ (
            <Checkbox
              color="primary"
              inputRef={ register({ required: setFieldAsRequired('checkbox') }) }
              name="acceptance"
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
        <FormHelperText>{ errors.acceptance?.message }</FormHelperText>
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
          { isLoading ? <CircularProgress size={ 26 } /> : t('common.confirm') }
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

export default TosAcceptanceForm;
