import { ROLE } from '@/common/constants';
import { getErrorWithMessages, getSuccessWithData } from '@/common/models';
import { User } from '@/common/models/user';
import { getItem } from '@/common/storage';

import { isEmpty } from '@/common/utils';

import { communityUsers } from '@/mock/users';
import graphqlResquest from '../axios';
import { loginUserMutation } from './mutations';

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

    const id = getItem('userId');
    const role = getItem('userRole');

    if (isEmpty(id)) {
      resolve(getErrorWithMessages(''));

      return;
    }

    const sectionIndex = window.data.book.sections.findIndex(section => {
      return section.sheets.findIndex(({ id }) => `${id}` === sheetId) >= 0;
    });

    if (sectionIndex < 0) {
      resolve(getErrorWithMessages(''));

      return;
    }

    const assigneeId = window.data.book.sections[sectionIndex].assigneeId;

    if (role === `${ROLE.ADMIN}` || id === `${assigneeId}`) {
      resolve(getSuccessWithData({}));

      return;
    }

    resolve(getErrorWithMessages(''));
  });
};

export const userService = {
  getCurrentUser: getCurrentUserApi,
  getUsers: getUsersApi,
  authenticate: authenticateApi,
  logIn: logInUser
};
