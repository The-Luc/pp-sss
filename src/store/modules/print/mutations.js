import PRINT from './const';

export const mutations = {
  [PRINT._MUTATES.SET_TEXT_STYLE](state, payload) {
    const { fontFamily, fontSize, fontWeight, fontStyle, color } = payload;

    state.selectedText.style.fontFamily =
      fontFamily || state.selectedText.style.fontFamily;
    state.selectedText.style.fontSize =
      fontSize || state.selectedText.style.fontSize;
    state.selectedText.style.fontWeight =
      fontWeight || state.selectedText.style.fontWeight;
    state.selectedText.style.fontStyle =
      fontStyle || state.selectedText.style.fontStyle;
    state.selectedText.style.color = color || state.selectedText.style.color;
  },
  [PRINT._MUTATES.SET_TEXT_PROPERTY](state, payload) {
    const { styleId } = payload;

    state.selectedText.property.styleId = styleId;
  }
};
