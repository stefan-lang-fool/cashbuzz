import React from 'react';
import SVG from 'react-inlinesvg';

import styles from './styles';

interface Props {
  icon: string;
  text: string;
}

const MenuItem = ({ icon, text }: Props): JSX.Element => {
  const classes = styles();

  return (
    <div className={ classes.root }>
      <SVG
        className={ `${classes.root}-icon` }
        src={ icon }
      />
      <span className={ `${classes.root}-text` }>
        { text }
      </span>
    </div>
  );
};

export default MenuItem;
