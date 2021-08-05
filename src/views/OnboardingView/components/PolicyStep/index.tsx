/* eslint-disable no-nested-ternary */
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Link from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation, Trans } from 'react-i18next';

import { useHistory } from 'react-router-dom';
import styles from './styles';
import { showNotification } from '@/components/Notification';
import { HTTP_CODES, ROUTES } from '@/constants';
import PolicyPreviewDialog from '@/dialogs/PolicyPreview';
import { Partner } from '@/interfaces';
import APIService from '@/services/APIService';
import { getPartnerId } from '@/utils/partnerId';
import { guidedTour } from '@/utils/trackingEvents';
import { setFieldAsRequired } from '@/utils/validationRules';

type PartnerPolicyFormData = {
  autoRedeemAcceptance: boolean;
  privacyPolicyAcceptance: boolean;
};

interface Props {
  data: Partner;
  isTospp?: boolean;
  id?: number;
  onSuccess?: () => void | Promise<void>;
  updateActiveStep?: (step: number) => void;
}

const PartnerPolicyPage = ({
  data: partnerData,
  id = 1,
  isTospp = false,
  onSuccess = (): void => {},
  updateActiveStep = (): void => {}
}: Props): JSX.Element => {
  const classes = styles();
  const history = useHistory();
  const { register, handleSubmit, errors } = useForm<PartnerPolicyFormData>();
  const { t } = useTranslation();

  const [confirmationLoading, setConfirmationLoading] = useState(false);
  const [isInvalidDate, setIsInvalidDate] = useState(false);
  const [policePreviewDialogOpened, setPolicyPreviewDialogOpened] = useState(false);
  const [policyPreviewContent, setPolicyPreviewContent] = useState<{content?: string; title?: string}>();
  const [showBankConnectionMessage, setShowBankConnectionMessage] = useState(isTospp);

  const onSubmit = async (data: PartnerPolicyFormData): Promise<void> => {
    setConfirmationLoading(true);

    try {
      await APIService.partners.changeAutoRedemptionStatus(id, data.autoRedeemAcceptance);
      guidedTour.sendTermsAcceptedEvent(getPartnerId());
      setShowBankConnectionMessage(true);
      localStorage.removeItem('guided-started');
      await onSuccess();
    } catch (error) {
      if (error.response.status === HTTP_CODES.SETTINGS.INVALID_BIRTH_DATE) {
        localStorage.removeItem('guided-started');
        showNotification({ content: t('partners.incorrect_birthdate'), type: 'error' });
        setIsInvalidDate(true);
      } else {
        showNotification({ content: t('common.internal_error'), type: 'error' });
      }
    } finally {
      setConfirmationLoading(false);
    }
  };

  useEffect(() => {
    if (!policePreviewDialogOpened) {
      setPolicyPreviewContent(undefined);
    }
  }, [policePreviewDialogOpened]);

  if (!partnerData) {
    return (
      <div className={ classes.loading }>
        <CircularProgress size={ 44 } />
      </div>
    );
  }

  if (showBankConnectionMessage) {
    return (
      <div className={ classes.root }>
        <Typography
          className={ `${classes.root}-header` }
          variant="h5"
        >
          { t('onboarding.partner_policy.post_info') }
        </Typography>
        <Button
          color="primary"
          onClick={ (): void => {
            history.push(ROUTES.AUTHORIZED.DASHBOARD);
          } }
          size="large"
          style={ { minWidth: 200, width: 'fit-content' } }
          variant="contained"
        >
          { t('onboarding.partner_policy.post_button') }
        </Button>
      </div>
    );
  }

  return (
    <div className={ classes.root }>
      <Typography
        className={ `${classes.root}-header` }
        variant="h5"
      >
        { t('onboarding.partner_policy.info') }
      </Typography>
      <form
        className={ classes.form }
        onSubmit={ handleSubmit(onSubmit) }
      >
        <FormControl className="checkbox auto-redeem-checkbox">
          <FormControlLabel
            control={ (
              <Checkbox
                color="primary"
                defaultChecked
                inputRef={ register() }
                name="autoRedeemAcceptance"
              />
            ) }
            label={ t('onboarding.partner_policy.auto_redeem') }
            onClick={ (event): void => {
              event.persist();

              const isCheckbox = (event.target as HTMLElement).classList.contains('MuiCheckbox-root');
              const hasCheckboxParent = !!(event.target as HTMLElement).closest('.MuiCheckbox-root');

              if (!isCheckbox && !hasCheckboxParent) {
                event.preventDefault();
              }
            } }
          />
        </FormControl>
        <FormControl
          className="checkbox policy-checkbox"
          error={ !!errors.privacyPolicyAcceptance }
        >
          <FormControlLabel
            control={ (
              <Checkbox
                color="primary"
                defaultChecked={ isTospp }
                inputRef={ register({ required: setFieldAsRequired('checkbox') }) }
                name="privacyPolicyAcceptance"
              />
            ) }
            label={ (
              <Trans i18nKey="onboarding.partner_policy.policy_agreement">
                <Link onClick={ (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
                  event.preventDefault();

                  setPolicyPreviewContent({
                    content: partnerData?.termsOfService,
                    title: t('partner.terms_of_use')
                  });
                  setPolicyPreviewDialogOpened(true);
                } }
                />
                <Link onClick={ (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void => {
                  event.preventDefault();

                  setPolicyPreviewContent({
                    content: partnerData?.privacyPolicy,
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
        <FormControl className="submit">
          <Button
            className="submit-button"
            color="primary"
            disabled={ confirmationLoading }
            onClick={ (event): void => {
              if (isInvalidDate) {
                event.preventDefault();

                updateActiveStep(1);
              }
            } }
            size="large"
            type="submit"
            variant="contained"
          >
            { confirmationLoading
              ? <CircularProgress size={ 26 } />
              : isInvalidDate ? t('onboarding.partner_policy.correct_data') : t('common.proceed') }
          </Button>
        </FormControl>
      </form>
      <PolicyPreviewDialog
        content={ policyPreviewContent?.content }
        isOpened={ policePreviewDialogOpened }
        onClose={ (): void => { setPolicyPreviewDialogOpened(false); } }
        title={ policyPreviewContent?.title }
      />
    </div>
  );
};

export default PartnerPolicyPage;
