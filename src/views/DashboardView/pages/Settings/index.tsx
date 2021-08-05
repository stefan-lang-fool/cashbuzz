import {
  Button,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography
} from '@material-ui/core';
import React, { useCallback, useState, useEffect, ChangeEvent, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import UserProfile from './components/UserProfile';
import ChangeEmailDialog from './dialogs/ChangeEmail';
import ChangePasswordDialog from './dialogs/ChangePassword';
import UpdatePartnerDialog from './dialogs/UpdatePartner';
import styles from './styles';
import { AuthAction } from '@/actions';
import ConfirmationDialog from '@/components/ConfirmationDialog';
import { loading, closeLoading } from '@/components/CustomLoader';
import { showNotification } from '@/components/Notification';
import { HTTP_CODES } from '@/constants';
import { Partner } from '@/interfaces';
import { AppState } from '@/reducers';
import APIService from '@/services/APIService';
import { getName, to6391Format, to6393Format } from '@/utils/languages';

type FormData = {
  birthday: string;
  city: string;
  country: string;
  firstName: string;
  houseNumber: string;
  lastName: string;
  street: string;
  zipCode: string;
}

interface Props {
  showCashback?: boolean;
}

const Settings = ({ showCashback = false }: Props): JSX.Element => {
  const classes = styles();
  const dispatch = useDispatch();
  const { t, i18n: i18nInstance } = useTranslation();

  const user = useSelector((state: AppState) => state.auth.user);

  const [autoRedemptionStatus, setAutoRedemptionStatus] = useState(false);
  const [defaultLanguage] = useState(to6391Format(user?.language || ''));
  const [deleteAccountDialogOpened, setDeleteAccountDialogOpened] = useState(false);
  const [emailChangeDialogOpened, setEmailChangeDialogOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [passwordChangeDialogOpened, setPasswordChangeDialogOpened] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState<Partner>();
  const [updatePartnerDialogOpened, setUpdatePartnerDialogOpened] = useState(false);

  const autoRedeptionToSppAcceptedRef = useRef(false);
  const loadingIdRef = useRef<null | number>(null);

  const changeAutoRedemptionStatus = useCallback(async (newValue: boolean, withoutLoading = false): Promise<void> => {
    if (!autoRedeptionToSppAcceptedRef.current) {
      setUpdatePartnerDialogOpened(true);
      return;
    }

    if (!withoutLoading) {
      setIsLoading(true);
    }


    try {
      await APIService.partners.changeAutoRedemptionStatus(1, newValue);

      setAutoRedemptionStatus(newValue);
    } catch (error) {
      if (error.response.status === HTTP_CODES.SETTINGS.INVALID_BIRTH_DATE) {
        showNotification({ content: t('partners.incorrect_birthdate'), type: 'error' });
      } else {
        showNotification({ content: t('common.internal_error'), type: 'error' });
      }
    } finally {
      if (!withoutLoading) {
        setIsLoading(false);
      }
    }
  }, [t]);

  const changeNotificationEmailsStatus = useCallback(async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const newValue = event.target.checked;
    setIsLoading(true);

    try {
      await dispatch(AuthAction.changeNotificationEmailsStatus(newValue));
    } catch {
      showNotification({ content: t('common.internal_error'), type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, t]);

  const deleteUser = useCallback(async (): Promise<void> => {
    try {
      await APIService.user.deleteAccount();
      await dispatch(AuthAction.clear());

      window.location.reload();
      setDeleteAccountDialogOpened(false);
    } catch {
      showNotification({ content: t('common.internal_error'), type: 'error' });
    }
  }, [dispatch, t]);

  const onLanguageChange = useCallback(async (event: React.ChangeEvent<{
    name?: string | undefined; value: unknown;
  }>): Promise<void> => {
    setIsLoading(true);

    try {
      await dispatch(AuthAction.changeUserLanguage(to6393Format(event.target.value as string)?.toUpperCase()));
    } catch {
      showNotification({ content: t('common.internal_error'), type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, t]);

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      setIsLoading(true);

      try {
        const { data } = await APIService.partners.get(1);

        setSelectedPartner(data);
        autoRedeptionToSppAcceptedRef.current = data.tosStatus;
        setAutoRedemptionStatus(data.autoredemption);
      } catch {
        showNotification({ content: t('common.internal_error'), type: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    return (): void => {
      if (loadingIdRef.current) {
        closeLoading(loadingIdRef.current);
      }
    };
  }, [t]);

  useEffect(() => {
    if (isLoading) {
      loadingIdRef.current = loading({ elementSelector: 'main .dashboard-view-element-root' });
    } else {
      closeLoading(loadingIdRef.current);
      loadingIdRef.current = null;
    }
  }, [isLoading]);

  return (
    <div className={ `${classes.root} dashboard-view-element-root` }>
      <div className={ `${classes.root}-profile` }>
        <UserProfile />
      </div>
      <Divider style={ { marginTop: '40px' } } />
      <div className={ `${classes.root}-account` }>
        <Typography
          className="section-title"
          variant="h4"
        >
          { t('settings.account') }
        </Typography>
        <Grid
          alignItems="center"
          container
          spacing={ 4 }
        >
          <Grid
            className="responsive"
            item
            xs={ 6 }
          >
            <TextField
              defaultValue={ user?.email }
              InputProps={ {
                readOnly: true
              } }
              label={ t('auth.email') }
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <Button
              color="primary"
              onClick={ (): void => { setEmailChangeDialogOpened(true); } }
              size="large"
              variant="contained"
            >
              { t('common.change') }
            </Button>
            <ChangeEmailDialog
              isOpened={ emailChangeDialogOpened }
              onClose={ (): void => { setEmailChangeDialogOpened(false); } }
            />
          </Grid>
        </Grid>
        <Grid
          alignItems="center"
          container
          spacing={ 4 }
          wrap="nowrap"
        >
          <Grid
            className="responsive"
            item
            xs={ 6 }
          >
            <TextField
              defaultValue="password"
              InputProps={ {
                readOnly: true
              } }
              label={ t('auth.password') }
              type="password"
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <Button
              color="primary"
              onClick={ (): void => { setPasswordChangeDialogOpened(true); } }
              size="large"
              variant="contained"
            >
              { t('common.change') }
            </Button>
            <ChangePasswordDialog
              isOpened={ passwordChangeDialogOpened }
              onClose={ (): void => { setPasswordChangeDialogOpened(false); } }
            />
          </Grid>
        </Grid>
        { showCashback && (
          <Grid
            alignItems="center"
            className="auto-redemption"
            container
            spacing={ 4 }
            wrap="nowrap"
          >
            <Grid item>
              <Typography variant="subtitle1">
                { t('settings.cashbacks_auto_redemption') }
              </Typography>
            </Grid>
            <Grid item>
              <Switch
                checked={ autoRedemptionStatus }
                color="primary"
                onChange={ (event): void => { changeAutoRedemptionStatus(event.target.checked); } }
              />
            </Grid>
          </Grid>
        ) }
        <Grid
          alignItems="center"
          className="notification-emails"
          container
          spacing={ 4 }
          wrap="nowrap"
        >
          <Grid item>
            <Typography variant="subtitle1">
              { t('settings.email_notifications') }
            </Typography>
          </Grid>
          <Grid item>
            <Switch
              checked={ user?.send_reminders }
              color="primary"
              onChange={ changeNotificationEmailsStatus }
            />
          </Grid>
        </Grid>
        <Grid
          alignItems="center"
          className="language-select"
          container
          spacing={ 4 }
          wrap="nowrap"
        >
          <Grid item>
            <Typography variant="subtitle1">
              { t('common.language') }
            </Typography>
          </Grid>
          <Grid
            item
            xs={ 5 }
          >
            <FormControl
              className="language-selector-element"
              variant="outlined"
            >
              <InputLabel htmlFor="language-selector">{ t('common.language') }</InputLabel>
              <Select
                defaultValue={ defaultLanguage }
                inputProps={ {
                  id: 'language-selector'
                } }
                label={ t('common.language') }
                onChange={ onLanguageChange }
              >
                { Object.keys(i18nInstance.services.resourceStore.data).map((language) => (
                  <MenuItem
                    key={ language }
                    value={ language }
                  >
                    { t(`common.${getName(language)?.toLowerCase()}`) }
                  </MenuItem>
                )) }
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </div>
      <Divider style={ { marginTop: '40px' } } />
      <div className={ `${classes.root}-account` }>
        <Typography
          className="section-title"
          variant="h4"
        >
          { t('settings.delete_account') }
        </Typography>
        <Grid
          alignItems="center"
          container
          spacing={ 4 }
        >
          <Grid item>
            <Button
              color="secondary"
              onClick={ (): void => { setDeleteAccountDialogOpened(true); } }
              size="large"
              variant="contained"
            >
              { t('settings.delete_account') }
            </Button>
            <ConfirmationDialog
              isOpened={ deleteAccountDialogOpened }
              onCancel={ (): void => { setDeleteAccountDialogOpened(false); } }
              onOk={ deleteUser }
              question={ t('settings.delete_account_question') }
              title={ t('settings.delete_account') }
            />
          </Grid>
        </Grid>
      </div>
      <UpdatePartnerDialog
        isOpened={ updatePartnerDialogOpened }
        onClose={ (): void => { setUpdatePartnerDialogOpened(false); } }
        onSubmit={ async (): Promise<void> => {
          autoRedeptionToSppAcceptedRef.current = true;
          await changeAutoRedemptionStatus(true, true);
        } }
        partner={ selectedPartner }
      />
    </div>
  );
};

export default Settings;
