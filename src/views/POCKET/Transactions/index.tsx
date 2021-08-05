import classNames from 'classnames';
import React, { useState } from 'react';

import styles from './styles';
import DetailsView, { SelectedTransaction } from './views/Details';
import ListView from './views/List';

const TransactionsView = (): JSX.Element => {
  const classes = styles();

  const [listScrollPosition, setListScrollPosition] = useState(0);
  const [selectedTransaction, setSelectedTransaction] = useState<SelectedTransaction>();

  return (
    <div className={ classes.root }>
      <ListView
        className={ classNames({
          [classes.hidden]: !!selectedTransaction
        }) }
        hidden={ !!selectedTransaction }
        onSelect={ (transaction, organization): void => {
          const mainContent = document.getElementById('main-content');
          if (mainContent) {
            setListScrollPosition(mainContent.scrollTop);
            mainContent.scrollTop = 0;
          }

          setSelectedTransaction({
            transaction,
            organization
          });
        } }
      />
      {
        selectedTransaction && (
          <DetailsView
            onBack={ (): void => {
              setSelectedTransaction(undefined);

              setTimeout(() => {
                const mainContent = document.getElementById('main-content');
                if (mainContent) {
                  mainContent.scrollTop = listScrollPosition;
                }
              });
            } }
            transaction={ selectedTransaction }
          />
        )
      }
    </div>
  );
};

export default TransactionsView;
