import {
  TableCell,
  TableRow
} from '@material-ui/core';
import classNames from 'classnames';
import htmlParser from 'html-react-parser';
import React, { useMemo } from 'react';
import { getI18n } from 'react-i18next';

import styles from './styles';
import { Affinity, DescriptionQClass } from '@/interfaces';
import { getText } from '@/utils/data';
import { getCurrentLanguage, to6391Format } from '@/utils/languages';

export interface SingleAffinity {
  affinity: Affinity;
  descriptionClass?: DescriptionQClass;
  index: number;
  tree?: DescriptionQClass[];
}

const Row = ({ affinity, descriptionClass, index, tree }: SingleAffinity): JSX.Element => {
  const classes = styles();
  const i18nInstance = getI18n();

  const category = useMemo(() => {
    if (!descriptionClass) {
      return undefined;
    }

    const currentLanguage = getCurrentLanguage();
    switch (currentLanguage) {
      case 'en':
        return descriptionClass.label_en;
      case 'de':
      default:
        return descriptionClass.label_de;
    }
  }, [descriptionClass]);

  const descriptionTree = useMemo(() => {
    if (!tree) {
      return null;
    }

    const currentLanguage = getCurrentLanguage();
    switch (currentLanguage) {
      case 'en':
        return tree
          .map((singleDescription, singleDescriptionIndex) => {
            if (singleDescriptionIndex === tree.length - 1) {
              return `<strong>${singleDescription.label_en}</strong>`;
            }

            return singleDescription.label_en;
          })
          .join(' / ');
      case 'de':
      default:
        return tree
          .map((singleDescription, singleDescriptionIndex) => {
            if (singleDescriptionIndex === tree.length - 1) {
              return `<strong>${singleDescription.label_de}</strong>`;
            }

            return singleDescription.label_de;
          })
          .join(' / ');
    }
  }, [tree]);

  return (
    <TableRow className={ classes.row }>
      <TableCell
        align="right"
        style={ { width: 63 } }
      >
        { index }
      </TableCell>
      <TableCell style={ { width: '50%', paddingLeft: 220 } }>
        { descriptionTree ? htmlParser(`/ ${descriptionTree}`) : getText(category) }
      </TableCell>
      <TableCell
        align="right"
        className={ classNames({ amount: true, negative: affinity.affinity < 1, positive: affinity.affinity >= 1 }) }
      >
        { new Intl.NumberFormat(to6391Format(i18nInstance.language), { minimumFractionDigits: 2 }).format(Number(affinity.affinity)) }
      </TableCell>
    </TableRow>
  );
};

export default Row;
