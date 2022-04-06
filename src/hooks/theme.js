import { useAppCommon } from './common';
import { useGetters } from 'vuex-composition-helpers';
import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';
import { GETTERS as DIGITAL_GETTERS } from '@/store/modules/digital/const';

import { getDefaultThemeApi, getThemesApi } from '@/api/theme';

export const useGetterTheme = () => {
  const { isDigitalEdition, generalInfo } = useAppCommon();
  const { value: isDigital } = isDigitalEdition;

  const { printBookInfo, digitalBookInfo } = useGetters({
    printBookInfo: PRINT_GETTERS.GET_BOOK_INFO,
    digitalBookInfo: DIGITAL_GETTERS.GET_BOOK_INFO
  });

  const getThemes = async () => {
    return getThemesApi(isDigital);
  };

  const getDefaultThemeId = async () => {
    const bookId = generalInfo.value.bookId;
    const themes = await getDefaultThemeApi(bookId);

    const printDefaultTheme =
      printBookInfo.value?.defaultThemeId || themes.printDefaultTheme;
    const digitalDefaultTheme =
      digitalBookInfo.value?.defaultThemeId || themes.digitalDefaultTheme;

    return { printDefaultTheme, digitalDefaultTheme };
  };

  return { getThemes, getDefaultThemeId };
};
