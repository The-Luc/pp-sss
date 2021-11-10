import { graphqlRequest } from '../urql';

import { saveFavoritesMutation } from './mutations';

/**
 * Save layout id to favorites
 *
 * @param   {Number | String} id  id of selected layout
 * @returns {Object}              mutation result
 */
export const saveToFavorites = async id => {
  return graphqlRequest(saveFavoritesMutation, { id });
};
