import { isOk } from '@/common/utils';
import { graphqlRequest } from '../urql';

import { setPhotoIsVisitedMutation, updateBookMutation } from './mutations';

/**
 * Update book title
 *
 * @param   {Number | String} bookId  id of selected book
 * @param   {String}          title   new title of book
 * @returns {Object}                  detail of new section
 */
export const updateBookTitle = async (bookId, title) => {
  return graphqlRequest(updateBookMutation, {
    bookId,
    params: { title }
  });
};

/**
 * Set photo is visited
 *
 * @param   {String}  bookUserId  id of book user
 * @param   {Boolean} isDigital   is set for digital or print
 * @returns {Boolean}             is success
 */
export const setPhotoIsVisitedApi = async (bookUserId, isDigital) => {
  const attrName = isDigital ? 'digital' : 'print';

  const res = await graphqlRequest(setPhotoIsVisitedMutation, {
    id: bookUserId,
    params: { [`is_${attrName}_photo_visited`]: true }
  });

  return isOk(res);
};
