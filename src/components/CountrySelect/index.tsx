import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import React, { ChangeEvent, useMemo } from 'react';
import { useTranslation } from 'react-i18next';

import de from '@/data/countries/de.json';
import en from '@/data/countries/en.json';
import { setFieldAsRequired } from '@/utils/validationRules';

interface Props {
  disabled?: boolean;
  hasError?: boolean;
  helperText?: string | React.ReactElement;
  onChange: (option: string | null) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: any;
  value: string | null;
}

const CountrySelect = ({
  disabled = false,
  hasError = false,
  helperText,
  onChange,
  register = (): void => {},
  value
}: Props): JSX.Element => {
  const { t, i18n: i18nInstance } = useTranslation();

  const activeList = useMemo(() => {
    switch (i18nInstance.languages[0].split('-')[0]) {
      case 'de':
        return de;
      case 'en':
        return en;
      default:
        return en;
    }
  }, [i18nInstance.languages]);

  return (
    <div className="country-select">
      <Autocomplete
        disabled={ disabled }
        onChange={ (event: ChangeEvent<{}>, option: string | null): void => {
          onChange(option);
        } }
        options={ activeList.map((country) => country.name) }
        renderInput={ (params): JSX.Element => (
          <TextField
            { ...params }
            error={ hasError }
            helperText={ helperText }
            inputProps={ {
              ...params.inputProps,
              autoComplete: 'new-password'
            } }
            inputRef={ register({ required: setFieldAsRequired('general') }) }
            label={ t('edit_profile.address_country') }
            name="country"
            variant="outlined"
          />
        ) }
        value={ value }
      />
    </div>
  );
};

export default CountrySelect;
