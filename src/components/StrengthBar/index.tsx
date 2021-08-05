import classNames from 'classnames';
import React from 'react';

import styles, { barData } from './styles';

interface Props {
  init: Array<barData>;
  score: number;
  showScore?: boolean;
}

const StrengthBar = ({ init, score, showScore = true }: Props): JSX.Element => {
  const classes = styles(init);

  return (
    <div className={ classNames({
      [classes.root]: true,
      'strength-bar': true,
      [`index-${score}`]: true,
      'show-score': showScore
    }) }
    >
      <div className="message">
        { init[score].message }
      </div>
      <div className={ `${classes.list}` }>
        { init.map((event, index) => (
          <div
            key={ index }
            className={ classNames({ bar: true, selected: index <= score }) }
          />
        )) }
      </div>
    </div>
  );
};

export default StrengthBar;
