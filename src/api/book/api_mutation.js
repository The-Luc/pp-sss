import { graphqlRequest } from '../axios';

import { updateBookMutation } from './mutations';

/**
 * Update book title
 *
 * @param   {Number | String} bookId  id of selected book
 * @param   {String}          title   new title of book
 * @returns {Object}                  detail of new section
 */
export const updateBookTitle = async (bookId, title) => {
  return await graphqlRequest(updateBookMutation, {
    bookId,
    params: { title }
  });
};
