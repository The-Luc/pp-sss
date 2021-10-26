import { graphqlRequest } from '../axios';
import { get } from 'lodash';

import { loginUserMutation } from './mutations';

import {
  User,
  getErrorWithMessages,
  getSuccessWithData
} from '@/common/models';

import { isEmpty } from '@/common/utils';

import { getItem } from '@/common/storage';
import { Notification } from '@/components/Notification';
import { LOCAL_STORAGE, ROLE, STATUS } from '@/common/constants';
import { getCommunityUsersQuery, getUserRoleQuery } from './queries';

export const logInUser = async (email, password) => {
  try {
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
  } catch (e) {
    Notification({
      type: 'error',
      title: 'Error',
      text: 'Something went wrong!'
    });
  }
};

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

export const getUsersApi = async () => {
  const res = await graphqlRequest(getCommunityUsersQuery, { communityId: 1 });

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
