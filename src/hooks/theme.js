import { useAppCommon } from './common';

import { getDefaultThemeApi, getThemesApi } from '@/api/theme';

export const useGetterTheme = () => {
  const { isDigitalEdition, generalInfo } = useAppCommon();
  const { value: isDigital } = isDigitalEdition;

  const getThemes = async () => {
    return getThemesApi(isDigital);
  };

  const getDefaultThemeId = async () => {
    const bookId = generalInfo.value.bookId;
    return getDefaultThemeApi(bookId);
  };

  return { getThemes, getDefaultThemeId };
};
