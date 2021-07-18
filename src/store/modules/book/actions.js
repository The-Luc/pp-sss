import BOOK from './const';

import managerService from '@/api/manager';

import { isEmpty } from '@/common/utils';

export const actions = {
  async [BOOK._ACTIONS.GET_BOOK]({ state, commit }) {
    if (isEmpty(state.book.id)) return;

    const { book, sectionIds, sections, sheets } = await managerService.getBook(
      state.book.id
    );

    commit(BOOK._MUTATES.SET_BOOK, { book });
    commit(BOOK._MUTATES.SET_SECTIONS, { sections, sectionIds });
    commit(BOOK._MUTATES.SET_SHEETS, { sheets });
  }
};
