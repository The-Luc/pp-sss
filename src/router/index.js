import Vue from 'vue';
import VueRouter from 'vue-router';

import moduleCreateBook from '@/views/CreateBook/routes';
import store from '../store';
import { MUTATES } from '@/store/modules/app/const';
import { MODAL_TYPES } from '@/common/constants';
import { SCREEN } from '@/common/constants/book';

const PageNotFound = () => import('../views/PageNotFound');
const Manager = () => import('../views/CreateBook/Manager');

Vue.use(VueRouter);

const authGuard = {
  beforeEnter: (to, _, next) => {
    const redirect = () => {
      next();
      if (store.state.auth.token) {
        if (to.path === '/login') {
          next('/');
        } else {
          next();
        }
      } else {
        next('/login');
      }
    };
    redirect();
  }
};

const routes = [
  {
    path: '/',
    redirect: '/edit/manager',
    component: Manager,
    ...authGuard
  },
  {
    path: '/edit',
    redirect: '/edit/manager',
    component: Manager,
    ...authGuard
  },
  { path: '*', component: PageNotFound }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [...routes, ...moduleCreateBook],
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
});
router.beforeEach(async (to, from, next) => {
  if (to.path === SCREEN.PRINT || to.path === SCREEN.DIGITAL) {
    const sections = store.state.book.book?.sections;
    const emptySections = sections.filter(item => item.sheets?.length === 0);
    if (emptySections.length !== 0) {
      if (from.path !== SCREEN.MANAGER) {
        await next();
      }
      store.commit(MUTATES.TOGGLE_MODAL, {
        isOpenModal: true,
        modalData: {
          type: MODAL_TYPES.EMPTY_SECTION,
          props: { sections: emptySections }
        }
      });
    } else {
      next();
    }
  } else {
    next();
  }
});
export default router;
