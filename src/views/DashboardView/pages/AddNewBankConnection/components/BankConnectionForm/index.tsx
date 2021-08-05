import { useTheme } from '@material-ui/core';
import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';

import { useSelector } from 'react-redux';
import { loading, closeLoading } from '@/components/CustomLoader';
import { showNotification } from '@/components/Notification';
import { ImportBankConnectionResponseData } from '@/interfaces';
import { AppState } from '@/reducers';
import APIService from '@/services/APIService';
import { BankInterfaceOptionType } from '@/types';

interface Props {
  bankId: number;
  bankInterface?: BankInterfaceOptionType;
  connect?: boolean;
  update?: boolean;
  onComplete?: (message?: string) => void | Promise<void>;
}

const BankConnectionForm = ({
  bankId,
  bankInterface,
  connect = false,
  onComplete = (): void => {},
  update = false
}: Props): JSX.Element => {
  const theme = useTheme();
  const { t } = useTranslation();

  const user = useSelector((state: AppState) => state.auth.user);

  const [finAPIConfig, setFinAPIConfig] = useState<ImportBankConnectionResponseData>();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  const finApiConfigRef = useRef<ImportBankConnectionResponseData>();
  const finAPIScriptRef = useRef<HTMLScriptElement>();
  const finAPICssRef = useRef<HTMLScriptElement>();
  const loadingIdRef = useRef<null|number>(null);

  const checkStatus = useCallback(async () => {
    if (finApiConfigRef.current) {
      const { data: checkStatusData } = await APIService.bankConnections.checkConnectionStatus(finApiConfigRef.current.id);

      const responseBody = JSON.parse(checkStatusData.serviceResponseBody);
      if (responseBody.errors && responseBody.errors[0]) {
        onComplete(responseBody.errors[0].message);
      } else {
        onComplete();
      }
    } else {
      onComplete();
    }
  }, [onComplete]);

  useEffect(() => {
    const getFinAPIConfig = async (): Promise<void> => {
      try {
        if (update && bankInterface) {
          const { data } = await APIService.bankConnections.updateBankConnection(bankId, bankInterface);
          finApiConfigRef.current = data;
          setFinAPIConfig(data);
        } else if (connect && bankInterface) {
          const { data } = await APIService.bankConnections.connectInterface(bankId, bankInterface);
          finApiConfigRef.current = data;
          setFinAPIConfig(data);
        } else {
          const { data } = await APIService.bankConnections.importBankConnection(bankId, bankInterface);
          finApiConfigRef.current = data;
          setFinAPIConfig(data);
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 423) {
            showNotification({ content: t('update_bank_connection.423_error'), type: 'error' });
          } else {
            showNotification({ content: t('add_new_bank_connection.connection_failure'), type: 'error' });
          }
        } else {
          showNotification({ content: t('common.internal_error'), type: 'error' });
        }
      } finally {
        setIsLoading(false);
      }
    };

    const statusInterval = setInterval(() => {
      const inputValue = (document.getElementById('web-form-status') as HTMLInputElement)?.value;

      switch (inputValue) {
        case 'COMPLETED':
          checkStatus();
          clearInterval(statusInterval);
          break;
        default:
      }
    }, 1000);

    getFinAPIConfig();

    return (): void => {
      clearInterval(statusInterval);
    };
  }, [bankId, bankInterface, checkStatus, connect, t, update]);

  useEffect(() => {
    if (finAPIConfig && !finAPIConfig.uri && user) {
      APIService.user.triggerTransactionRefetch(user.id);
      showNotification({ content: t('update_bank_connection.up_to_date'), type: 'success' });
    }

    if (finAPIConfig) {
      const tempScript = document.createElement('script');
      const tempFinAPICss = document.createElement('script');

      tempScript.src = 'https://live.finapi.io/js/web-form/web-form-components.es5.js';
      tempScript.id = 'web-form-components-source';
      tempScript.async = true;

      tempFinAPICss.type = 'text/json';
      tempFinAPICss.id = 'external-web-form-css';
      tempFinAPICss.text = `{
        "webFormBtnSubmit": {
            "backgroundColor": "${theme.palette.primary.main}"
        }
      }`;

      document.body.appendChild(tempFinAPICss);
      document.body.appendChild(tempScript);

      finAPIScriptRef.current = tempScript;
      finAPICssRef.current = tempFinAPICss;

      setTimeout(() => {
        dispatchEvent(new Event('load'));
        setTimeout(() => {
          setIsLoaded(true);
        }, 500);
      }, 500);
    }

    return (): void => {
      if (finAPIScriptRef.current && document.body.querySelector('#web-form-components-source')) {
        document.body.removeChild(finAPIScriptRef.current);
      }

      if (finAPICssRef.current && document.body.querySelector('#external-web-form-css')) {
        document.body.removeChild(finAPICssRef.current);
      }
    };
  }, [finAPIConfig, t, theme.palette.primary.main, user]);

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
    <div style={ { alignSelf: 'center', display: 'flex', minWidth: '100%' } }>
      <input
        id="web-form-token"
        readOnly
        type="hidden"
        value={ finAPIConfig?.['web-form-token'] }
      />
      <input
        id="web-form-status"
        readOnly
        type="hidden"

      />
      <web-form-element
        callback-url={ finAPIConfig?.['callback-url'] }
        style={ { minWidth: '100%', display: `${isLoaded ? 'block' : 'none'}` } }
      />
    </div>
  );
};

export default BankConnectionForm;
