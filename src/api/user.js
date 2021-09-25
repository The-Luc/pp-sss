import { ROLE } from '@/common/constants';
import { getErrorWithMessages, getSuccessWithData } from '@/common/models';
import { User } from '@/common/models/user';

import { isEmpty } from '@/common/utils';

import { communityUsers } from '@/mock/users';

export const getCurrentUserApi = () => {
  return new Promise(resolve => {
    const id = window.sessionStorage.getItem('userId');
    const role = window.sessionStorage.getItem('userRole');

    if (isEmpty(id)) {
      resolve({});

      return;
    }

    resolve(new User({ id: parseInt(id, 10), role: parseInt(role, 10) }));
  });
};

export const getUsersApi = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(communityUsers.map(u => new User(u)));
    });
  });
};

export const authenticateApi = (bookId, sheetId) => {
  return new Promise(resolve => {
    if (isEmpty(bookId)) {
      resolve(getErrorWithMessages(''));

      return;
    }

    const id = window.sessionStorage.getItem('userId');
    const role = window.sessionStorage.getItem('userRole');

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
    console.log(role, ROLE.ADMIN);
    console.log(id, assigneeId);
    console.log(role === `${ROLE.ADMIN}`);
    console.log(id === `${assigneeId}`);

    if (role === `${ROLE.ADMIN}` || id === `${assigneeId}`) {
      resolve(getSuccessWithData({}));

      return;
    }

    resolve(getErrorWithMessages(''));
  });
};

export default {
  getCurrentUser: getCurrentUserApi,
  getUsers: getUsersApi,
  authenticate: authenticateApi
};
