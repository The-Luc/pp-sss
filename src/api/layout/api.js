import { first, get } from 'lodash';
import { SHEET_TYPE, SYSTEM_OBJECT_TYPE } from '@/common/constants';
import { graphqlRequest } from '../axios';
import {
  getLayoutElementsQuery,
  getLayoutsPreviewQuery,
  getLayoutsQuery,
  getLayoutTypeQuery
} from './queries';
import {
  createBackgroundElement,
  createClipartElement,
  createImageElement,
  createTextElement,
  isOk
} from '@/common/utils';

/**
 *  To get previewImageUrl of layouts of a theme
 * @param {String} themeId id of a theme
 * @returns array of object containing previewImageUrl of layouts
 */
export const getPrintLayoutsPreview = async themeId => {
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
export const getPrintLayoutTypes = async themeId => {
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
export const getLayoutsByThemeAndType = async (themeId, categoryId) => {
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
    isFavorites: false
  }));
};

export const getLayoutElements = async id => {
  const res = await graphqlRequest(getLayoutElementsQuery, { id });
  const elements = get(res, 'data.template.layout.elements', []);
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
