import { graphqlRequest } from '../urql';

import {
  loginUserMutation,
  saveFavoritesMutation,
  deleteFavoritesMutation,
  resumeSessionMutation
} from './mutations';

import { isOk } from '@/common/utils';

export const logInUserApi = async (email, password) => {
  const res = await graphqlRequest(loginUserMutation, {
    email,
    password
  });

  if (!isOk(res)) return;

  const user = res.data.login_user;
  const communityUserId = user.communities_users[0]?.id;

  return {
    token: user.token,
    communityUserId
  };
};

export const resumSessionApi = async sessionToken => {
  const res = await graphqlRequest(resumeSessionMutation, { sessionToken });

  if (!isOk(res) || !res.data.token_session) return {};

  const { token, context, communities_users } = res.data.token_session;

  return {
    token,
    bookId: context.book_id,
    communityUserId: communities_users.id
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

/**
 * delete layout id from favorites
 *
 * @param   {Number | String} id  id of selected layout
 * @returns {Object}              mutation result
 */
export const deleteFavoritesApi = async id => {
  return graphqlRequest(deleteFavoritesMutation, { id });
};
