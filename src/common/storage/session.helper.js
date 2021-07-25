export const setItem = (itemName, value) =>
  window.sessionStorage.setItem(itemName, value);
export const getItem = itemName => window.sessionStorage.getItem(itemName);
export const parseItem = itemName => JSON.parse(getItem(itemName));
