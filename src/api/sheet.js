import { Transition } from '@/common/models';
import {
  insertItemsToArray,
  modifyItemsInArray,
  removeItemsFormArray
} from '@/common/utils';

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

export const getTransitionsApi = sheetId => {
  return new Promise(resolve => {
    const { sectionIndex, sheetIndex } = findSectionSheetIndex(sheetId);

    if (sheetIndex < 0) {
      resolve();

      return;
    }

    resolve(
      window.data.book.sections[sectionIndex].sheets[
        sheetIndex
      ].digitalData.transitions.map(t => new Transition(t))
    );
  });
};

export const addTransitionApi = sheetId => {
  return new Promise(resolve => {
    const { sectionIndex, sheetIndex } = findSectionSheetIndex(sheetId);

    if (sheetIndex < 0) {
      resolve();

      return;
    }

    window.data.book.sections[sectionIndex].sheets[
      sheetIndex
    ].digitalData.transitions = insertItemsToArray(
      window.data.book.sections[sectionIndex].sheets[sheetIndex].digitalData
        .transitions,
      [{ value: new Transition() }]
    );

    resolve();
  });
};

export const removeTransitionApi = sheetId => {
  return new Promise(resolve => {
    const { sectionIndex, sheetIndex } = findSectionSheetIndex(sheetId);

    if (sheetIndex < 0) {
      resolve();

      return;
    }

    const transitions =
      window.data.book.sections[sectionIndex].sheets[sheetIndex].digitalData
        .transitions;

    const lastIndex = transitions.length - 1;

    window.data.book.sections[sectionIndex].sheets[
      sheetIndex
    ].digitalData.transitions = removeItemsFormArray(transitions, [
      { index: lastIndex < 0 ? 0 : lastIndex }
    ]);

    resolve();
  });
};

export const updateTransitionApi = (sheetId, transition, index) => {
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
      [{ index, value: transition }]
    );

    resolve();
  });
};

export default {
  getTransitions: getTransitionsApi,
  addTransition: addTransitionApi,
  removeTransition: removeTransitionApi,
  updateTransition: updateTransitionApi
};
