import { get, uniqBy } from 'lodash';

import { graphqlRequest } from '../urql';

import {
  User,
  getErrorWithMessages,
  getSuccessWithData
} from '@/common/models';

import { getItem } from '@/common/storage';

import { isEmpty, isOk } from '@/common/utils';

import {
  getCommunityUsersQuery,
  getUserRoleQuery,
  getFavoriteIdsQuery,
  getFavoriteLayoutsQuery
} from './queries';

import {
  LAYOUT_PAGE_TYPE,
  LOCAL_STORAGE,
  ROLE,
  STATUS
} from '@/common/constants';

export const getCurrentUserApi = async () => {
  const communityUserId = getItem(LOCAL_STORAGE.COMMUNITY_USER_ID);

  const res = await graphqlRequest(getUserRoleQuery, {
    id: communityUserId
  });

  if (res.status === STATUS.NG || isEmpty(communityUserId)) return {};

  const role = res.data.communities_user.admin ? ROLE.ADMIN : ROLE.USER;

  return new User({
    id: parseInt(communityUserId, 10),
    role: parseInt(role, 10)
  });
};

export const getUsersApi = async communityId => {
  const res = await graphqlRequest(getCommunityUsersQuery, { communityId });

  if (res.status === STATUS.NG) return [];

  const commUsers = get(res, 'data.community.communities_users', []);

  const users = [];
  const ids = [];
  commUsers.forEach(({ admin, user }) => {
    if (isEmpty(user) || ids.includes(user.id)) return;

    ids.push(user.id);
    users.push(
      new User({
        id: user.id,
        name: user.name,
        role: admin ? ROLE.ADMIN : ROLE.USER
      })
    );
  });
  return users;
};

export const authenticateApi = (bookId, sheetId) => {
  return new Promise(resolve => {
    if (isEmpty(bookId)) {
      resolve(getErrorWithMessages(''));

      return;
    }

    resolve(getSuccessWithData({ sheetId }));
  });
};

/**
 * Get list of favorites id of layout of user
 *
 * @returns {Array}  favorite ids
 */
export const getFavoritesApi = async () => {
  const res = await graphqlRequest(getFavoriteIdsQuery);

  if (!isOk(res)) return [];

  return res.data.template_favourites.map(({ id }) => id);
};

/**
 * Get list of favorites layout of user
 *
 * @returns {Array}  layouts
 */
export const getFavoriteLayoutsApi = async () => {
  const res = await graphqlRequest(getFavoriteLayoutsQuery);

  if (!isOk(res)) return [];

  const layouts = uniqBy(res.data.template_favourites, 'id');
  const doublePageId = LAYOUT_PAGE_TYPE.FULL_PAGE.id;
  const singlePageId = LAYOUT_PAGE_TYPE.SINGLE_PAGE.id;

  return layouts.map(t => {
    const categoryId =
      isEmpty(t.categories) && isEmpty(t.categories[0])
        ? null
        : t.categories[0].id;

    return {
      id: t.id,
      type: categoryId,
      themeId: get(t, 'theme.id', null),
      previewImageUrl: t.preview_image_url,
      name: t.data.properties.title,
      isFavorites: true,
      isFavoritesDisabled: false,
      pageType: t.layout_type === 'DOUBLE_PAGE' ? doublePageId : singlePageId
    };
  });
};
