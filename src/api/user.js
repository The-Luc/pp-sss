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

export default {
  getCurrentUser: getCurrentUserApi,
  getUsers: getUsersApi
};
