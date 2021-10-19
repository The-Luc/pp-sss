import BOOK from './const';

import sectionService from '@/api/section';

import { isEmpty } from '@/common/utils';

export const actions = {
  async [BOOK._ACTIONS.UPDATE_ASSIGNEE]({ commit }, { id, assigneeId }) {
    if (isEmpty(id)) return;

    const userId = isEmpty(assigneeId) || assigneeId === -1 ? '' : assigneeId;

    await sectionService.updateAssignee(id, userId);

    commit(BOOK._MUTATES.UPDATE_SECTION, { id, assigneeId });
  }
};
