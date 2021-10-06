import { TRANSITION, TRANS_TARGET } from '@/common/constants';
import { getSuccessWithData, Transition } from '@/common/models';
import {
  getPlaybackDataFromFrames,
  insertItemsToArray,
  isEmpty,
  mergeArray,
  modifyItemsInArray
} from '@/common/utils';

const findSectionSheetIndex = (sheetId, sectionId) => {
  if (isEmpty(sectionId)) return { sectionIndex: -1, sheetIndex: -1 };

  const sectionIndex = window.data.book.sections.findIndex(({ id }) => {
    return id === sectionId;
  });

  if (sectionIndex < 0) return { sectionIndex: -1, sheetIndex: -1 };

  if (isEmpty(sheetId)) return { sectionIndex, sheetIndex: -1 };

  const sheetIndex = window.data.book.sections[sectionIndex].sheets.findIndex(
    ({ id }) => id === sheetId
  );

  return { sectionIndex, sheetIndex };
};

const replaceTransition = (transition, sectionIndex, sheetIndex) => {
  const totalTransition =
    window.data.book.sections[sectionIndex].sheets[sheetIndex].digitalData
      .transitions.length;

  for (let i = 0; i < totalTransition; i++) {
    window.data.book.sections[sectionIndex].sheets[
      sheetIndex
    ].digitalData.transitions[i] = transition;
  }
};

export const getTransitionsApi = (bookId, sheetId, sectionId) => {
  return new Promise(resolve => {
    const { sectionIndex, sheetIndex } = findSectionSheetIndex(
      sheetId,
      sectionId
    );

    if (sheetIndex < 0) {
      resolve();

      return;
    }

    const transitions =
      window.data.book.sections[sectionIndex].sheets[sheetIndex].digitalData
        .transitions;

    resolve(transitions.map(t => new Transition(t)));
  });
};

export const getTransitionApi = (
  bookId,
  sheetId,
  sectionId,
  transitionIndex
) => {
  return new Promise(resolve => {
    const { sectionIndex, sheetIndex } = findSectionSheetIndex(
      sheetId,
      sectionId
    );

    if (sheetIndex < 0) {
      resolve();

      return;
    }

    const transition =
      window.data.book.sections[sectionIndex].sheets[sheetIndex].digitalData
        .transitions[transitionIndex];

    resolve(new Transition(transition));
  });
};

export const addTransitionApi = (
  bookId,
  sheetId,
  sectionId,
  totalTransition = 1
) => {
  return new Promise(resolve => {
    const { sectionIndex, sheetIndex } = findSectionSheetIndex(
      sheetId,
      sectionId
    );

    if (sheetIndex < 0) {
      resolve();

      return;
    }

    for (let i = 0; i < totalTransition; i++) {
      window.data.book.sections[sectionIndex].sheets[
        sheetIndex
      ].digitalData.transitions = insertItemsToArray(
        window.data.book.sections[sectionIndex].sheets[sheetIndex].digitalData
          .transitions,
        [{ value: new Transition() }]
      );
    }

    resolve();
  });
};

export const removeTransitionApi = (
  bookId,
  sheetId,
  sectionId,
  totalTransition = 1
) => {
  return new Promise(resolve => {
    const { sectionIndex, sheetIndex } = findSectionSheetIndex(
      sheetId,
      sectionId
    );

    if (sheetIndex < 0) {
      resolve();

      return;
    }

    const { transitions } = window.data.book.sections[sectionIndex].sheets[
      sheetIndex
    ].digitalData;

    window.data.book.sections[sectionIndex].sheets[
      sheetIndex
    ].digitalData.transitions = Array.from(
      { length: transitions.length - totalTransition },
      (_, index) => {
        return transitions[index];
      }
    );

    resolve();
  });
};

/**
 *
 * @param {Object}  transition      transition to be applied
 * @param {Number}  targetType      transition / screen / sheet / book
 * @param {Number}  sheetId         id of sheet
 * @param {Number}  transitionIndex index of transition
 */
export const applyTransitionApi = (
  bookId,
  transition,
  targetType,
  sheetId,
  sectionId,
  transitionIndex
) => {
  if (transition.transition === TRANSITION.NONE) {
    transition.direction = -1;
    transition.duration = 0;
  }

  if (transition.transition === TRANSITION.DISSOLVE) {
    transition.direction = -1;
  }

  if (targetType === TRANS_TARGET.SELF) {
    return new Promise(resolve => {
      const { sectionIndex, sheetIndex } = findSectionSheetIndex(
        sheetId,
        sectionId
      );

      if (sheetIndex < 0) {
        resolve();

        return;
      }

      window.data.book.sections[sectionIndex].sheets[
        sheetIndex
      ].digitalData.transitions = modifyItemsInArray(
        window.data.book.sections[sectionIndex].sheets[sheetIndex].digitalData
          .transitions,
        [{ index: transitionIndex, value: transition }]
      );

      resolve();
    });
  }

  if (targetType === TRANS_TARGET.SHEET) {
    return new Promise(resolve => {
      const { sectionIndex, sheetIndex } = findSectionSheetIndex(
        sheetId,
        sectionId
      );

      if (sheetIndex < 0) {
        resolve();

        return;
      }

      replaceTransition(transition, sectionIndex, sheetIndex);

      resolve();
    });
  }

  if (targetType === TRANS_TARGET.SECTION) {
    return new Promise(resolve => {
      const { sectionIndex } = findSectionSheetIndex(sheetId, sectionId);

      if (sectionIndex < 0) {
        resolve();

        return;
      }

      window.data.book.sections[sectionIndex].sheets.forEach(
        (_, sheetIndex) => {
          replaceTransition(transition, sectionIndex, sheetIndex);
        }
      );

      resolve();
    });
  }

  return new Promise(resolve => {
    window.data.book.sections.forEach((section, sectionIndex) => {
      section.sheets.forEach((_, sheetIndex) => {
        replaceTransition(transition, sectionIndex, sheetIndex);
      });
    });

    resolve();
  });
};

export const getPlaybackDataApi = bookId => {
  bookId; // TODO: will use with API

  return new Promise(resolve => {
    let bookFrames = [];

    window.data.book.sections.forEach(section => {
      section.sheets.forEach(({ digitalData }) => {
        const { frames, transitions } = digitalData;

        if (isEmpty(frames)) return;

        if (!isEmpty(bookFrames)) {
          bookFrames[bookFrames.length - 1].transition = new Transition();
        }

        bookFrames = mergeArray(
          bookFrames,
          getPlaybackDataFromFrames(frames, transitions)
        );
      });
    });

    resolve(getSuccessWithData(bookFrames));
  });
};

export default {
  getTransition: getTransitionApi,
  getTransitions: getTransitionsApi,
  addTransition: addTransitionApi,
  removeTransition: removeTransitionApi,
  applyTransition: applyTransitionApi,
  getPlaybackData: getPlaybackDataApi
};
