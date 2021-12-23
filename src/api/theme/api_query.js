import DIGITAL_THEME from '@/assets/image/digital-themes/confetti.jpg';
import { graphqlRequest } from '../urql';
import { themeOptionsQuery } from './queries';
import { isOk } from '@/common/utils';

/**
 * Get list of theme
 *
 * @returns {Array} theme list
 */
export const getThemesApi = async (isDigital = false) => {
  const res = await graphqlRequest(themeOptionsQuery);

  if (!isOk(res)) return [];

  return res.data.themes.map(item => ({
    ...item,
    value: item.id,
    previewImageUrl: isDigital ? DIGITAL_THEME : item.preview_image_url
  }));
};
