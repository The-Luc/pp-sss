import { get } from 'lodash';
import { SHEET_TYPE } from '@/common/constants';
import { graphqlRequest } from '../axios';
import {
  getLayoutsPreviewQuery,
  getLayoutsQuery,
  getLayoutTypeQuery
} from './queries';

/**
 *  To get previewImageUrl of layouts of a theme
 * @param {String} themeId id of a theme
 * @returns array of object containing previewImageUrl of layouts
 */
const getPrintLayoutsPreview = async themeId => {
  if (!themeId) return [];

  const res = await graphqlRequest(getLayoutsPreviewQuery, { themeId });

  if (!res) return [];

  const layoutImageUrls = get(res, 'theme.templates', []);
  return layoutImageUrls.map(l => ({ previewImageUrl: l.preview_image_url }));
};

const getPrintLayoutTypes = async themeId => {
  if (!themeId) return [];

  const res = await graphqlRequest(getLayoutTypeQuery, { themeId });

  if (!res) return [];

  const templates = get(res, 'theme.templates', []);

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

const getLayoutsByThemeAndType = async (themeId, categoryId) => {
  const res = await graphqlRequest(getLayoutsQuery, { themeId });

  if (!res) return;

  const templates = res.theme.templates.filter(t =>
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

export const layoutService = {
  getPrintLayoutTypes,
  getLayoutsByThemeAndType,
  getPrintLayoutsPreview
};
