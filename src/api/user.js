import { User } from '@/common/models/user';

import { isEmpty } from '@/common/utils';

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

export default {
  getCurrentUser: getCurrentUserApi
};
