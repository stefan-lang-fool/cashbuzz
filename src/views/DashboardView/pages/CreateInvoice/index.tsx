import React from 'react';
import { useHistory } from 'react-router';

import Form from './Form';
import styles from './styles';
import { ROUTES } from '@/constants';

const CreateInvoice = (): JSX.Element => {
  const classes = styles();
  const history = useHistory();

  return (
    <div className={ `${classes.root} dashboard-view-element-root` }>
      <Form
        goBack={ (): void => {
          history.push(ROUTES.AUTHORIZED.INVOICES);
        } }
        onNewInvoiceCreated={ (): void => {
          history.push(ROUTES.AUTHORIZED.INVOICES);
        } }
      />
    </div>
  );
};

export default CreateInvoice;
