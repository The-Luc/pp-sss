import { graphqlRequest } from '../urql';

import { apiBackgroundToModel } from '@/common/mapping';
import { isOk } from '@/common/utils';

import { BackgroundElementEntity as BackgroundElement } from '@/common/models/entities/elements';

import {
  backgroundCategoriesQuery,
  backgroundQuery,
  backgroundOfThemeQuery,
  digitalBackgroundQuery
} from './queries';

import { BACKGROUND_TYPE, BACKGROUND_PAGE_TYPE } from '@/common/constants';

const getBackgroundsOfTheme = async (
  backgroundTypeId,
  backgroundTypeSubId,
  backgroundPageTypeId,
  isDigital
) => {
  const query = isDigital ? digitalBackgroundQuery : backgroundQuery;

  const res = await graphqlRequest(query, {
    id: backgroundTypeSubId
  });

  if (!isOk(res)) return [];

  const backgrounds = res.data.category.backgrounds.map(
    item =>
      new BackgroundElement({
        ...apiBackgroundToModel(item),
        categoryId: backgroundTypeSubId,
        backgroundType: backgroundTypeId
      })
  );

  if (isDigital)
    return backgrounds.map(bg => ({ ...bg, pageType: 2, backgroundType: 1 }));

  return backgrounds.filter(
    item =>
      item.pageType ===
      (backgroundPageTypeId || BACKGROUND_PAGE_TYPE.GENERAL.id)
  );
};

const getBackgroundsOfCategory = async (
  backgroundTypeId,
  backgroundTypeSubId,
  backgroundPageTypeId
) => {
  const res = await graphqlRequest(backgroundOfThemeQuery, {
    id: backgroundTypeSubId
  });

  if (!isOk(res)) return [];

  const backgrounds = [];

  res.data.theme.templates.forEach(t => {
    t.categories.forEach(c => {
      c.backgrounds.forEach(b => {
        const index = backgrounds.findIndex(item => item.id === b.id);
        if (index >= 0) return;
        backgrounds.push(b);
      });
    });
  });

  return backgrounds
    .map(
      item =>
        new BackgroundElement({
          ...apiBackgroundToModel(item),
          categoryId: backgroundTypeSubId,
          backgroundType: backgroundTypeId
        })
    )
    .filter(
      item =>
        item.pageType ===
        (backgroundPageTypeId || BACKGROUND_PAGE_TYPE.GENERAL.id)
    );
};
/**
 * Get background for print edition
 *
 * @returns {Object}  query result
 */
export const getBackgroundsApi = async (
  backgroundTypeId,
  backgroundTypeSubId,
  backgroundPageTypeId,
  isDigital
) => {
  const getBackgroundMethod =
    backgroundTypeId === BACKGROUND_TYPE.CATEGORY.id
      ? getBackgroundsOfTheme
      : getBackgroundsOfCategory;

  return await getBackgroundMethod(
    backgroundTypeId,
    backgroundTypeSubId,
    backgroundPageTypeId,
    isDigital
  );
};
/**
 * Get background categories for print edition
 *
 * @returns {Object}  query result
 */
export const getBackgroundCategoriesApi = async () => {
  const res = await graphqlRequest(backgroundCategoriesQuery);

  if (!isOk(res)) return [];

  return res.data.categories.map(c => ({
    ...c,
    value: c.id
  }));
};
