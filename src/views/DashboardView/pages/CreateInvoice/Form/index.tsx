import {
  Button,
  Divider,
  Grid,
  TextField,
  Typography,
  FormControl
} from '@material-ui/core';
import CircularProgress from '@material-ui/core/CircularProgress';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { format, isAfter, isEqual } from 'date-fns';
import React, { useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

import styles from './styles';
import AmountInput from '@/components/AmountInput';
import CountrySelect from '@/components/CountrySelect';
import DatePicker from '@/components/DatePicker';
import { showNotification } from '@/components/Notification';
import de from '@/data/countries/de.json';
import en from '@/data/countries/en.json';
import { InvoiceRequestData, Organization } from '@/interfaces';
import APIService from '@/services/APIService';
import { getCurrentLanguage } from '@/utils/languages';
import { setFieldAsRequired } from '@/utils/validationRules';

export type InvoiceFormData = {
  invoiceDate: string;
  invoiceNumber: string;
  dueDate: string;
  amount: number;
  name: string;
  customerNumber: string;
  streetAddress: string;
  country: string;
  codeAndCity: string;
};

interface Props {
  goBack: () => void;
  onNewInvoiceCreated: () => void;
}

const Form = ({ goBack, onNewInvoiceCreated }: Props): JSX.Element => {
  const { t } = useTranslation();
  const classes = styles();
  const [selectedCountry, setSelectedCountry] = useState<null | string>(getCurrentLanguage() === 'en' ? 'Germany' : 'Deutschland');
  const [amount, setAmount] = useState<number>();
  const [isLoading, setIsLoading] = useState(false);
  const [options, setOptions] = useState<Organization[]>([]);
  const [currentOrganization, setCurrentOrganization] = useState<Organization>();

  const { getValues, register, handleSubmit, errors, setValue, triggerValidation, control, formState } = useForm<InvoiceFormData>({
    reValidateMode: 'onBlur',
    defaultValues: {
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      invoiceDate: format(new Date(), 'yyyy-MM-dd')
    }
  });

  const formatAddress = useCallback((data: InvoiceFormData): string | undefined => {
    let value;

    if (data.streetAddress) {
      value = data.streetAddress;
    }

    if (data.codeAndCity) {
      if (value) {
        value += `, ${data.codeAndCity}`;
      } else {
        value = data.codeAndCity;
      }
    }

    if (data.country) {
      let countryTranslation = data.country;

      if (getCurrentLanguage() === 'de') {
        const deId = de.find((country) => country.name === data.country)?.id;

        if (deId) {
          const enName = en.find(({ id }) => id === deId)?.name;
          countryTranslation = enName || data.country;
        }
      }

      if (value) {
        value += `, ${countryTranslation}`;
      } else {
        value = countryTranslation;
      }
    }

    return value;
  }, []);

  const setAddressFields = useCallback((address: string): void => {
    const splitAddress = address.split(',');
    if (!splitAddress.length) {
      return;
    }

    const country = splitAddress.slice(-1).pop();
    if (country) {
      if (getCurrentLanguage() === 'en') {
        setSelectedCountry(country.trim() || null);
      } else {
        const enId = en.find((value) => value.name === country.trim())?.id;

        if (enId) {
          const deName = de.find(({ id }) => id === enId)?.name;
          setSelectedCountry(deName || null);
        }
      }
    }

    const codeAndCity = splitAddress.slice(-2, -1).pop();
    if (codeAndCity) {
      setValue('codeAndCity', codeAndCity.trim());
    }

    const streetAddress = splitAddress.slice(-3, -2).pop();
    if (streetAddress) {
      setValue('streetAddress', streetAddress.trim());
    }
  }, [setValue]);

  const onSubmit = useCallback(async (data: InvoiceFormData): Promise<void> => {
    setIsLoading(true);

    let requestData: InvoiceRequestData = {
      invoice_date: format(new Date(data.invoiceDate), 'yyyy-MM-dd'),
      gross_amount: amount || 0,
      invoice_ident: data.invoiceNumber,
      due_date: format(new Date(data.dueDate), 'yyyy-MM-dd'),
      customer_ident: data.customerNumber
    };

    // User creates new organization that does not exist in database
    if (!currentOrganization) {
      requestData = { ...requestData, custom_org_name: data.name };
    } else if (currentOrganization?.name !== data.name) {
      requestData = { ...requestData, custom_org_name: data.name };
    } else if (currentOrganization) {
      requestData = { ...requestData, org_id: currentOrganization.id };
    }

    // User provides custom address for organization
    const addressFromForm = formatAddress(data);
    if (!currentOrganization || !currentOrganization.address) {
      if (addressFromForm) {
        try {
          const { data: addressData } = await APIService.addresses.getAddress(addressFromForm);

          if (addressData.address !== addressFromForm) {
            showNotification({ content: t('invoices.type_error'), type: 'warning' });
            setAddressFields(addressData.address);
            setIsLoading(false);
            return;
          }

          requestData = { ...requestData, custom_address: addressData };
        } catch {
          showNotification({ content: t('invoices.invalid_address'), type: 'error' });
          setIsLoading(false);
          return;
        }
      }
    } else if (addressFromForm) {
      if (addressFromForm !== currentOrganization.address.address) {
        try {
          const { data: addressData } = await APIService.addresses.getAddress(addressFromForm);

          if (addressData.address !== addressFromForm) {
            showNotification({ content: t('invoices.type_error'), type: 'warning' });
            setAddressFields(addressData.address);
            setIsLoading(false);
            return;
          }

          requestData = { ...requestData, custom_address: addressData };
        } catch {
          showNotification({ content: t('invoices.invalid_address'), type: 'error' });
          setIsLoading(false);
          return;
        }
      }
    }

    try {
      await APIService.invoices.create(requestData);

      onNewInvoiceCreated();
    } catch {
      showNotification({ content: t('common.internal_error'), type: 'error' });
    } finally {
      setIsLoading(false);
    }
  }, [amount, currentOrganization, formatAddress, onNewInvoiceCreated, setAddressFields, t]);

  useEffect(() => {
    register(
      { name: 'name', type: 'text' },
      { required: setFieldAsRequired('general') }
    );
    register(
      { name: 'invoiceDate', type: 'text' }
    );
    register(
      { name: 'dueDate', type: 'text' },
      {
        validate: {
          after: (value): boolean | string => (
            isAfter(new Date(value), new Date(getValues('invoiceDate')))
            || isEqual(new Date(value), new Date(getValues('invoiceDate')))
          ) || t('invoices.due_date_error').toString()
        }
      }
    );
    register(
      { name: 'country', type: 'text' }
    );
  }, [getValues, register, t]);

  useEffect(() => {
    setValue('name', currentOrganization?.name || '');

    if (formState.isSubmitted) {
      triggerValidation('name');
    }
  }, [currentOrganization, formState.isSubmitted, setValue, triggerValidation]);

  return (
    <div className={ classes.root }>
      <Typography
        className={ classes.sectionTitle }
        variant="h4"
      >
        { t('invoices.form.add_new_invoice') }
      </Typography>
      <p className={ classes.sectionRemark }>{ t('invoices.form.invoice_section_remarks') }</p>
      <form onSubmit={ handleSubmit(onSubmit) }>
        <Grid
          className="invoice-form-row"
          container
          spacing={ 3 }
          style={ { paddingBottom: 20 } }
        >
          <Grid
            item
            xs={ 4 }
          >
            <TextField
              error={ !!errors.invoiceNumber }
              helperText={ errors.invoiceNumber?.message }
              inputRef={ register({ required: setFieldAsRequired('general') }) }
              label={ t('invoices.form.fields.invoice_number') }
              name="invoiceNumber"
              variant="outlined"
            />
          </Grid>
          <Grid
            item
            xs={ 4 }
          >
            <TextField
              error={ !!errors.amount }
              helperText={ errors.amount?.message }
              inputProps={ {
                format: getCurrentLanguage()
              } }
              // eslint-disable-next-line react/jsx-no-duplicate-props
              InputProps={ {
                inputComponent: AmountInput
              } }
              inputRef={ register({
                required: setFieldAsRequired('general'),
                validate: {
                  positive: (): boolean | string => {
                    const value = amount;
                    return (value && Number(value) < 0 ? 'Amount must be greater than zero.' : true);
                  }
                }
              }) }
              label={ t('invoices.form.fields.amount') }
              name="amount"
              onChange={ (event): void => {
                setAmount(+event.target.value);
              } }
              value={ amount }
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Grid
          className="invoice-form-row"
          container
          spacing={ 3 }
        >
          <Grid
            item
            xs={ 4 }
          >
            <DatePicker
              defaultDate={ new Date() }
              label={ t('invoices.form.fields.invoice_date') }
              onChange={ (date): void => {
                setValue('invoiceDate', date ? date.toString() : '');
              } }
            />
          </Grid>
          <Grid
            item
            xs={ 4 }
          >
            <DatePicker
              defaultDate={ new Date() }
              errorMessage={ errors.dueDate?.message?.toString() }
              label={ t('invoices.form.fields.due_date') }
              onChange={ (date): void => {
                setValue('dueDate', date ? date.toString() : '');
                triggerValidation('dueDate');
              } }
            />
          </Grid>
        </Grid>
        <Divider style={ { margin: '20px 0' } } />
        <Typography
          className={ classes.sectionTitle }
          variant="h4"
        >
          { t('invoices.form.customer_section') }
        </Typography>
        <p className={ classes.sectionRemark }>{ t('invoices.form.customer_section_remarks') }</p>
        <Grid
          className="invoice-form-row"
          container
          spacing={ 3 }
          style={ { paddingBottom: 20 } }
        >
          <Grid
            item
            xs={ 4 }
          >
            <Autocomplete
              freeSolo
              getOptionLabel={ (option): string => option.name }
              onChange={ async (event: unknown, newValue: Organization | null, reason: string): Promise<void> => {
                if (reason === 'clear') {
                  setOptions([]);
                  return;
                }

                if (reason === 'select-option' && newValue) {
                  const { data } = await APIService.description.getOrganization(newValue.id);

                  setCurrentOrganization(data);

                  if (data && data.address && data.address.address) {
                    setAddressFields(data.address.address);
                  }
                }
              } }
              options={ options }
              renderInput={ (params): JSX.Element => (
                <TextField
                  { ...params }
                  error={ !!errors.name }
                  helperText={ errors.name?.message }
                  InputProps={ { ...params.InputProps } }
                  label={ t('invoices.form.fields.name') }
                  name="name"
                  onChange={ async (event): Promise<void> => {
                    if (event.target.value.length > 3) {
                      const { data } = await APIService.organizations.getByName(event.target.value);

                      setOptions(data);
                    }
                  } }
                  variant="outlined"
                />
              ) }
              value={ currentOrganization }
            />
          </Grid>
          <Grid
            item
            xs={ 4 }
          >
            <TextField
              error={ !!errors.customerNumber }
              helperText={ errors.customerNumber?.message }
              inputRef={ register({ required: setFieldAsRequired('general') }) }
              label={ t('invoices.form.fields.customer_number') }
              name="customerNumber"
              variant="outlined"
            />
          </Grid>
        </Grid>
        <Grid
          className="invoice-form-row"
          container
          spacing={ 3 }
          style={ { paddingBottom: 20 } }
        >
          <Grid
            item
            xs={ 4 }
          >
            <Controller
              as={ (
                <TextField
                  label={ t('invoices.form.fields.street_address') }
                  variant="outlined"
                />
              ) }
              control={ control }
              defaultValue=""
              name="streetAddress"
            />
          </Grid>
          <Grid
            item
            xs={ 4 }
          >
            <Controller
              as={ (
                <TextField
                  label={ t('invoices.form.fields.code_city') }
                  variant="outlined"
                />
              ) }
              control={ control }
              defaultValue=""
              name="codeAndCity"
            />
          </Grid>
          <Grid
            item
            xs={ 4 }
          >
            <CountrySelect
              hasError={ !!errors.country }
              helperText={ errors.country?.message }
              onChange={ (option): void => { setSelectedCountry(option); } }
              register={ register }
              value={ selectedCountry }
            />
          </Grid>
        </Grid>
        <Button
          color="secondary"
          onClick={ goBack }
          size="large"
          style={ { marginTop: 24 } }
          variant="contained"
        >
          { t('invoices.form.go_back') }
        </Button>
        <FormControl className="submit">
          <Button
            color="primary"
            disabled={ isLoading }
            size="large"
            style={ { marginTop: 24, marginLeft: 24 } }
            type="submit"
            variant="contained"
          >
            { isLoading ? <CircularProgress size={ 26 } /> : t('invoices.form.save') }
          </Button>
        </FormControl>
      </form>
    </div>
  );
};

export default Form;
