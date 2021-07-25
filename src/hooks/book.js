import { useActions, useGetters } from 'vuex-composition-helpers';

import { ACTIONS, GETTERS } from '@/store/modules/book/const';
import {
  ACTIONS as PRINT_ACTIONS,
  GETTERS as PRINT_GETTERS
} from '@/store/modules/print/const';
import bookService from '@/api/book';
import printService from '@/api/print';
import { isEmpty } from '@/common/utils';

/**
 * The hook trigger action to get book and get book information from store
 * @return {Object} Sheet;s id selected
 */
export const useBook = () => {
  const { getBook } = useActions({
    getBook: ACTIONS.GET_BOOK
  });

  const { book } = useGetters({
    book: GETTERS.BOOK_DETAIL
  });
  return {
    book,
    getBook
  };
};

/**
 * The hook allow update book title
 * @return {Object} Function to update book title
 */
export const useUpdateTitle = () => {
  const updateTitle = async (bookId, title) => {
    const { data, isSuccess } = await bookService.updateTitle(bookId, title);
    return {
      data,
      isSuccess
    };
  };

  return {
    updateTitle
  };
};

export const useSaveData = () => {
  const {
    getObjectsAndBackgrounds,
    sheetById,
    defaultThemeId,
    pageInfo,
    sheets
  } = useGetters({
    getObjectsAndBackgrounds: PRINT_GETTERS.GET_OBJECTS_AND_BACKGROUNDS,
    defaultThemeId: PRINT_GETTERS.DEFAULT_THEME_ID,
    pageInfo: PRINT_GETTERS.GET_PAGE_INFO,
    sheetById: PRINT_GETTERS.SHEET_BY_ID,
    sheets: PRINT_GETTERS.GET_SHEETS
  });
  const savePrintEditScreen = async sheetId => {
    const getSheetFunc = sheetById.value;
    const objects = getObjectsAndBackgrounds.value;
    const objectData = objects.map(o => o.object);
    const sheetProps = getSheetFunc(sheetId);

    if (isEmpty(sheetProps)) return;

    const dataToSave = {
      objects: objectData,
      defaultThemeId: defaultThemeId.value,
      pageInfo: pageInfo.value,
      sheetProps
    };

    const { data, isSuccess } = await printService.saveEditScreen(
      sheetId,
      dataToSave
    );
    return {
      data,
      isSuccess
    };
  };

  const savePrintMainScreen = async () => {
    const sheetData = sheets.value;

    const data = {};

    Object.values(sheetData).forEach(sheet => {
      const props = {
        link: sheet.link
      };

      data[sheet.id] = props;
    });
    await printService.saveMainScreen(data);
  };

  return { savePrintEditScreen, savePrintMainScreen };
};

export const useSaveDefaultThemeId = () => {
  const { saveDefaultThemeId } = useActions({
    saveDefaultThemeId: PRINT_ACTIONS.SAVE_DEFAULT_THEME_ID
  });

  return { saveDefaultThemeId };
};

export const useSavePageInfo = () => {
  const { setPageInfo } = useActions({
    setPageInfo: PRINT_ACTIONS.SAVE_PAGE_INFO
  });

  return { setPageInfo };
};
