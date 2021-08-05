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

import styles from './styles';
import DialogTitle from '@/components/DialogTitle';
import { showNotification } from '@/components/Notification';
import { HTTP_CODES } from '@/constants';
import PolicyPreviewDialog from '@/dialogs/PolicyPreview';
import { Partner } from '@/interfaces';
import APIService from '@/services/APIService';
import { setFieldAsRequired } from '@/utils/validationRules';

type PartnerPolicyFormData = {
  privacyPolicyAcceptance: boolean;
};

interface Props {
  isOpened: boolean;
  onClose?: () => void | Promise<void>;
  onSubmit?: () => void | Promise<void>;
  partner?: Partner;
}

const UpdatePartnerDialog = ({
  isOpened,
  onClose = (): void => {},
  onSubmit = (): void => {},
  partner
}: Props): JSX.Element => {
  const classes = styles();
  const { t } = useTranslation();
  const { register, handleSubmit, errors } = useForm<PartnerPolicyFormData>();

  const [isLoading, setIsLoading] = useState(false);
  const [policePreviewDialogOpened, setPolicyPreviewDialogOpened] = useState(false);
  const [policyPreviewContent, setPolicyPreviewContent] = useState<{content?: string; title?: string}>();

  const onDialogClose = async (): Promise<void> => {
    await onClose();
  };

  const onFormSubmit = async (): Promise<void> => {
    if (!partner) {
      return;
    }

    setIsLoading(true);

    try {
      await APIService.partners.acceptTOS(partner.id);

      await onDialogClose();
      onSubmit();
    } catch (error) {
      if (error.response.status === HTTP_CODES.SETTINGS.INVALID_BIRTH_DATE) {
        showNotification({ content: t('partners.incorrect_birthdate'), type: 'error' });
      } else {
        showNotification({ content: t('common.internal_error'), type: 'error' });
      }
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
      <DialogTitle title={ t('cashbacks.update_partner_dialog.title') } />
      <DialogContent dividers>
        <form
          className={ classes.form }
          onSubmit={ handleSubmit(onFormSubmit) }
        >
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
                <Trans i18nKey="onboarding.partner_policy.policy_agreement">
                  <Link
                    onClick={ (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
                      event.preventDefault();

                      setPolicyPreviewContent({
                        content: partner?.termsOfService,
                        title: t('partner.terms_of_use')
                      });
                      setPolicyPreviewDialogOpened(true);
                    } }
                  />
                  <Link
                    onClick={ (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
                      event.preventDefault();

                      setPolicyPreviewContent({
                        content: partner?.privacyPolicy,
                        title: t('partner.privacy_policy')
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
            <FormHelperText>{ errors.privacyPolicyAcceptance?.message }</FormHelperText>
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

export default UpdatePartnerDialog;
