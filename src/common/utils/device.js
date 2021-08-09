export const isDeleteKey = key => {
  const isMacOS = window.navigator.platform.includes('Mac');
  return isMacOS ? key === 46 || key === 8 : key === 46;
};
