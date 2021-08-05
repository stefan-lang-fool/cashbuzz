/* eslint-disable no-case-declarations */
import Link from '@material-ui/core/Link/Link';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import Typography from '@material-ui/core/Typography';
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router';

import PartnerPolicy from './components/PolicyStep';
import styles from './styles';
import { AuthAction } from '@/actions';
import { loading, closeLoading } from '@/components/CustomLoader';
import { showNotification } from '@/components/Notification';
import { ROUTES } from '@/constants';
import { AUTH_ACTIONS } from '@/constants/actions';
import { ONBOARDING as ONBOARDING_STATUS } from '@/constants/httpCodes';
import PolicyPreviewDialog from '@/dialogs/PolicyPreview';
import { Partner } from '@/interfaces';
import { AppState } from '@/reducers';
import APIService from '@/services/APIService';
import { getPartnerId } from '@/utils/partnerId';
import { guidedTour } from '@/utils/trackingEvents';
import UserProfile from '@/views/DashboardView/pages/Settings/components/UserProfile';
import LoginView from '@/views/LoginView';

const OnboardingView = (): JSX.Element => {
  const classes = styles();
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const authState = useSelector((state: AppState) => state.auth);
  const cashbuzzData = useSelector((state: AppState) => state.cashbuzz.data);

  const [activeStep, setActiveStep] = useState(0);
  const [accessibleStep, setAccessibleStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [partnerData, setPartnerData] = useState<Partner>();
  const [policePreviewDialogOpened, setPolicyPreviewDialogOpened] = useState(false);
  const [policyPreviewContent, setPolicyPreviewContent] = useState<{content?: string; title?: string}>();

  const activeStepRef = useRef(activeStep);
  const loadingId = useRef<null|number>(null);

  const stepClicked = (index: number): void => {
    if (index > accessibleStep) {
      return;
    }

    activeStepRef.current = index;
    setActiveStep(activeStepRef.current);
  };

  const steps = useMemo(() => [t('onboarding.steps.first_step'), t('onboarding.steps.second_step'), t('onboarding.steps.third_step')], [t]);

  const activeElement = useMemo(() => {
    switch (activeStep) {
      case 0:
        return (
          <LoginView
            onUserCreated={ (): void => {
              guidedTour.sendAccountCreatedEvent(getPartnerId());
              localStorage.setItem('guided-started', 'true');
            } }
            onUserValidated={ (): void => { guidedTour.sendAccountValidatedEvent(getPartnerId()); } }
            showImprint={ false }
            showMobileTeaser={ !authState.user }
          />
        );
      case 1:
        return (
          <div className="user-profile-wrapper">
            <Typography
              className="helper-text"
              variant="subtitle1"
            >
              { t('onboarding.personal_data.info') }
            </Typography>
            <UserProfile
              editByDefault
              onSuccess={ (): void => { guidedTour.sendDataEnteredEvent(getPartnerId()); } }
              showTitle={ false }
            />
          </div>
        );
      case 2:
        return (
          partnerData && (
            <PartnerPolicy
              data={ partnerData }
              isTospp={ partnerData.tosStatus }
              onSuccess={ async (): Promise<void> => {

              } }
              updateActiveStep={ (step): void => {
                activeStepRef.current = step;
                setActiveStep(activeStepRef.current);
              } }
            />
          )
        );
      default:
        return <div />;
    }
  }, [activeStep, authState.user, partnerData, t]);

  useEffect(() => {
    const checkOnboardingStatus = async (): Promise<void> => {
      setIsLoading(true);

      if (authState.addressFixed && activeStepRef.current === 1) {
        setIsLoading(false);
        dispatch(AuthAction.setAddressFixedStatus(false));
        return;
      }

      if (authState.refreshToken) {
        try {
          const { status } = await APIService.tokens.revoke(authState.refreshToken);

          switch (status) {
            case ONBOARDING_STATUS.KYC_REQUIRED:
              activeStepRef.current = 1;
              setActiveStep(activeStepRef.current);
              setAccessibleStep(activeStepRef.current);
              break;
            case ONBOARDING_STATUS.NOT_VALIDATED_EMAIL:
              if (!authState.loggedWithInvalidatedEmail) {
                dispatch({
                  type: AUTH_ACTIONS.SET_EMAIL_VALIDATION_STATUS,
                  data: true
                });
              }

              break;
            case ONBOARDING_STATUS.REQUIRE_TOS_ACCEPTANCE:
              if (!authState.requiredTosAcceptance) {
                dispatch({
                  type: AUTH_ACTIONS.SET_TOS_ACCEPTANCE_REQUIRED_STATUS,
                  data: true
                });
              }

              break;
            default:
              const { data } = await APIService.partners.get(1);
              setPartnerData(data);

              if (!data.tosStatus) {
                activeStepRef.current = 2;
                setActiveStep(activeStepRef.current);
                setAccessibleStep(activeStepRef.current);
              } else {
                localStorage.removeItem('guided-started');
                history.replace(ROUTES.AUTHORIZED.DASHBOARD);
              }

              break;
          }
        } catch {
          showNotification({ content: t('common.internal_error'), type: 'error' });
        } finally {
          setIsLoading(false);
        }
      } else {
        guidedTour.sendUserLandedEvent(getPartnerId());
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [authState.user, authState.loggedWithInvalidatedEmail, dispatch, history, t]);

  useEffect(() => {
    if (isLoading) {
      loadingId.current = loading();
    } else {
      closeLoading(loadingId.current);
      loadingId.current = null;
    }
  }, [isLoading]);

  useEffect(() => (): void => {
    if (loadingId.current) {
      closeLoading(loadingId.current);
    }
  }, []);

  return (
    <div className={ classes.root }>
      <div className={ `${classes.root}-header` }>
        <Stepper
          activeStep={ activeStep }
          alternativeLabel
          className={ classes.stepper }
        >
          { steps.map((label, index) => (
            <Step
              key={ label }
              onClick={ (): void => { stepClicked(index); } }
            >
              <StepLabel style={ { cursor: index <= accessibleStep ? 'pointer' : 'default' } }>{ label }</StepLabel>
            </Step>
          )) }
        </Stepper>
      </div>
      <div className={ `${classes.root}-content` }>
        { !isLoading && activeElement }
      </div>
      <div className={ `${classes.root}-footer` }>
        <Link onClick={ (): void => {
          setPolicyPreviewContent({ content: cashbuzzData?.impressum, title: t('menu.imprint') });
          setPolicyPreviewDialogOpened(true);
        } }
        >
          { t('menu.imprint') }
        </Link>
      </div>
      <PolicyPreviewDialog
        content={ policyPreviewContent?.content }
        isOpened={ policePreviewDialogOpened }
        onClose={ (): void => { setPolicyPreviewDialogOpened(false); } }
        title={ policyPreviewContent?.title }
      />
    </div>
  );
};

export default OnboardingView;
