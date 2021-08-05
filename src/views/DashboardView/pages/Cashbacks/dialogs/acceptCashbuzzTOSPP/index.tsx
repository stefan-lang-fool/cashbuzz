import {
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  DialogContent,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  Link
} from '@material-ui/core';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Trans, useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import styles from './styles';
import DialogTitle from '@/components/DialogTitle';
import { showNotification } from '@/components/Notification';
import PolicyPreviewDialog from '@/dialogs/PolicyPreview';
import { AppState } from '@/reducers';
import APIService from '@/services/APIService';
import { setFieldAsRequired } from '@/utils/validationRules';

type CashbuzzPolicyFormData = {
  tosppAcceptance: boolean;
};

interface Props {
  isOpened: boolean;
  onClose?: () => void | Promise<void>;
  onSubmit?: () => void | Promise<void>;
}

const AcceptCashbuzzPolicyDialog = ({
  isOpened,
  onClose = (): void => {},
  onSubmit = (): void => {}
}: Props): JSX.Element => {
  const classes = styles();
  const { t } = useTranslation();
  const { register, handleSubmit, errors } = useForm<CashbuzzPolicyFormData>();
  const cashbuzzData = useSelector((state: AppState) => state.cashbuzz.data);

  const [isLoading, setIsLoading] = useState(false);
  const [policePreviewDialogOpened, setPolicyPreviewDialogOpened] = useState(false);
  const [policyPreviewContent, setPolicyPreviewContent] = useState<{content?: string; title?: string}>();

  const onDialogClose = async (): Promise<void> => {
    await onClose();
  };

  const onFormSubmit = async (): Promise<void> => {
    setIsLoading(true);

    try {
      await APIService.cashbuzz.acceptPolicy();

      await onDialogClose();
      onSubmit();
    } catch (error) {
      showNotification({ content: t('common.internal_error'), type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!policePreviewDialogOpened) {
      setPolicyPreviewContent(undefined);
    }
  }, [policePreviewDialogOpened]);

  return (
    <Dialog
      className={ classes.root }
      disableBackdropClick
      onClose={ onDialogClose }
      open={ isOpened }
      PaperProps={ {
        className: classes.paper
      } }
    >
      <DialogTitle title={ t('cashbacks.update_tospp_dialog.title') } />
      <DialogContent dividers>
        <form
          className={ classes.form }
          onSubmit={ handleSubmit(onFormSubmit) }
        >
          <FormControl
            className="checkbox policy-checkbox"
            error={ !!errors.tosppAcceptance }
          >
            <FormControlLabel
              control={ (
                <Checkbox
                  color="primary"
                  inputRef={ register({ required: setFieldAsRequired('checkbox') }) }
                  name="tosppAcceptance"
                />
              ) }
              label={ (
                <Trans i18nKey="register.terms_of_use">
                  <Link
                    onClick={ (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
                      event.preventDefault();

                      setPolicyPreviewContent({
                        content: cashbuzzData?.tospp,
                        title: t('menu.terms_of_use')
                      });
                      setPolicyPreviewDialogOpened(true);
                    } }
                  />
                  <Link
                    onClick={ (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
                      event.preventDefault();

                      setPolicyPreviewContent({
                        content: cashbuzzData?.gdp,
                        title: t('menu.privacy_policy')
                      });
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
            <FormHelperText>{ errors.tosppAcceptance?.message }</FormHelperText>
          </FormControl>
          <div className="actions">
            <Grid
              container
              justify="flex-end"
              spacing={ 2 }
            >
              <Grid item>
                <FormControl>
                  <Button
                    onClick={ onDialogClose }
                    size="large"
                    variant="contained"
                  >
                    { t('common.cancel') }
                  </Button>
                </FormControl>
              </Grid>
              <Grid item>
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
              </Grid>
            </Grid>
          </div>
        </form>
      </DialogContent>
      <PolicyPreviewDialog
        content={ policyPreviewContent?.content }
        isOpened={ policePreviewDialogOpened }
        onClose={ (): void => { setPolicyPreviewDialogOpened(false); } }
        title={ policyPreviewContent?.title }
      />
    </Dialog>
  );
};

export default AcceptCashbuzzPolicyDialog;
