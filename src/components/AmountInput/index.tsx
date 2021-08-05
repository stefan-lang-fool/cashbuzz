import React from 'react';
import NumberFormat from 'react-number-format';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AmountInput(props: any): JSX.Element {
  const { inputRef, onChange, format, ...other } = props;

  return (
    <NumberFormat
      { ...other }
      allowLeadingZeros={ false }
      allowNegative={ false }
      decimalScale={ 2 }
      decimalSeparator={ format === 'de' ? ',' : '.' }
      fixedDecimalScale
      getInputRef={ inputRef }
      isNumericString
      onValueChange={ (values): void => {
        onChange({
          target: {
            name: props.name,
            value: values.value
          }
        });
      } }
      prefix={ format !== 'de' ? '€ ' : undefined }
      style={ { textAlign: 'right' } }
      suffix={ format === 'de' ? ' €' : undefined }
      thousandSeparator={ format === 'de' ? '.' : ',' }
    />
  );
}

export default AmountInput;
