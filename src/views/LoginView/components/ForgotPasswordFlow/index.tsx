import {
  Link,
  Stepper,
  Step,
  StepLabel
} from '@material-ui/core';
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './styles';
import StepOne from '@/components/ForgotPassword/Step1';
import StepTwo from '@/components/ForgotPassword/Step2';
import StepThree from '@/components/ForgotPassword/Step3';

interface Props {
  onAbort?: () => void;
  onFinish?: () => void;
}

const ForgotPasswordFlow = ({ onAbort = (): void => {}, onFinish = (): void => {} }: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = styles();
  const [activeStep, setActiveStep] = useState(0);
  const [code, setCode] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const steps = useMemo(() => [t('forgot_password.first_step'), t('forgot_password.second_step'), t('forgot_password.third_step')], [t]);

  const activeStepElement = useMemo(() => {
    switch (activeStep) {
      case 0:
        return <StepOne onSuccess={ (givenEmail): void => { setEmail(givenEmail); setActiveStep(activeStep + 1); } } />;
      case 1:
        window.onbeforeunload = (): string => '';
        return <StepTwo onSuccess={ (givenCode): void => { setCode(givenCode); setActiveStep(activeStep + 1); } } />;
      case 2:
        return (
          <StepThree
            code={ code }
            email={ email }
            onSuccess={ (): void => {
              window.onbeforeunload = null;
              onFinish();
            } }
          />
        );
      default:
        return <StepOne onSuccess={ (): void => { setActiveStep(activeStep + 1); } } />;
    }
  }, [activeStep, code, email, onFinish]);

  return (
    <div className={ classes.root }>
      <Stepper
        activeStep={ activeStep }
        alternativeLabel
        className={ classes.stepper }
      >
        { steps.map((label) => (
          <Step key={ label }>
            <StepLabel>{ label }</StepLabel>
          </Step>
        )) }
      </Stepper>
      { activeStepElement }
      <Link
        className="return-link"
        onClick={ (): void => { onAbort(); } }
      >
        { t('common.return_to', [t('navigation.login')]) }
      </Link>
    </div>
  );
};

export default ForgotPasswordFlow;
