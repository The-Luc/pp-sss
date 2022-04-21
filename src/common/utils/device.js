export const isMacOs = () => window.navigator.platform.includes('Mac');

export const isCtrlKey = event => {
  return isMacOs() ? event.metaKey : event.ctrlKey;
};

export const isDeleteKey = key => {
  return isMacOs() ? key === 46 || key === 8 : key === 46;
};
