import { useAppCommon } from './common';

import { getThemesApi } from '@/api/theme';

export const useGetterTheme = () => {
  const { value: isDigital } = useAppCommon().isDigitalEdition;

  const getThemes = async () => {
    return getThemesApi(true, isDigital);
  };

  return { getThemes };
};
