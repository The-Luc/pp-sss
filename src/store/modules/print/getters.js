import PRINT from './const';

export const getters = {
  [PRINT._GETTERS.TEXT_STYLE]: ({ selectedText: { style } }) => style,
  [PRINT._GETTERS.TEXT_PROPERTY]: ({ selectedText: { property } }) => property
};
