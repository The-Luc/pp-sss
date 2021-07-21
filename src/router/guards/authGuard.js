import store from '@/store';
import { MUTATES } from '@/store/modules/app/const';
import { isEmpty } from '@/common/utils';
import userService from '@/api/user';

const authGuard = (to, from, next) => {
  const redirect = async () => {
    if (to.path === '/login') {
      next('/');

      return;
    }

    if (!isEmpty(store.state.app.user.id)) {
      next();

      return;
    }

    const user = await userService.getCurrentUser();

    const isUnauthenticated = isEmpty(user);
    const isLoginPage = from?.name === 'login';

    if (isUnauthenticated && isLoginPage) {
      return;
    }

    if (isUnauthenticated) {
      next('/login');

      return;
    }

    store.commit(MUTATES.SET_USER, user);

    next();
  };

  redirect();
};

export default authGuard;
