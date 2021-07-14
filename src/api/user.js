import { communityUsers } from '@/mock/communityUsers';

export const loadCommunityUsers = () =>
  new Promise(resolve => {
    setTimeout(() => {
      resolve(communityUsers);
    });
  });

export default {
  loadCommunityUsers
};
