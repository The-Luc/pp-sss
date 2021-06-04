import PROP from './const';

export const getters = {
  [PROP._GETTERS.TEXT_STYLE]: ({ selectedText: { style } }) => style,
  [PROP._GETTERS.TEXT_PROPERTY]: ({ selectedText: { property } }) => property
};
