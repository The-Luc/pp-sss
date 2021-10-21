import { graphqlRequest } from '../axios';

import { loginUserMutation } from './mutations';

import {
  User,
  getErrorWithMessages,
  getSuccessWithData
} from '@/common/models';

import { isEmpty } from '@/common/utils';

import { getItem } from '@/common/storage';
import { communityUsers } from '@/mock/users';
import { Notification } from '@/components/Notification';
import { LOCAL_STORAGE, ROLE } from '@/common/constants';
import { getUserRoleQuery } from './queries';

const logInUser = async (email, password) => {
  try {
    const res = await graphqlRequest(loginUserMutation, {
      email,
      password
    });

    if (!res) return;

    const user = res.login_user;
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

const getCurrentUserApi = async () => {
  const communityUserId = getItem(LOCAL_STORAGE.COMMUNITY_USER_ID);

  const { communities_user } = await graphqlRequest(getUserRoleQuery, {
    id: communityUserId
  });
  const role = communities_user.admin ? ROLE.ADMIN : ROLE.USER;

  if (isEmpty(communityUserId)) {
    return {};
  }

  return new User({
    id: parseInt(communityUserId, 10),
    role: parseInt(role, 10)
  });
};

const getUsersApi = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(communityUsers.map(u => new User(u)));
    });
  });
};

const authenticateApi = (bookId, sheetId) => {
  return new Promise(resolve => {
    if (isEmpty(bookId)) {
      resolve(getErrorWithMessages(''));

      return;
    }

    resolve(getSuccessWithData({ sheetId }));
  });
};

export const userService = {
  getCurrentUser: getCurrentUserApi,
  getUsers: getUsersApi,
  authenticate: authenticateApi,
  logIn: logInUser
};
