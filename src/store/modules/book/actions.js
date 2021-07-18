import BOOK from './const';

import managerService from '@/api/manager';

import { isEmpty } from '@/common/utils';

export const actions = {
  async [BOOK._ACTIONS.GET_BOOK]({ commit }, { bookId }) {
    if (isEmpty(bookId)) return {};

    const { book, sectionIds, sections, sheets } = await managerService.getBook(
      bookId
    );

    commit(BOOK._MUTATES.SET_BOOK, { book });
    commit(BOOK._MUTATES.SET_SECTIONS, { sections, sectionIds });
    commit(BOOK._MUTATES.SET_SHEETS, { sheets });

    return {
      title: book.title,
      totalSheet: book.totalSheets,
      totalPage: book.totalPages,
      totalScreen: book.totalScreens
    };
  }
};
