import graphqlResquest from '../axios';

import { isEmpty } from '@/common/utils';

import {
  User,
  getErrorWithMessages,
  getSuccessWithData
} from '@/common/models';

import { loginUserMutation } from './mutations';

import { getItem } from '@/common/storage';
import { communityUsers } from '@/mock/users';

const logInUser = (email, password) => {
  return graphqlResquest(loginUserMutation, { email, password });
};

const getCurrentUserApi = () => {
  return new Promise(resolve => {
    const id = getItem('userId');
    const role = getItem('userRole');

    if (isEmpty(id)) {
      resolve({});

      return;
    }

    resolve(new User({ id: parseInt(id, 10), role: parseInt(role, 10) }));
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
