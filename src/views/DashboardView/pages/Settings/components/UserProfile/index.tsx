/* eslint-disable @typescript-eslint/no-explicit-any */
import DateFnsUtils from '@date-io/date-fns';
import {
  Button,
  CircularProgress,
  FormControl,
  Grid,
  TextField,
  Typography
} from '@material-ui/core';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { format, isBefore } from 'date-fns';
import deLocale from 'date-fns/locale/de';
import enLocale from 'date-fns/locale/en-US';
import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useSelector, useDispatch } from 'react-redux';

import styles from './styles';
import { AuthAction } from '@/actions';
import CountrySelect from '@/components/CountrySelect';
import { showNotification } from '@/components/Notification';
import { EditUserProfileData } from '@/interfaces';
import { AppState } from '@/reducers';
import { mapGermanToEnglish } from '@/utils/countries';
import { dateRegex, getCurrentDateFormat } from '@/utils/format';
import { setFieldAsRequired } from '@/utils/validationRules';


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
  editByDefault?: boolean;
  onSuccess?: () => void | Promise<void>;
  showTitle?: boolean;
}

class DeLocalizedUtils extends DateFnsUtils {
  getDatePickerHeaderText(date: Date): string {
    return format(date, 'EEE MMM d', { locale: this.locale });
  }
}

const localeMap = {
  de: deLocale,
  en: enLocale
};

const localeUtilsMap = {
  de: DeLocalizedUtils,
  en: DateFnsUtils
};

const UserProfile = ({ editByDefault = false, onSuccess = (): void => {}, showTitle = true }: Props): JSX.Element => {
  const classes = styles();
  const dispatch = useDispatch();
  const { t, i18n: i18nInstance } = useTranslation();

  const user = useSelector((state: AppState) => state.auth.user);

  const {
    errors,
    register,
    setValue,
    handleSubmit,
    reset,
    triggerValidation,
    formState,
    unregister
  } = useForm<FormData>({
    defaultValues: {
      birthday: user?.birthday || ''
    }
  });

  const [birthDate, setBirthDate] = useState<MaterialUiPickersDate>(user?.birthday ? new Date(user?.birthday) : null);
  const [dateFormat, setDateFormat] = useState(getCurrentDateFormat());
  const [editMode, setEditMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [splittedAddress, setSplittedAddress] = useState<string[]>(user?.address?.split(';') || []);
  const [selectedCountry, setSelectedCountry] = useState<null | string>(
    splittedAddress[4]
      ? splittedAddress[4]
      : null
  );

  const isEditing = useMemo(() => editByDefault || editMode, [editMode, editByDefault]);

  const resetProfileForm = useCallback((endEditing = true, data: any = {}): void => {
    if (Object.keys(data).length) {
      const tempSplittedAddress = data.address.split(';');

      reset({
        firstName: data.firstname,
        lastName: data.lastname,
        city: tempSplittedAddress[3] || '',
        houseNumber: tempSplittedAddress[1] || '',
        street: tempSplittedAddress[0] || '',
        zipCode: tempSplittedAddress[2] || ''
      });
    } else {
      reset({
        firstName: user?.firstname,
        lastName: user?.lastname,
        city: splittedAddress[3] || '',
        houseNumber: splittedAddress[1] || '',
        street: splittedAddress[0] || '',
        zipCode: splittedAddress[2] || ''
      });
    }

    unregister('birthday');
    unregister('country');
    register(
      { name: 'birthday', type: 'text' },
      {
        validate: {
          required: (value): boolean | string => !!value || t('validation.required.general').toString(),
          pattern: (value): boolean | string => {
            try {
              return dateRegex.test(format(new Date(value), getCurrentDateFormat())) || t('validation.date.invalid_format').toString();
            } catch {
              return t('validation.date.invalid_format').toString();
            }
          },
          before: (value): boolean | string => isBefore(new Date(value), (new Date()).setHours(23, 59, 59, 999)) || t('validation.date.past_today').toString()
        }
      }
    );
    register(
      { name: 'country', type: 'text' },
      { required: setFieldAsRequired('general') }
    );

    if (Object.keys(data).length) {
      const tempSplittedAddress = data.address.split(';');

      setSelectedCountry(tempSplittedAddress[4] || null);
      setBirthDate(data.birthday ? new Date(data.birthday) : null);
    } else {
      setSelectedCountry(splittedAddress[4] || null);
      setBirthDate(user?.birthday ? new Date(user?.birthday) : null);
    }

    if (endEditing) {
      setEditMode(false);
    }
  }, [register, reset, splittedAddress, t, unregister, user]);

  const onSubmit = useCallback(async (data: FormData): Promise<void> => {
    setIsLoading(true);

    let tempCountry = data.country;

    if (i18nInstance.languages[0].split('-')[0] === 'de') {
      tempCountry = mapGermanToEnglish(data.country);
    }

    try {
      const requestData: EditUserProfileData = {
        address: [data.street, data.houseNumber.toUpperCase(), data.zipCode, data.city, tempCountry].join(';'),
        birthday: data.birthday ? format(new Date(data.birthday), 'yyyy-MM-dd') : undefined,
        firstname: data.firstName,
        lastname: data.lastName
      };

      await dispatch(AuthAction.changeUserData(requestData));
      await onSuccess();
      setSplittedAddress([data.street, data.houseNumber.toUpperCase(), data.zipCode, data.city, tempCountry]);
      setEditMode(false);
    } catch (error) {
      if (error.data) {
        showNotification({ content: error.message, type: error.type });
        setSplittedAddress(error.data.address?.split(';') || []);

        setTimeout(() => {
          resetProfileForm(false, error.data);
        }, 100);

        if (error.endEditing) {
          setEditMode(false);
        }
      } else {
        showNotification({ content: t('common.internal_error'), type: 'error' });
      }
    } finally {
      setIsLoading(false);
    }
  }, [dispatch, i18nInstance.languages, onSuccess, resetProfileForm, t]);

  useEffect(() => {
    register(
      { name: 'birthday', type: 'text' },
      {
        validate: {
          required: (value): boolean | string => !!value || t('validation.required.general').toString(),
          pattern: (value): boolean | string => {
            try {
              return dateRegex.test(format(new Date(value), getCurrentDateFormat())) || t('validation.date.invalid_format').toString();
            } catch {
              return t('validation.date.invalid_format').toString();
            }
          },
          before: (value): boolean | string => isBefore(new Date(value), (new Date()).setHours(23, 59, 59, 999)) || t('validation.date.past_today').toString()
        }
      }
    );

    register(
      { name: 'country', type: 'text' },
      { required: setFieldAsRequired('general') }
    );
  }, [register, t]);

  useEffect(() => {
    setValue('birthday', birthDate ? birthDate.toString() : '');

    if (formState.isSubmitted) {
      triggerValidation('birthday');
    }
  }, [birthDate, formState.isSubmitted, setValue, triggerValidation]);

  useEffect(() => {
    setValue('country', selectedCountry || '');
  }, [selectedCountry, setValue]);

  useEffect(() => {
    setDateFormat(getCurrentDateFormat());

    if (formState.isSubmitted) {
      setValue('birthday', birthDate ? birthDate.toString() : '');
      triggerValidation();
    }
  }, [birthDate, formState.isSubmitted, setValue, triggerValidation, user?.language]);

  return (
    <div className={ classes.root }>
      {
        showTitle && (
          <Typography
            className="section-title"
            variant="h4"
          >
            { t('settings.personal_data') }
          </Typography>
        )
      }
      <form
        className="profile-form"
        onSubmit={ handleSubmit(onSubmit) }
      >
        <Grid
          className="first-row user-profile-row"
          container
          spacing={ 3 }
        >
          <Grid
            item
            xs={ 4 }
          >
            <TextField
              defaultValue={ user?.firstname }
              error={ !!errors.firstName }
              helperText={ errors.firstName?.message }
              InputProps={ {
                readOnly: !isEditing
              } }
              inputRef={ register({ required: setFieldAsRequired('general') }) }
              label={ t('edit_profile.first_name') }
              name="firstName"
              variant="outlined"
            />
          </Grid>
          <Grid
            item
            xs={ 4 }
          >
            <TextField
              defaultValue={ user?.lastname }
              error={ !!errors.lastName }
              helperText={ errors.lastName?.message }
              InputProps={ {
                readOnly: !isEditing
              } }
              inputRef={ register({ required: setFieldAsRequired('general') }) }
              label={ t('edit_profile.last_name') }
              name="lastName"
              variant="outlined"
            />
          </Grid>
          <Grid
            item
            xs={ 4 }
          >
            <MuiPickersUtilsProvider
              locale={ localeMap[(i18nInstance.languages[0].split('-')[0] as keyof typeof localeMap)] }
              utils={ localeUtilsMap[(i18nInstance.languages[0].split('-')[0] as keyof typeof localeUtilsMap)] }
            >
              <KeyboardDatePicker
                disableFuture
                error={ !!errors.birthday }
                format={ dateFormat }
                helperText={ errors.birthday?.message }
                InputProps={ {
                  readOnly: !isEditing
                } }
                inputVariant="outlined"
                label={ t('edit_profile.birthday') }
                onChange={ (date): void => { setBirthDate(date); } }
                placeholder={ dateFormat.toUpperCase() }
                readOnly={ !isEditing }
                value={ birthDate }
                variant="inline"
              />
            </MuiPickersUtilsProvider>
          </Grid>
        </Grid>
        <Grid
          className="second-row user-profile-row"
          container
          spacing={ 3 }
        >
          <Grid
            item
            xs={ 4 }
          >
            <TextField
              defaultValue={ splittedAddress[0] }
              error={ !!errors.street }
              helperText={ errors.street?.message }
              InputProps={ {
                readOnly: !isEditing
              } }
              inputRef={ register({ required: setFieldAsRequired('general') }) }
              label={ t('edit_profile.address_street') }
              name="street"
              variant="outlined"
            />
          </Grid>
          <Grid
            item
            xs={ 3 }
          >
            <TextField
              defaultValue={ splittedAddress[1] }
              error={ !!errors.houseNumber }
              helperText={ errors.houseNumber?.message }
              InputProps={ {
                readOnly: !isEditing
              } }
              inputRef={ register({ required: setFieldAsRequired('general') }) }
              label={ t('edit_profile.address_house_number') }
              name="houseNumber"
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Grid
          className="third-row user-profile-row"
          container
          spacing={ 3 }
        >
          <Grid
            item
            xs={ 4 }
          >
            <TextField
              defaultValue={ splittedAddress[2] }
              error={ !!errors.zipCode }
              helperText={ errors.zipCode?.message }
              InputProps={ {
                readOnly: !isEditing
              } }
              inputRef={ register({ required: setFieldAsRequired('general') }) }
              label={ t('edit_profile.address_zip_code') }
              name="zipCode"
              variant="outlined"
            />
          </Grid>
          <Grid
            item
            xs={ 4 }
          >
            <TextField
              defaultValue={ splittedAddress[3] }
              error={ !!errors.city }
              helperText={ errors.city?.message }
              InputProps={ {
                readOnly: !isEditing
              } }
              inputRef={ register({ required: setFieldAsRequired('general') }) }
              label={ t('edit_profile.address_city') }
              name="city"
              variant="outlined"
            />
          </Grid>
          <Grid
            item
            xs={ 4 }
          >
            <CountrySelect
              disabled={ !isEditing }
              hasError={ !!errors.country }
              helperText={ errors.country?.message }
              onChange={ (option): void => { setSelectedCountry(option); } }
              register={ register }
              value={ selectedCountry }
            />
          </Grid>
        </Grid>
        <Grid
          className="action-buttons"
          container
          spacing={ 3 }
        >
          { isEditing
            ? (
              <>
                <FormControl>
                  <Button
                    onClick={ (): void => { resetProfileForm(); } }
                    size="large"
                    variant="contained"
                  >
                    { t('common.cancel') }
                  </Button>
                </FormControl>
                <FormControl className="submit">
                  <Button
                    className="submit-button"
                    color="primary"
                    disabled={ isLoading }
                    size="large"
                    type="submit"
                    variant="contained"
                  >
                    { isLoading ? <CircularProgress size={ 26 } /> : t('common.save') }
                  </Button>
                </FormControl>
              </>
            )

            : (
              <FormControl>
                <Button
                  color="primary"
                  onClick={ (): void => { setEditMode(true); } }
                  size="large"
                  variant="contained"
                >
                  { t('common.edit') }
                </Button>
              </FormControl>
            ) }
        </Grid>
      </form>
    </div>

  );
};

export default UserProfile;
