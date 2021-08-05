import {
  Button,
  CircularProgress,
  Typography
} from '@material-ui/core';
import classNames from 'classnames';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';

import { useHistory } from 'react-router';
import styles from './styles';
import { ICONS } from '@/assets';
import { ROUTES, STATUSES } from '@/constants';
import APIService from '@/services/APIService';
import { ConsumerType } from '@/types';
import { usePartnerId } from '@/utils/partnerId';
import { bankConnection, guidedTour } from '@/utils/trackingEvents';

type StatusType = 'loading' | 'error' | 'success';

interface Props {
  consumerType?: ConsumerType;
  initMessage?: string;
  isGuided?: boolean;
}

const BankCategorizationStep = ({ consumerType, initMessage, isGuided = false }: Props): JSX.Element => {
  const classes = styles();
  const partnerId = usePartnerId();
  const history = useHistory();
  const { t } = useTranslation();

  const [message, setMessage] = useState<string | undefined>(initMessage);
  const [status, setStatus] = useState<StatusType>(initMessage ? 'error' : 'loading');

  const lastMaxStatus = useRef(0);

  const menuLabel = useMemo(() => {
    switch (consumerType) {
      case 'trader':
        return 'trader-connection';
      case 'sme':
        return 'sme-connection';
      case 'general':
      default:
        return 'general-connection';
    }
  }, [consumerType]);

  const categorizationInterval = useCallback(async () => {
    const { data } = await APIService.account.getAll();

    const accountsStatuses = Array.from(new Set(
      data.accounts
        .filter((singleAccount) => singleAccount.status !== STATUSES.FIN_API_STATUSES.downloadFailed)
        .map((singleAccount) => singleAccount.categorization_status)
    ));

    if (accountsStatuses.length) {
      const maxStatus = Math.max(...accountsStatuses);

      setMessage(t(`add_new_bank_connection.${isGuided ? 'categorization_status_guided_tour' : 'categorization_status'}.${maxStatus}`));

      if (menuLabel) {
        switch (maxStatus) {
          case 3:
            if (lastMaxStatus.current === 3) {
              return;
            }

            if (isGuided) {
              guidedTour.sendBankConnectionOpenedEvent(partnerId);
            } else {
              bankConnection.sendBankConnectionOpenedEvent(partnerId, menuLabel);
            }

            lastMaxStatus.current = 3;
            break;
          case 2:
            if (lastMaxStatus.current === 2) {
              return;
            }

            if (isGuided) {
              guidedTour.sendBankConnectionDataRetrievedEvent(partnerId);
            } else {
              bankConnection.sendBankConnectionDataRetrievedEvent(partnerId, menuLabel);
            }

            lastMaxStatus.current = 2;
            break;
          case 1:
            if (lastMaxStatus.current === 1) {
              return;
            }

            if (isGuided) {
              guidedTour.sendBankConnectionDataAnalyzedEvent(partnerId);
            } else {
              bankConnection.sendBankConnectionDataAnalyzedEvent(partnerId, menuLabel);
            }

            lastMaxStatus.current = 1;
            break;
          case 0:
            if (lastMaxStatus.current === 0) {
              return;
            }

            if (isGuided) {
              guidedTour.sendBankConnectionDataPreparedEvent(partnerId);
            } else {
              bankConnection.sendBankConnectionDataPreparedEvent(partnerId, menuLabel);
            }

            lastMaxStatus.current = 0;
            setStatus('success');
            break;
          default:
        }
      }
    }
  }, [isGuided, menuLabel, partnerId, t]);

  const icon = useMemo(() => {
    switch (status) {
      case 'error':
        return <SVG src={ ICONS.ALERT_CIRCLE } />;
      case 'loading':
        return <CircularProgress size={ 100 } />;
      case 'success':
        return <SVG src={ ICONS.CHECKBOX_MARKED_CIRCLE } />;
      default:
        return null;
    }
  }, [status]);

  const showButton = useMemo(() => {
    if (isGuided) {
      if (status === 'error' || status === 'success') {
        return true;
      }
    }

    if (status === 'error') {
      return true;
    }

    return false;
  }, [isGuided, status]);

  useEffect(() => {
    if (!initMessage) {
      const myInterval = setInterval(() => {
        categorizationInterval();
      }, 5000);

      categorizationInterval();

      return (): void => {
        clearInterval(myInterval);
      };
    }

    return (): void => {};
  }, [categorizationInterval, initMessage]);

  return (
    <div className={ classes.root }>
      <div className={ classNames({
        [classes.icon]: true,
        [status]: true
      }) }
      >
        { icon }
      </div>
      <Typography
        align="center"
        className={ classes.message }
      >
        { message }
      </Typography>
      {
        showButton && (
          <Button
            className={ classes.button }
            color="primary"
            onClick={ (): void => {
              history.push(ROUTES.AUTHORIZED.DASHBOARD);
            } }
            size="large"
            variant="contained"
          >
            { t('common.continue') }
          </Button>
        )
      }
    </div>
  );
};

export default BankCategorizationStep;
