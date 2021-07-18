import { User } from '@/common/models/user';

import { communityUsers } from '@/mock/users';

export const getUsersApi = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(communityUsers.map(u => new User(u)));
    });
  });
};

export default {
  getUsers: getUsersApi
};
