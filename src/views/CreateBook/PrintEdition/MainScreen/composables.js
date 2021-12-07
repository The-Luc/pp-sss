import printService from '@/api/print';
import { useGetters, useMutations } from 'vuex-composition-helpers';
import {
  GETTERS as PRINT_GETTERS,
  MUTATES as PRINT_MUTATES
} from '@/store/modules/print/const';

import { disableSheetLinkApi, updateSheetApi } from '@/api/sheet';

import {
  useMutationBook,
  useActionBook,
  useAppCommon,
  useSheet
} from '@/hooks';
import { isEmpty, isOk } from '@/common/utils';
import { LINK_STATUS } from '@/common/constants';

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
  const { setGeneralInfo } = useAppCommon();
  const { getSheets } = useSheet();

  const { setSectionsSheets } = useMutationBook();

  const { getBookInfo } = useActionBook();

  const { updateLinkStatusToStore } = useMutations({
    updateLinkStatusToStore: PRINT_MUTATES.SET_SHEET_LINK_STATUS
  });

  const getBookPrintInfo = async bookId => {
    const { book, sections, sheets } = await getBookInfo(bookId);

    setSectionsSheets({ sections, sheets });

    const { title, totalPages, totalSheets, totalScreens } = book;

    setGeneralInfo({
      info: { bookId, title, totalPages, totalSheets, totalScreens }
    });
  };

  const updateLinkStatus = async (sheetId, linkStatus) => {
    const isLinked = linkStatus === LINK_STATUS.LINK;

    const sheet = isLinked ? {} : getSheets.value[sheetId];
    const pageIds = isEmpty(sheet) ? [] : sheet.pageIds;

    const res = isLinked
      ? await updateSheetApi(sheetId, { link: linkStatus })
      : await disableSheetLinkApi(sheetId, pageIds, linkStatus);

    const isSuccess = (isLinked && isOk(res)) || (!isLinked && res);

    if (!isSuccess) return;

    updateLinkStatusToStore({ link: linkStatus, sheetId });
  };

  return { getBookPrintInfo, updateLinkStatus };
};
