import PRINT_THEME from '@/assets/image/themes/theme1.jpg';
import DIGITAL_THEME from '@/assets/image/digital-themes/confetti.jpg';
import { graphqlRequest } from '../urql';
import { themeOptionsQuery } from './queries';
import { isOk } from '@/common/utils';

/**
 * Get list of theme
 *
 * @returns {Array} theme list
 */
export const getThemesApi = async (
  isPreviewAvailable = false,
  isDigital = false
) => {
  const res = await graphqlRequest(themeOptionsQuery);

  if (!isOk(res)) return [];

  const previewUrl = isDigital ? DIGITAL_THEME : PRINT_THEME;

  return res.data.themes.map(item => ({
    ...item,
    value: item.id,
    previewImageUrl: isPreviewAvailable ? previewUrl : ''
  }));
};
