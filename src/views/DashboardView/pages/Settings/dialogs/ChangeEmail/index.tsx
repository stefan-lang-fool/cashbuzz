import {
  Dialog,
  DialogContent,
  Step,
  StepLabel,
  Stepper
} from '@material-ui/core';
import React, { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';

import styles from './styles';
import { AuthAction } from '@/actions';
import StepOne from '@/components/ChangeEmail/Step1';
import StepTwo from '@/components/ChangeEmail/Step2';
import DialogTitle from '@/components/DialogTitle';

interface Props {
  isOpened: boolean;
  onClose?: () => void;
}

const ChangeEmailDialog = ({ isOpened, onClose = (): void => {} }: Props): JSX.Element => {
  const classes = styles();
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [activeStep, setActiveStep] = useState(0);
  const [email, setEmail] = useState('');

  const steps = useMemo(() => [t('change_email.first_step'), t('common.confirm')], [t]);

  const activeStepElement = useMemo(() => {
    switch (activeStep) {
      case 0:
        return <StepOne onSuccess={ (givenEmail): void => { setEmail(givenEmail); setActiveStep(activeStep + 1); } } />;
      case 1:
        return (
          <StepTwo
            email={ email }
            onSuccess={ (): void => {
              dispatch(AuthAction.logout());
            } }
          />
        );
      default:
        return <StepOne onSuccess={ (): void => { setActiveStep(activeStep + 1); } } />;
    }
  }, [activeStep, dispatch, email]);

  const onDialogClose = (): void => {
    onClose();
  };

  return (
    <Dialog
      className={ classes.root }
      disableBackdropClick
      onClose={ onDialogClose }
      onExited={ (): void => { setActiveStep(0); } }
      open={ isOpened }
      PaperProps={ {
        className: classes.paper
      } }

    >
      <DialogTitle
        onClose={ onDialogClose }
        title={ t('change_email.dialog_title') }
      />
      <DialogContent dividers>
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
      </DialogContent>
    </Dialog>
  );
};

export default ChangeEmailDialog;
