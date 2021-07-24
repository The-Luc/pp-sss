/**
 * Get path of edtion list page
 *
 * @param   {String}  bookId  id of current book
 * @param   {String}  edition the edition need to get path
 * @returns {String}          the path
 */
export const getEditionListPath = (bookId, edition) => {
  return `/book/${bookId}/edit/${edition}`;
};
