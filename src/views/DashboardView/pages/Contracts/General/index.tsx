import classNames from 'classnames';
import React, { useState } from 'react';

import DetailsView from './components/DetailsView';
import ListView from './components/ListView';
import styles from './styles';
import { Contract } from '@/interfaces';

const Contracts = (): JSX.Element => {
  const classes = styles();

  const [selectedContract, setSelectedContract] = useState<Contract>();

  return (
    <div className={ `${classes.root} dashboard-view-element-root` }>
      <ListView
        className={ classNames({
          [classes.hidden]: !!selectedContract
        }) }
        onSelect={ (contract): void => { setSelectedContract(contract); } }
      />
      { selectedContract && (
        <DetailsView
          contractId={ selectedContract.id }
          onBack={ (): void => { setSelectedContract(undefined); } }
        />
      ) }
    </div>
  );
};

export default Contracts;
