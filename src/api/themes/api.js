import PRINT_THEME from '@/assets/image/themes/theme1.jpg';
import DIGITAL_THEME from '@/assets/image/digital-themes/confetti.jpg';
import { graphqlRequest } from '../axios';
import { themeOptionsQuery } from './queries';

export const loadPrintThemes = async () => {
  const res = await graphqlRequest(themeOptionsQuery);
  return res.data.themes.map(item => ({
    ...item,
    value: item.id,
    previewImageUrl: PRINT_THEME
  }));
};

export const loadDigitalThemes = async () => {
  const res = await graphqlRequest(themeOptionsQuery);
  return res.data.themes.map(item => ({
    ...item,
    value: item.id,
    previewImageUrl: DIGITAL_THEME
  }));
};

/**
 * Get background themes
 *
 * @returns {Object}  query result
 */
export const getThemes = async () => {
  const res = await graphqlRequest(themeOptionsQuery);
  return res.data.themes.map(item => ({
    ...item,
    value: item.id
  }));
};
