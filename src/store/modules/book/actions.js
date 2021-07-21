import BOOK from './const';

import bookService from '@/api/book';
import sectionService from '@/api/section';

import { isEmpty } from '@/common/utils';

export const actions = {
  async [BOOK._ACTIONS.GET_BOOK]({ commit }, { bookId }) {
    if (isEmpty(bookId)) return {};

    const {
      book,
      sectionIds,
      sections,
      sheets
    } = await bookService.getBookManager(bookId);

    commit(BOOK._MUTATES.SET_BOOK, { book });
    commit(BOOK._MUTATES.SET_SECTIONS, { sections, sectionIds });
    commit(BOOK._MUTATES.SET_SHEETS, { sheets });

    return {
      title: book.title,
      totalSheet: book.totalSheets,
      totalPage: book.totalPages,
      totalScreen: book.totalScreens
    };
  },
  async [BOOK._ACTIONS.UPDATE_ASSIGNEE]({ commit }, { id, assigneeId }) {
    if (isEmpty(id)) return;

    const userId = isEmpty(assigneeId) || assigneeId === -1 ? '' : assigneeId;

    await sectionService.updateAssignee(id, userId);

    commit(BOOK._MUTATES.UPDATE_SECTION, { id, assigneeId });
  }
};
