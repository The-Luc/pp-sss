import { graphqlRequest } from '../urql';
import {
  getDigitalThemesQuery,
  getPrintThemesQuery,
  getThemeDefaultQuery
} from './queries';
import { isOk } from '@/common/utils';
import { get } from 'lodash';

const getPrintThemeApi = async () => {
  const res = await graphqlRequest(getPrintThemesQuery);

  if (!isOk(res)) return [];

  const pairs = get(res, 'data.template_book_pairs');

  return pairs.map(item => ({
    id: item.id,
    name: item.template_book.name,
    value: item.id,
    previewImageUrl: item.preview_image_url
  }));
};

const getDigitalThemeApi = async () => {
  const res = await graphqlRequest(getDigitalThemesQuery);

  if (!isOk(res)) return [];

  const themes = get(res, 'data.themes');

  return themes.map(item => ({
    id: item.id,
    name: item.name,
    value: item.id,
    previewImageUrl: item.digital_preview_image_url
  }));
};

/**
 * Get list of theme
 *
 * @returns {Promise<Array>} theme list
 */
export const getThemesApi = async (isDigital = false) => {
  return isDigital ? getDigitalThemeApi() : getPrintThemeApi();
};

export const getDefaultThemeApi = async bookId => {
  const res = await graphqlRequest(getThemeDefaultQuery, { bookId });

  if (!isOk(res)) return {};

  const printDefaultTheme = get(res, 'data.book.print_theme_id');
  const digitalDefaultTheme = get(res, 'data.book.digital_theme_id');

  return {
    printDefaultTheme,
    digitalDefaultTheme
  };
};
