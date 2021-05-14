import AUTH from './const';
import router from '../../../router';

export const mutations = {
  [AUTH._MUTATES.LOGIN](state) {
    state.token = true;
    router.push('/');
  },
  [AUTH._MUTATES.LOGOUT](state) {
    state.token = false;
    router.push('/login');
  }
};
