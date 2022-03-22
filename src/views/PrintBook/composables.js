import { getBookCoverOptionApi } from '@/api/book';
import { getSheetIdOfPage } from '@/api/page';
import { getSheetInfoApi } from '@/api/sheet';
import { SHEET_TYPE } from '@/common/constants';
import { getPageIdsOfSheet } from '@/common/utils';
import { bookMapping } from '../../common/mapping/book';
import { useText } from '../CreateBook/composables';
import { pick } from 'lodash';

export const usePageApi = () => {
  const { setFontsToStore } = useText();

  const getBook = async (bookId, pageId) => {
    // get fonts
    await setFontsToStore();

    const { data } = await getBookCoverOptionApi(bookId);

    const coverOption = data.book.yearbook_spec?.cover_option;

    const sheet = await getSheetIdOfPage(pageId);

    const pageIds = sheet.pages.map(p => p.id);
    const sheetType = SHEET_TYPE[sheet.sheet_type];

    const [leftPageId] = getPageIdsOfSheet(pageIds, sheetType);

    const isLeftPage = leftPageId === pageId;

    const mappedBook = bookMapping(data.book);
    const pageInfo = pick(mappedBook, [
      'isNumberingOn',
      'position',
      'fontFamily',
      'fontSize',
      'color'
    ]);

    return { coverOption, isLeftPage, sheetType, sheetId: sheet.id, pageInfo };
  };

  const getSheet = async sheetId => getSheetInfoApi(sheetId);
  return {
    getBook,
    getSheet
  };
};
