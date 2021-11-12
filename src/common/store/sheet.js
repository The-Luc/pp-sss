export const setSheets = (state, { sheets }) => {
  state.sheets = sheets;
};
export const deleteMedia = (state, { id }) => {
  state.sheets[state.currentSheetId].media = state.sheets[
    state.currentSheetId
  ].media.filter(mediaId => mediaId.id !== id);
};
