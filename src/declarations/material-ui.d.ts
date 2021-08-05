import { ThemeOptions, Theme } from '@material-ui/core/styles/createMuiTheme';
import { MenuLabelsType } from '@/types';

interface Slide {
  en: {
    description: string;
    icon: string;
    title: string;
  };
  de: {
    description: string;
    icon: string;
    title: string;
  };
}
declare module '@material-ui/core/styles/createMuiTheme' {
  interface ThemeOptions {
    custom?: {
      affinities_classes?: string[];
      colors?: {
        accent?: string;
        background?: string;
        bodyText?: string;
        error?: string;
        headings?: string;
        inactiveText?: string;
        neutral?: string;
        primary?: string;
        success?: string;
      };
      fontFamily?: string;
      login_slider?: Array<Slide>;
      logo?: string;
      menu?: Array<MenuLabelsType>;
      securities?: boolean;
      show_category_path?: boolean;
      show_predicted?: boolean;
      sizes?: {
        large?: string;
        semiLarge?: string;
        medium?: string;
        semiSmall?: string;
        small?: string;
      };
      trader_specials?: boolean;
      vouchers?: boolean;
    };
  }
  interface Theme {
    custom: {
      affinities_classes?: string[];
      colors: {
        accent: string;
        background: string;
        bodyText: string;
        error: string;
        headings: string;
        inactiveText: string;
        neutral: string;
        primary: string;
        success: string;
      };
      fontFamily: string;
      login_slider: Array<Slide>;
      logo: string;
      menu: Array<MenuLabelsType>;
      securities: boolean;
      show_category_path: boolean;
      show_predicted: boolean;
      sizes: {
        large: string;
        semiLarge: string;
        medium: string;
        semiSmall: string;
        small: string;
      };
      trader_specials: boolean;
      vouchers: boolean;
    };
  }
}
