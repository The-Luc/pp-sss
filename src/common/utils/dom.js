/**
 * To unfocus an input
 */
export const unFocus = () => {
  const tmp = document.createElement('input');
  document.body.appendChild(tmp);
  tmp.focus();
  document.body.removeChild(tmp);
};

/**
 * Clear data copied from clipboard
 */
export const clearClipboard = event => {
  event.clipboardData.setData('text/plain', '');
  event.preventDefault();
};
