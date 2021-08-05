import classNames from 'classnames';
import React, { useState } from 'react';

import DetailsView from './components/DetailsView';
import ListView from './components/ListView';
import styles from './styles';
import { Subscription } from '@/interfaces';

const Income = (): JSX.Element => {
  const classes = styles();

  const [selectedSubscription, setSelectedSubscription] = useState<Subscription>();

  return (
    <div className={ `${classes.root} dashboard-view-element-root` }>
      <ListView
        className={ classNames({
          [classes.hidden]: !!selectedSubscription
        }) }
        onSelect={ (subscription): void => { setSelectedSubscription(subscription); } }
      />
      { selectedSubscription && (
        <DetailsView
          onBack={ (): void => { setSelectedSubscription(undefined); } }
          subscriptionId={ selectedSubscription.id }
        />
      ) }
    </div>
  );
};

export default Income;
