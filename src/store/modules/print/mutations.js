import PRINT from './const';

export const mutations = {
  [PRINT._MUTATES.SET_TEXT_STYLE](state, payload) {
    const { fontFamily, fontSize, fontWeight, fontStyle, color } = payload;

    state.selectedText.style.fontFamily =
      fontFamily || state.selectedText.fontFamily;
    state.selectedText.style.fontSize = fontSize || state.selectedText.fontSize;
    state.selectedText.style.fontWeight =
      fontWeight || state.selectedText.fontWeight;
    state.selectedText.style.fontStyle =
      fontStyle || state.selectedText.fontStyle;
    state.selectedText.style.color = color || state.selectedText.color;
  },
  [PRINT._MUTATES.SET_TEXT_STYLE_ID](state, payload) {
    const { styleId } = payload;

    state.selectedText.styleId = styleId;
  }
};
