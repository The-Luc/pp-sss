import { removeItemsFormArray } from '../utils';

export const setSheets = (state, { sheets }) => {
  state.sheets = sheets;
};
export const deleteMedia = (state, { index }) => {
  state.sheets[state.currentSheetId].media = removeItemsFormArray(
    state.sheets[state.currentSheetId].media,
    [{ index }]
  );
};
