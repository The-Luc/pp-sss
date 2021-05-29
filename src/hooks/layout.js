import { useMutations, useGetters } from 'vuex-composition-helpers';

import {
  GETTERS as BOOK_GETTERS,
  MUTATES as BOOK_MUTATES
} from '@/store/modules/book/const';
import {
  MUTATES as APP_MUTATES,
  GETTERS as APP_GETTERS
} from '@/store/modules/app/const';
import { TOOL_NAME } from '@/common/constants';

export const useLayoutPrompt = () => {
  const { checkSheetIsVisited, isPrompt, pageSelected } = useGetters({
    checkSheetIsVisited: BOOK_GETTERS.SHEET_IS_VISITED,
    isPrompt: APP_GETTERS.IS_PROMPT,
    pageSelected: BOOK_GETTERS.GET_PAGE_SELECTED
  });

  const { updateVisited, setIsPrompt, setToolNameSelected } = useMutations({
    updateVisited: BOOK_MUTATES.UPDATE_SHEET_VISITED,
    setIsPrompt: APP_MUTATES.SET_IS_PROMPT,
    setToolNameSelected: APP_MUTATES.SET_TOOL_NAME_SELECTED
  });

  const openPrompt = () => {
    setIsPrompt({ isPrompt: true });
    setToolNameSelected({ name: TOOL_NAME.LAYOUTS });
  };

  return {
    checkSheetIsVisited,
    updateVisited,
    isPrompt,
    setIsPrompt,
    pageSelected,
    openPrompt
  };
};
