import { useGetters } from 'vuex-composition-helpers';

import { authenticateApi } from '@/api/user';

import { GETTERS as APP_GETTERS } from '@/store/modules/app/const';

export const useUser = () => {
  const { currentUser } = useGetters({
    currentUser: APP_GETTERS.USER
  });

  return {
    currentUser,
    authenticate: authenticateApi
  };
};
