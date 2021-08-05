import { useTheme } from '@material-ui/core';
import React from 'react';
import { getI18n } from 'react-i18next';
import Slider, { Settings } from 'react-slick';

import Content from './components/Content';
import styles from './styles';
import { FORMATS } from '@/constants';

const sliderSettings: Settings = {
  arrows: false,
  autoplay: true,
  autoplaySpeed: 5000,
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  fade: true,
  customPaging: () => (
    <div className="custom-dot" />
  )
};

const LeftColumn = (): JSX.Element => {
  const classes = styles();
  const theme = useTheme();
  const i18nInstance = getI18n();

  return (
    <div className={ classes.root }>
      {
        theme.custom.login_slider && (
          <Slider { ...sliderSettings }>
            { theme.custom.login_slider.map((slide, index) => (
              <Content
                key={ index }
                description={ slide[i18nInstance.languages[0].split('-')[0] as keyof typeof FORMATS.DATE].description }
                img={ slide[i18nInstance.languages[0].split('-')[0] as keyof typeof FORMATS.DATE].icon }
                title={ slide[i18nInstance.languages[0].split('-')[0] as keyof typeof FORMATS.DATE].title }
              />
            )) }
          </Slider>
        )
      }
    </div>
  );
};

export default LeftColumn;
