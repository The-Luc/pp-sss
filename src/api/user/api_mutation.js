import { graphqlRequest } from '../urql';

import { loginUserMutation, saveFavoritesMutation } from './mutations';

import { STATUS } from '@/common/constants';

export const logInUserApi = async (email, password) => {
  const res = await graphqlRequest(loginUserMutation, {
    email,
    password
  });

  if (res.status === STATUS.NG) return [];

  const user = res.data.login_user;
  const communityUserId = user.communities_users[0]?.id;

  return {
    token: user.token,
    communityUserId
  };
};

/**
 * Save layout id to favorites
 *
 * @param   {Number | String} id  id of selected layout
 * @returns {Object}              mutation result
 */
export const saveToFavoritesApi = async id => {
  return graphqlRequest(saveFavoritesMutation, { id });
};
