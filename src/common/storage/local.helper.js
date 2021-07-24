export const setItem = (itemName, value) =>
  localStorage.setItem(itemName, value);
export const getItem = itemName => localStorage.getItem(itemName);
export const parseItem = itemName => JSON.parse(getItem(itemName));
export const removeItem = itemName => localStorage.removeItem(itemName);
export const clear = () => localStorage.clear();
