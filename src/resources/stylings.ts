import { ICONS } from '@/assets';

export default {
  colors: {
    accent: '#FA7268',
    background: '#FFFFFF',
    bodyText: '#4E5053',
    error: '#E694B0',
    headings: '#000000',
    inactiveText: '#989898',
    neutral: '#CCCCCC',
    primary: '#2B99B3',
    success: '#91C9C3'
  },
  fontFamily: 'Lato',
  logo: 'https://cashbuzz.io/wp-content/uploads/2019/04/Cashbuzz_Logo.png',
  login_slider: [
    {
      en: {
        description: 'Get full cashback on order fees for order volumes up to 15,000 € at most banks and brokers',
        icon: ICONS.CURRENCY_EUR,
        title: 'Trade HVB products for 0 €'
      },
      de: {
        description: 'Cashbacks gleichen die Ordergebühr bei Aufträgen von bis zu jeweils 15.000 € bei ausgewählten Brokern und Banken vollständig aus',
        icon: ICONS.CURRENCY_EUR,
        title: 'HVB-Produkte für 0 € handeln'
      }
    },
    {
      en: {
        description: 'Cashbacks are available for around 4,000 banks and brokers. Focus on trading, not on finding the cheapest broker',
        icon: ICONS.FLAG,
        title: 'Full focus on trading'
      },
      de: {
        description: 'Cashbacks für HVB-Produkte können bei rund 4.000 Banken und Sparkassen eingelöst werden. So können Sie sich unabhängig von Broker-Aktionen voll aufs Trading konzentrieren',
        icon: ICONS.FLAG,
        title: 'Voller Fokus aufs Trading'
      }
    },
    {
      en: {
        description: 'Get ready instantly. Just connect your trading account. Cashbacks are identified and paid automatically',
        icon: ICONS.ROCKET_OUTLINE,
        title: 'Setup takes a few easy steps only'
      },
      de: {
        description: 'Starten Sie sofort durch und verbinden Sie einfach Ihr Trading-Konto. Cashbacks werden automatisch erkannt und ausgezahlt',
        icon: ICONS.ROCKET_OUTLINE,
        title: 'In wenigen Schritten zum Ziel'
      }
    }
  ],
  sizes: {
    large: '32px',
    semiLarge: '24px',
    medium: '18px',
    semiSmall: '16px',
    small: '14px'
  },
  trader_specials: false,
  vouchers: false
};
