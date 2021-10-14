import { useGetters } from 'vuex-composition-helpers';

import { userService } from '@/api';

import { GETTERS as APP_GETTERS } from '@/store/modules/app/const';

export const useUser = () => {
  const { currentUser } = useGetters({
    currentUser: APP_GETTERS.USER
  });

  return {
    currentUser,
    authenticate: userService.authenticate
  };
};
