import { graphqlRequest } from '../urql';
import { getThemeDefaultQuery, themeOptionsQuery } from './queries';
import { isOk } from '@/common/utils';
import { get } from 'lodash';

/**
 * Get list of theme
 *
 * @returns {Promise<Array>} theme list
 */
export const getThemesApi = async (isDigital = false) => {
  const res = await graphqlRequest(themeOptionsQuery);

  if (!isOk(res)) return [];

  const getPreviewImageUrl = item => {
    const path = 'template_book_pair.template_book.preview_image_url';
    const printPreview = get(item, path) || item.preview_image_url;

    return isDigital ? item.digital_preview_image_url : printPreview;
  };

  return res.data.themes.map(item => ({
    id: item.id,
    name: item.name,
    value: item.id,
    previewImageUrl: getPreviewImageUrl(item)
  }));
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
