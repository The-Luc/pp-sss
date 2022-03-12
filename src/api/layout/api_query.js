import { first, get, cloneDeep } from 'lodash';
import { SHEET_TYPE, SYSTEM_OBJECT_TYPE } from '@/common/constants';
import { graphqlRequest } from '../urql';
import {
  getLayoutElementsQuery,
  getLayoutsPreviewQuery,
  getLayoutsQuery,
  getLayoutTypeQuery,
  getUserLayoutsQuery
} from './queries';
import { LAYOUT_PAGE_TYPE } from '@/common/constants/layoutTypes';
import {
  convertObjectPxToInch,
  createBackgroundElement,
  createClipartElement,
  createImageElement,
  createTextElement,
  isOk
} from '@/common/utils';

import { layoutMapping } from '@/common/mapping/layout';
/**
 *  To get previewImageUrl of layouts of a theme
 * @param {String} themeId id of a theme
 * @returns array of object containing previewImageUrl of layouts
 */
export const getPrintLayoutsPreviewApi = async themeId => {
  if (!themeId) return [];

  const res = await graphqlRequest(getLayoutsPreviewQuery, { themeId });

  if (!isOk(res)) return [];

  const layoutImageUrls = get(res.data, 'theme.templates', []);

  return layoutImageUrls.map(l => ({ previewImageUrl: l.preview_image_url }));
};

/**
 * To get layout type of a theme
 * @param {String} themeId id of a theme
 * @returns array of layout types
 */
export const getPrintLayoutTypesApi = async themeId => {
  if (!themeId) return [];

  const res = await graphqlRequest(getLayoutTypeQuery, { themeId });

  if (!isOk(res)) return [];

  const templates = get(res.data, 'theme.templates', []);

  const ids = [];
  const types = [];
  templates.forEach(({ categories }) => {
    categories.forEach(({ id, name }) => {
      if (!ids.includes(id)) {
        ids.push(id);
        types.push({ name, value: id, sheetType: SHEET_TYPE.FRONT_COVER });
      }
    });
  });

  return types;
};

/**
 * To get layout filtered by its themeId and its category
 * @param {String} themeId     id of a theme
 * @param {String} categoryId  id of a category
 * @returns array of layout object
 */
export const getLayoutsByThemeAndTypeApi = async (themeId, categoryId) => {
  const res = await graphqlRequest(getLayoutsQuery, { themeId });

  if (!isOk(res)) return [];

  const templates = res.data.theme.templates.filter(t =>
    t.categories.some(c => c.id === categoryId)
  );
  return templates.map(t => ({
    id: t.id,
    type: categoryId,
    themeId,
    previewImageUrl: t.preview_image_url,
    name: t.data.properties.title,
    isFavorites: false,
    pageType: LAYOUT_PAGE_TYPE.SINGLE_PAGE.id
  }));
};

export const getLayoutElementsApi = async id => {
  const res = await graphqlRequest(getLayoutElementsQuery, { id });

  if (!isOk(res)) return [];

  const elements = get(res, 'data.template.layout.elements', []);

  if (elements[0]?.type) {
    // PP templates
    const objects = cloneDeep(elements);

    convertObjectPxToInch(objects);
    return objects;
  }

  // case: legacy templates
  const background = createBackgroundElement(get(res, 'data.template', {}));

  return [
    ...elements.map(ele => {
      const key = first(Object.keys(ele));
      const value = ele[key];

      if (key === SYSTEM_OBJECT_TYPE.TEXT) {
        return createTextElement(value);
      }

      if (key === SYSTEM_OBJECT_TYPE.IMAGE) {
        return createImageElement(value);
      }

      return createClipartElement(value);
    }),
    background
  ];
};

export const getCustomPrintLayoutApi = async () => {
  const res = await graphqlRequest(getUserLayoutsQuery);

  if (!isOk(res)) return;

  const { single_page, double_page } = res.data;

  return [...single_page, ...double_page].map(layout => layoutMapping(layout));
};
