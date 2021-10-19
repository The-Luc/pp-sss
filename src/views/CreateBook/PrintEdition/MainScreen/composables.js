import printService from '@/api/print';
import { useGetters } from 'vuex-composition-helpers';
import { GETTERS as PRINT_GETTERS } from '@/store/modules/print/const';

import { useMutationBook, useActionBook, useAppCommon } from '@/hooks';

export const useSaveData = () => {
  const { sheets } = useGetters({
    sheets: PRINT_GETTERS.GET_SHEETS
  });

  const savePrintMainScreen = async sheetsData => {
    const data = {};

    Object.values(sheetsData).forEach(sheet => {
      const props = {
        link: sheet.link
      };

      data[sheet.id] = props;
    });
    await printService.saveMainScreen(data);
  };

  return { savePrintMainScreen, sheets };
};

export const useBookPrintInfo = () => {
  const { setSectionsSheets } = useMutationBook();

  const { setGeneralInfo } = useAppCommon();

  const { getBookInfo } = useActionBook();

  const getBookPrintInfo = async bookId => {
    const { book, sectionsSheets } = await getBookInfo(bookId);

    setSectionsSheets({ sectionsSheets });

    const { title, totalPage, totalSheet, totalScreen } = book;

    setGeneralInfo({
      info: { bookId, title, totalPage, totalSheet, totalScreen }
    });
  };

  return {
    getBookPrintInfo
  };
};
