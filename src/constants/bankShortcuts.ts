import { ICONS, IMAGES } from '@/assets';

import { BankInterfaceOptionType } from '@/types';
import { ROUTES } from '.';

export interface SingleConfig {
  dialog?: {
    action?: () => void | Promise<void>;
    content: string;
    redirect?: string;
  };
  image?: boolean;
  interface?: BankInterfaceOptionType;
  logo: string;
  name: string;
  redirect?: boolean;
  search: string;
  subLabel?: string;
  withoutXS2A?: boolean;
}

export const BANKS: SingleConfig[] = [
  {
    name: 'add_new_bank_connection.banks.volksbank-eg',
    subLabel: 'myvoba.com',
    search: 'GENODEF1SES',
    redirect: true,
    logo: ICONS.VOLKSBANK
  },
  {
    name: 'add_new_bank_connection.banks.other-volksbanken',
    search: 'GENO',
    logo: ICONS.VOLKSBANK
  },
  {
    name: 'add_new_bank_connection.banks.sparkassen',
    search: 'SPARKASSE',
    logo: ICONS.SPARKASSE_LOGO
  },
  {
    name: 'add_new_bank_connection.banks.commerzbank',
    search: '20040000',
    redirect: true,
    logo: ICONS.COMMERZBANK_LOGO
  },
  {
    name: 'add_new_bank_connection.banks.deutche-bank',
    search: '10070100',
    redirect: true,
    logo: ICONS.DEUTSCHE_BANK
  },
  {
    name: 'add_new_bank_connection.banks.hypovereinsbank',
    search: '70020270',
    redirect: true,
    logo: ICONS.HVB_LOGO
  },
  {
    name: 'add_new_bank_connection.banks.ing',
    search: '50010517',
    redirect: true,
    logo: ICONS.ING_LOGO
  },
  {
    name: 'add_new_bank_connection.banks.postbank',
    search: '66010075',
    logo: ICONS.POSTBANK_LOGO,
    redirect: true
  },
  {
    name: 'add_new_bank_connection.banks.sparda-banken',
    search: 'Sparda-Bank',
    logo: IMAGES.SPARDA_LOGO,
    image: true
  }
];

export const OTHER_BANKS: SingleConfig[] = [
  {
    name: 'add_new_bank_connection.banks.volksbanken',
    search: 'GENO',
    logo: ICONS.VOLKSBANK
  },
  {
    name: 'add_new_bank_connection.banks.sparkassen',
    search: 'SPARKASSE',
    logo: ICONS.SPARKASSE_LOGO
  },
  {
    name: 'add_new_bank_connection.banks.commerzbank',
    search: '20040000',
    redirect: true,
    logo: ICONS.COMMERZBANK_LOGO
  },
  {
    name: 'add_new_bank_connection.banks.deutche-bank',
    search: '10070100',
    redirect: true,
    logo: ICONS.DEUTSCHE_BANK
  },
  {
    name: 'add_new_bank_connection.banks.hypovereinsbank',
    search: '70020270',
    redirect: true,
    logo: ICONS.HVB_LOGO
  },
  {
    name: 'add_new_bank_connection.banks.ing',
    search: '50010517',
    redirect: true,
    logo: ICONS.ING_LOGO
  },
  {
    name: 'add_new_bank_connection.banks.postbank',
    search: '66010075',
    logo: ICONS.POSTBANK_LOGO,
    redirect: true
  },
  {
    name: 'add_new_bank_connection.banks.sparda-banken',
    search: 'Sparda-Bank',
    logo: IMAGES.SPARDA_LOGO,
    image: true
  }
];

export const BANKS_PARTNER_0: SingleConfig[] = [
  {
    name: 'add_new_bank_connection.banks.comdirect',
    search: 'comdirect',
    logo: IMAGES.COMDIRECT_LOGO,
    image: true
  },
  {
    name: 'add_new_bank_connection.banks.consorsbank',
    search: 'CSDBDE71XXX',
    logo: IMAGES.CONSORSBANK_LOGO,
    image: true,
    redirect: true
  },
  {
    name: 'add_new_bank_connection.banks.dkb',
    search: 'BYLADEM1001',
    logo: IMAGES.DKB_LOGO,
    image: true,
    redirect: true
  },
  {
    interface: 'FINTS_SERVER',
    name: 'add_new_bank_connection.banks.deutche-bank',
    search: '10070100',
    redirect: true,
    logo: ICONS.DEUTSCHE_BANK,
    withoutXS2A: true
  },
  {
    interface: 'FINTS_SERVER',
    name: 'add_new_bank_connection.banks.ing',
    search: 'INGDDEFFXXX',
    logo: ICONS.ING_LOGO,
    redirect: true,
    withoutXS2A: true
  },
  {
    name: 'add_new_bank_connection.banks.flatex',
    search: 'BIWBDE33XXX',
    logo: IMAGES.FLATEX_LOGO,
    image: true,
    redirect: true,
    withoutXS2A: true
  },
  {
    name: 'add_new_bank_connection.banks.onvista',
    search: 'BOURDEFFXXX',
    logo: IMAGES.ONVISTA_LOGO,
    image: true,
    redirect: true,
    withoutXS2A: true
  },
  {
    name: 'add_new_bank_connection.banks.s-broker',
    search: 'S Broker Wiesbaden',
    image: true,
    logo: IMAGES.SBROKER_LOGO
  },
  {
    dialog: {
      content: 'add_new_bank_connection.banks.hello_bank.content',
      redirect: ROUTES.AUTHORIZED.DOCUMENTS
    },
    name: 'add_new_bank_connection.banks.hello_bank.name',
    search: 'hellobank',
    image: true,
    logo: IMAGES.HELLOBANK_LOGO
  },
  {
    dialog: {
      content: 'add_new_bank_connection.banks.smartbroker.content',
      redirect: ROUTES.AUTHORIZED.DOCUMENTS
    },
    name: 'add_new_bank_connection.banks.smartbroker.name',
    search: 'Smartbroker',
    image: true,
    logo: IMAGES.SMARTBROKER_LOGO
  }
];
