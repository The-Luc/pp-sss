import { useMutations } from 'vuex-composition-helpers';
import { MUTATES as PRINT_MUTATES } from '@/store/modules/print/const';

import { updateSheetLinkApi } from '@/api/sheet';

import {
  useMutationBook,
  useActionBook,
  useAppCommon,
  useSheet
} from '@/hooks';
import { isEmpty } from '@/common/utils';

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

    const { title, totalPages, totalSheets, totalScreens, communityId } = book;

    setGeneralInfo({
      info: {
        bookId,
        title,
        totalPages,
        totalSheets,
        totalScreens,
        communityId
      }
    });
  };

  const updateLinkStatus = async (sheetId, linkStatus) => {
    const sheet = getSheets.value[sheetId];
    const pageIds = isEmpty(sheet) ? [] : sheet.pageIds;

    const isSuccess = await updateSheetLinkApi(sheetId, pageIds, linkStatus);

    if (!isSuccess) return;

    updateLinkStatusToStore({ link: linkStatus, sheetId });
  };

  return { getBookPrintInfo, updateLinkStatus };
};
