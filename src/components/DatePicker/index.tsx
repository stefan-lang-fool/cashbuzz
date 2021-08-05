import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import { MaterialUiPickersDate } from '@material-ui/pickers/typings/date';
import { format } from 'date-fns';
import deLocale from 'date-fns/locale/de';
import enLocale from 'date-fns/locale/en-US';
import React, { useState } from 'react';
import { getI18n } from 'react-i18next';

import { getCurrentDateFormat } from '@/utils/format';

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

interface Props {
  defaultDate: Date;
  minDate?: Date;
  errorMessage?: string;
  onChange?: (date: Date | null) => void;
  label?: string;
  inputVariant?: 'standard' | 'filled' | 'outlined' | undefined;
}

const DatePicker = ({
  defaultDate,
  minDate,
  errorMessage,
  onChange = (): void => {},
  label,
  inputVariant = 'outlined'
}: Props): JSX.Element => {
  const i18nInstance = getI18n();

  const [selectedDate, setSelectedDate] = useState<MaterialUiPickersDate>(defaultDate);
  const [dateFormat] = useState(getCurrentDateFormat());

  return (
    <MuiPickersUtilsProvider
      locale={ localeMap[(i18nInstance.languages[0].split('-')[0] as keyof typeof localeMap)] }
      utils={ localeUtilsMap[(i18nInstance.languages[0].split('-')[0] as keyof typeof localeUtilsMap)] }
    >
      <KeyboardDatePicker
        error={ !!errorMessage }
        format={ dateFormat }
        helperText={ errorMessage }
        inputVariant={ inputVariant }
        label={ label }
        minDate={ minDate }
        onChange={ (date): void => { setSelectedDate(date); onChange(date); } }
        placeholder={ dateFormat.toUpperCase() }
        value={ selectedDate }
        variant="inline"
      />
    </MuiPickersUtilsProvider>
  );
};

export default DatePicker;
