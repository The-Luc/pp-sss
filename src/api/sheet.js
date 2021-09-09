import { TRANS_TARGET } from '@/common/constants';
import { Transition } from '@/common/models';
import { insertItemsToArray, modifyItemsInArray } from '@/common/utils';

const findSectionSheetIndex = sheetId => {
  const sectionIndex = window.data.book.sections.findIndex(section => {
    return section.sheets.findIndex(({ id }) => id === sheetId) >= 0;
  });

  if (sectionIndex < 0) return { sectionIndex: -1, sheetIndex: -1 };

  const sheetIndex = window.data.book.sections[sectionIndex].sheets.findIndex(
    ({ id }) => id === sheetId
  );

  return sheetIndex < 0
    ? { sectionIndex: -1, sheetIndex: -1 }
    : { sectionIndex, sheetIndex };
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

export const getTransitionsApi = sheetId => {
  return new Promise(resolve => {
    const { sectionIndex, sheetIndex } = findSectionSheetIndex(sheetId);

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

export const getTransitionApi = (sheetId, index) => {
  return new Promise(resolve => {
    const { sectionIndex, sheetIndex } = findSectionSheetIndex(sheetId);

    if (sheetIndex < 0) {
      resolve();

      return;
    }

    const transition =
      window.data.book.sections[sectionIndex].sheets[sheetIndex].digitalData
        .transitions[index];

    resolve(new Transition(transition));
  });
};

export const addTransitionApi = (sheetId, totalTransition = 1) => {
  return new Promise(resolve => {
    const { sectionIndex, sheetIndex } = findSectionSheetIndex(sheetId);

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

export const removeTransitionApi = (sheetId, totalTransition = 1) => {
  return new Promise(resolve => {
    const { sectionIndex, sheetIndex } = findSectionSheetIndex(sheetId);

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
  transition,
  targetType,
  sheetId,
  transitionIndex
) => {
  if (targetType === TRANS_TARGET.SELF) {
    return new Promise(resolve => {
      const { sectionIndex, sheetIndex } = findSectionSheetIndex(sheetId);

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
      const { sectionIndex, sheetIndex } = findSectionSheetIndex(sheetId);

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
      const { sectionIndex } = findSectionSheetIndex(sheetId);

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

export default {
  getTransition: getTransitionApi,
  getTransitions: getTransitionsApi,
  addTransition: addTransitionApi,
  removeTransition: removeTransitionApi,
  applyTransition: applyTransitionApi
};
