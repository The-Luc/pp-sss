import { isEmpty } from '@/common/utils';
import store from '@/store';
import { MUTATES } from '@/store/modules/app/const';
import { EDITION, MODAL_TYPES, ROUTE_NAME } from '@/common/constants';

const evaluateGuards = (guards, to, from, next) => {
  // clone the array so we do not accidentally modify it
  const guardsLeft = guards.slice(0);
  const nextGuard = guardsLeft.shift();

  if (nextGuard === undefined) {
    next();
    return;
  }

  nextGuard(to, from, nextArg => {
    if (nextArg === undefined) {
      evaluateGuards(guardsLeft, to, from, next);
      return;
    }

    next(nextArg);
  });
};

export const useMultiGuards = guards => {
  if (!Array.isArray(guards)) {
    throw new Error('You must specify an array of guards');
  }

  return (to, from, next) => evaluateGuards(guards, to, from, next);
};

export const beforeEnterGuard = guards => ({
  beforeEnter: Array.isArray(guards) ? useMultiGuards(guards) : guards
});

export const closeModalsOnPopState = () => {
  if (store.state.app.modal.isOpen) {
    store.commit(MUTATES.TOGGLE_MODAL, {
      isOpenModal: false
    });
  }

  if (store.state.app.isPrompt) {
    store.commit(MUTATES.SET_IS_PROMPT, {
      isPrompt: false
    });
  }
};

export const showEmptySectionPrompt = () => {
  const { sections } = store.state.book;

  if (isEmpty(sections)) return false;

  const emptySections = Object.values(sections).filter(
    ({ sheetIds }) => sheetIds.length === 0
  );

  if (emptySections.length === 0) return false;

  store.commit(MUTATES.TOGGLE_MODAL, {
    isOpenModal: true,
    modalData: {
      type: MODAL_TYPES.EMPTY_SECTION,
      props: { sections: emptySections }
    }
  });

  return true;
};

export const setActiveEditionByRoute = (routeName) => {
  const { activeEdition } = store.state.app;
  let nextEdition = EDITION.NONE;

  if ([ROUTE_NAME.PRINT, ROUTE_NAME.PRINT_EDIT].includes(routeName)) {
    nextEdition = EDITION.PRINT;
  }

  if ([ROUTE_NAME.DIGITAL, ROUTE_NAME.DIGITAL_EDIT].includes(routeName)) {
    nextEdition = EDITION.DIGITAL;
  }

  if (nextEdition !== activeEdition) {
    store.commit(MUTATES.SET_ACTIVE_EDITION, { edition: nextEdition });
  }
};
