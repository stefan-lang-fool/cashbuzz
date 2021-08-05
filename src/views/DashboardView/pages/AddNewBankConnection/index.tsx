import {
  Step,
  StepLabel,
  Stepper,
  Typography
} from '@material-ui/core';
import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams, useLocation } from 'react-router';

import BankCategorizationStep from './components/BankCategorizationStep';
import BankConnectionForm from './components/BankConnectionForm';
import BankListTable from './components/BankListTable';
import styles from './styles';
import { loading, closeLoading } from '@/components/CustomLoader';
import { ROUTES, STATUSES } from '@/constants';
import APIService from '@/services/APIService';
import { BankInterfaceOptionType, ConsumerType } from '@/types';

interface Props {
  infoText: string;
  consumerType: ConsumerType;
}

const AddNewBankConnection = ({ infoText, consumerType }: Props): JSX.Element => {
  const classes = styles();
  const location = useLocation();
  const routeParams = useParams<{bankId?: string}>();
  const { t } = useTranslation();

  const [activeStep, setActiveStep] = useState(routeParams.bankId ? 1 : 0);
  const [initMessage, setInitMessage] = useState<string>();
  const [isLoading, setIsLoading] = useState(true);

  const loadingIdRef = useRef<null|number>(null);

  const steps = useMemo(() => [t('add_new_bank_connection.steps.first_step'), t('add_new_bank_connection.steps.second_step'), t('add_new_bank_connection.steps.third_step')], [t]);

  const queryInterface = useMemo(() => new URLSearchParams(location.search).get('selectedInterface'), [location.search]);

  const activeStepElement = useMemo(() => {
    switch (activeStep) {
      case 0:
        return (
          <BankListTable
            consumerType={ consumerType }
            onSelect={ (id, selectedInterface): void => {
              window.location.href = `${window.location.origin}${ROUTES.AUTHORIZED.ADD_BANK_CONNECTION}/${id}?${selectedInterface ? `selectedInterface=${selectedInterface}` : ''}`;
            } }
          />
        );
      case 1:
        return routeParams.bankId && (
          <BankConnectionForm
            bankId={ parseInt(routeParams.bankId, 10) }
            bankInterface={ queryInterface as BankInterfaceOptionType || undefined }
            onComplete={ (initMessageAttr): void => {
              if (initMessageAttr) {
                setInitMessage(t('add_new_bank_connection.fin_api_error', { message: initMessageAttr }));
              }
              setActiveStep(2);
            } }
          />
        );
      case 2:
        return (
          <BankCategorizationStep
            consumerType={ consumerType }
            initMessage={ initMessage }
          />
        );
      default:
        return <BankListTable consumerType={ consumerType } />;
    }
  }, [activeStep, consumerType, initMessage, queryInterface, routeParams.bankId, t]);

  useEffect(() => {
    (async (): Promise<void> => {
      const { data } = await APIService.account.getAll();

      const accountsStatuses = Array.from(new Set(
        data.accounts
          .filter((singleAccount) => singleAccount.status !== STATUSES.FIN_API_STATUSES.downloadFailed)
          .map((singleAccount) => singleAccount.categorization_status)
      ));

      if (accountsStatuses.length) {
        const maxStatus = Math.max(...accountsStatuses);

        if (maxStatus > 0) {
          setActiveStep(2);
        }
      }
      setIsLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (isLoading) {
      loadingIdRef.current = loading({ elementSelector: 'main .dashboard-view-element-root' });
    } else {
      closeLoading(loadingIdRef.current);
      loadingIdRef.current = null;
    }
  }, [isLoading]);

  useEffect(() => (): void => {
    if (loadingIdRef.current) {
      closeLoading(loadingIdRef.current);
    }
  }, []);

  return (
    <div className={ `${classes.root} dashboard-view-element-root` }>
      <div className={ `${classes.root}-header` }>
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
      </div>
      <div className={ `${classes.root}-content` }>
        <Typography
          className="helper-text"
          variant="subtitle1"
        >
          { infoText }
        </Typography>
        { activeStepElement }
      </div>
    </div>
  );
};

export default AddNewBankConnection;
