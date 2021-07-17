import { User } from '@/common/models/user';

import { isEmpty } from '@/common/utils';

import { communityUsers } from '@/mock/users';

export const getUsersApi = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(communityUsers);
    });
  });
};

export const getCurrentUserApi = () => {
  return new Promise(resolve => {
    const id = window.sessionStorage.getItem('userId');
    const role = window.sessionStorage.getItem('userRole');

    if (isEmpty(id)) {
      resolve({});

      return;
    }

    resolve(new User({ id, role }));
  });
};

export default {
  getUsers: getUsersApi,
  getCurrentUser: getCurrentUserApi
};
