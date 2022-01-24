import { getBookCoverOptionApi } from '@/api/book';
import { getSheetIdOfPage } from '@/api/page';
import { getSheetInfoApi } from '@/api/sheet';
import { SHEET_TYPE } from '@/common/constants';
import { getPageIdsOfSheet } from '@/common/utils';

export const usePageApi = () => {
  const getBook = async (bookId, pageId) => {
    const { data } = await getBookCoverOptionApi(bookId);

    const coverOption = data.book.yearbook_spec?.cover_option;

    const sheet = await getSheetIdOfPage(pageId);

    const pageIds = sheet.pages.map(p => p.id);
    const sheetType = SHEET_TYPE[sheet.sheet_type];

    const [leftPageId] = getPageIdsOfSheet(pageIds, sheetType);

    const isLeftPage = leftPageId === pageId;

    return { coverOption, isLeftPage, sheetType, sheetId: sheet.id };
  };
  const getSheet = async sheetId => await getSheetInfoApi(sheetId);
  return {
    getBook,
    getSheet
  };
};
