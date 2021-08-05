import { AppState } from "@/reducers";
import classNames from "classnames";
import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { Sankey } from 'react-vis';
import { getCurrentLanguage } from '@/utils/languages';
import { useTranslation } from 'react-i18next';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  ListSubheader,
} from '@material-ui/core';
import distinctColors from "distinct-colors";

const CategoryTree = (): JSX.Element => {
  const cashbuzzQClasses = useSelector((state: AppState) => state.cashbuzz.qclasses);
  // const subscriptions = await APIService.subscriptions.getChartData(false);
  const { t, i18n: i18nInstance } = useTranslation();

  const [category, setCatergory] = useState<String>('indy')
  const [nodes, setNodes] = useState<any>([])
  const [links, setLinks] = useState<any>([])

  const currentLanguage = getCurrentLanguage();

  useEffect(() => {
    let arr = cashbuzzQClasses.filter(obj => obj.category_path.split('#')[((category === "gcix" || category === "gstd" || category === "gbix") ? 3 : 2)] === category);
    reducer(arr);
    createLinks(arr);
  }, [currentLanguage, category])

  const reducer = (arr: any[]) => {
    let data: any[] = [];
    arr.forEach((val: any) => {
      let nodesData = {
        name: currentLanguage == 'en' ? val.label_en : val.label_de
      };
      data.push(nodesData)
    })

    setNodes(data)
  };

  const createLinks = (arr: any[]) => {
    const mappedArray = arr.reduce((prev, next) => {
      const categoryList = next.category_path.split('#');
      return [
        ...prev,
        {
          ...next,
          categoryList,
        }
      ]
    }, [])
      .map((item: any, cId: number) => ({ ...item, cId }));

    const recursiveRouting = (pathIndex: number, index: number, list: any, opacity: any) => {
      const curCategory = list[index];
      const nextLevelCategories = list.filter(
        (item: any) => (item.categoryList.length === pathIndex + 2) && item.categoryList[pathIndex] === curCategory.categoryList[pathIndex]);

      if (nextLevelCategories.length < 1) return [];
      if (curCategory.cId == rootCategory.cId) {
        const colorsBySource = distinctColors({
          count: nextLevelCategories.length,
        });
        nextLevelCategories.map((category: any, index: number) => { return category['color'] = colorsBySource[index] })
      } else {
        nextLevelCategories.map((category: any, index: number) => { return category['color'] = curCategory.color })
      }

      const { links: nestedLinks, count } = nextLevelCategories.reduce((prev: any, nextCategory: any) => {
        const subNestedLinks = recursiveRouting(pathIndex + 1, nextCategory.cId, list, opacity != 0.1 ? opacity - 0.15 : 0.15);
        return {
          links: [
            ...prev.links,
            ...subNestedLinks,
          ],
          count: {
            ...prev.count,
            [nextCategory.cId]: subNestedLinks.length || 1
          }
        }
      }, { links: [], count: {} });
      const subLinks = nextLevelCategories.map((category: any) => {
        return ({
          color: category.color,
          source: curCategory.cId,
          target: category.cId,
          opacity: opacity,
          value: count[category.cId]
        })
      });

      return [
        ...subLinks,
        ...nestedLinks
      ]
    }

    const rootCategory = mappedArray.find((item: any) => item.categoryList.length === ((category === "gcix" || category === "gstd" || category === "gbix") ? 4 : 3))
    const newLinks = recursiveRouting(((category === "gcix" || category === "gstd" || category === "gbix") ? 3 : 2), rootCategory.cId, mappedArray, 1);

    setLinks(newLinks)
  }

  const handleCategory = (event: any) => {
    setCatergory(event.target.value)
  }

  return (
    <div>
      <FormControl className='aa'>
        <InputLabel htmlFor="grouped-select">Category</InputLabel>
        <Select
          defaultValue=""
          id="grouped-select"
          value={category}
          style={{ width: '120px' }}
          onChange={handleCategory}
        >
          <MenuItem value='indy'>{ t('category_tree.indy') }</MenuItem>
          <MenuItem value='subj'>{ t('category_tree.subj') }</MenuItem>
          <MenuItem value='actn'>{ t('category_tree.actn') }</MenuItem>
          {/* <MenuItem value='ggrp'>Group</MenuItem> */}
          <ListSubheader value='ggrp'>{ t('category_tree.ggrp') }</ListSubheader>
          <MenuItem value='gcix'>{ t('category_tree.gcix') }</MenuItem>
          <MenuItem value='gstd'>{ t('category_tree.gstd') }</MenuItem>
          <MenuItem value='gbix'>{ t('category_tree.gbix') }</MenuItem>
        </Select>
      </FormControl>
      <Sankey
        nodes={nodes}
        links={links}
        width={1500}
        height={nodes.length * (nodes.length > 50 ? 8 : 25)}
      />
    </div>
  );

}

export default CategoryTree;