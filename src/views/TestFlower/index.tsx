/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
/* eslint-disable no-loop-func */
/* eslint-disable no-plusplus */
import { intersection } from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';

import { useSelector } from 'react-redux';
import styles from './styles';
import FlowerChart, { SingleData } from '@/components/FlowerChart';
import { CATEGORIZATION } from '@/constants';
import { AppState } from '@/reducers';
import APIService from '@/services/APIService';
import { getCurrentLanguage } from '@/utils/languages';

const FOOD = 'food';
const FOOD_CLASSES = {
  OUTER: ['gfoo'],
  INNER: ['gfsd']
};

const MOBILITY = 'mobility';
const MOBILITY_CLASSES = {
  OUTER: ['gtra'],
  INNER: ['glan', 'gair']
};

const LIFESTYLE = 'lifestyle';
const LIFESTYLE_CLASSES = {
  OUTER: ['gtel', 'gmed', 'gfsh', 'geco', 'gelc'],
  INNER: ['geco']
};

const HOBBIES = 'hobbies';
const HOBBIES_CLASSES = {
  OUTER: ['gaer']
};

const TestFlowerView = (): JSX.Element => {
  const classes = styles();

  const cashbuzzQClasses = useSelector((state: AppState) => state.cashbuzz.qclasses);

  const [chartData, setChartData] = useState<{ outer: SingleData; inner?: SingleData }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchChartData = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    const currentLanguage = getCurrentLanguage();
    const tempData: { outer: SingleData; inner?: SingleData }[] = [];

    const foodClass = cashbuzzQClasses.find((singleClass) => singleClass.label === FOOD_CLASSES.OUTER[0]);
    const foodInnerClass = cashbuzzQClasses.find((singleClass) => singleClass.label === FOOD_CLASSES.INNER[0]);
    const mobilityClass = cashbuzzQClasses.find((singleClass) => singleClass.label === MOBILITY_CLASSES.OUTER[0]);
    const mobilityInnerClass = cashbuzzQClasses.find((singleClass) => singleClass.label === MOBILITY_CLASSES.INNER[0]);
    const lifestyleClass = cashbuzzQClasses.find((singleClass) => singleClass.label === LIFESTYLE_CLASSES.OUTER[0]);
    const lifestyleInnerClass = cashbuzzQClasses.find((singleClass) => singleClass.label === LIFESTYLE_CLASSES.INNER[0]);
    const hobbiesClass = cashbuzzQClasses.find((singleClass) => singleClass.label === HOBBIES_CLASSES.OUTER[0]);

    if (foodClass) {
      tempData.push({
        outer: {
          currency: 'EUR',
          label: currentLanguage === 'en' ? foodClass.label_en : foodClass.label_de,
          value: 0,
          type: FOOD
        },
        inner: foodInnerClass && {
          class: foodInnerClass.label,
          currency: 'EUR',
          label: currentLanguage === 'en' ? foodInnerClass.label_en : foodInnerClass.label_de,
          value: 0
        }
      });
    }

    if (mobilityClass) {
      tempData.push({
        outer: {
          class: mobilityClass.label,
          currency: 'EUR',
          label: currentLanguage === 'en' ? mobilityClass.label_en : mobilityClass.label_de,
          value: 0,
          type: MOBILITY
        },
        inner: mobilityInnerClass && {
          class: mobilityInnerClass.label,
          currency: 'EUR',
          label: currentLanguage === 'en' ? mobilityInnerClass.label_en : mobilityInnerClass.label_de,
          value: 0
        }
      });
    }

    if (lifestyleClass) {
      tempData.push({
        outer: {
          class: lifestyleClass.label,
          currency: 'EUR',
          label: currentLanguage === 'en' ? lifestyleClass.label_en : lifestyleClass.label_de,
          value: 0,
          type: LIFESTYLE
        },
        inner: lifestyleInnerClass && {
          class: lifestyleInnerClass.label,
          currency: 'EUR',
          label: currentLanguage === 'en' ? lifestyleInnerClass.label_en : lifestyleInnerClass.label_de,
          value: 0
        }
      });
    }

    if (hobbiesClass) {
      tempData.push({
        outer: {
          class: hobbiesClass.label,
          currency: 'EUR',
          label: currentLanguage === 'en' ? hobbiesClass.label_en : hobbiesClass.label_de,
          value: 0,
          type: HOBBIES
        }
      });
    }

    const subscriptions = await APIService.subscriptions.getChartData(true);

    for (const subscription of subscriptions) {
      const tempClass = cashbuzzQClasses?.find((iterClass) => iterClass.label === subscription.group_gstd);
      const tempClassTree = tempClass?.category_path.split('#').filter((singleClass) => !CATEGORIZATION.MEANINGLESS_CLASSES.includes(singleClass));

      const roundedAmount = Number(Math.abs(subscription.amount_total).toFixed(2));

      if (tempClassTree && tempClass) {
        const foodIntersection = intersection(tempClassTree, FOOD_CLASSES.OUTER);
        if (foodIntersection.length) {
          const element = tempData.find((singleData) => singleData.outer.type === FOOD);

          if (!element) {
            continue;
          }

          element.outer.value = Number((element.outer.value + roundedAmount).toFixed(2));

          if (element.inner && intersection(tempClassTree, FOOD_CLASSES.INNER).length) {
            element.inner.value = Number((element.inner.value + roundedAmount).toFixed(2));
          }

          continue;
        }

        const mobilityIntersection = intersection(tempClassTree, MOBILITY_CLASSES.OUTER);
        if (mobilityIntersection.length) {
          const element = tempData.find((singleData) => singleData.outer.type === MOBILITY);

          if (!element) {
            continue;
          }

          element.outer.value = Number((element.outer.value + roundedAmount).toFixed(2));

          if (element.inner && intersection(tempClassTree, MOBILITY_CLASSES.INNER).length) {
            element.inner.value = Number((element.inner.value + roundedAmount).toFixed(2));
          }

          continue;
        }

        const lifestyleIntersection = intersection(tempClassTree, LIFESTYLE_CLASSES.OUTER);
        if (lifestyleIntersection.length) {
          const element = tempData.find((singleData) => singleData.outer.type === LIFESTYLE);

          if (!element) {
            continue;
          }

          element.outer.value = Number((element.outer.value + roundedAmount).toFixed(2));

          if (element.inner && intersection(tempClassTree, LIFESTYLE_CLASSES.INNER).length) {
            element.inner.value = Number((element.inner.value + roundedAmount).toFixed(2));
          }

          continue;
        }

        const hobbiesIntersection = intersection(tempClassTree, HOBBIES_CLASSES.OUTER);
        if (hobbiesIntersection.length) {
          const element = tempData.find((singleData) => singleData.outer.type === HOBBIES);

          if (!element) {
            continue;
          }

          element.outer.value = Number((element.outer.value + roundedAmount).toFixed(2));
        }
      }
    }

    setChartData(tempData);
  }, [cashbuzzQClasses]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  return (
    <div className={ classes.root }>
      <FlowerChart data={ chartData } />
    </div>
  );
};

export default TestFlowerView;
