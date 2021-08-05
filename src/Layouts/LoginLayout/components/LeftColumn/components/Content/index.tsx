import React from 'react';
import SVG from 'react-inlinesvg';

import styles from './styles';

interface Props {
  description: string;
  img: string;
  title: string;
}

const LeftColumnContent = ({ description, img, title }: Props): JSX.Element => {
  const classes = styles();

  return (
    <div className={ classes.root }>
      <div className={ `${classes.root}-img-wrapper` }>
        {
          img.includes('<svg')
            ? (
              <SVG
                className={ `${classes.root}-img` }
                src={ img }
              />
            )
            : (
              <img
                alt="content"
                className={ `${classes.root}-img` }
                src={ img }
              />
            )
        }
      </div>
      <div className={ classes.content }>
        <p className={ `${classes.content}-title` }>{ title }</p>
        <p className={ `${classes.content}-description` }>{ description }</p>
      </div>
    </div>
  );
};

export default LeftColumnContent;
