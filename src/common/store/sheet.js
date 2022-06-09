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

export const getElementMappings = state => {
  return state.sheets[state.currentSheetId].mappings || [];
};
export const setElementMappings = (state, { elementMappings }) => {
  state.sheets[state.currentSheetId].mappings = elementMappings;
};
