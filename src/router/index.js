import Vue from 'vue';
import VueRouter from 'vue-router';

import { isEmpty } from '@/common/utils';

import userService from '@/api/user';

import store from '../store';
import { MUTATES } from '@/store/modules/app/const';
import { MODAL_TYPES, ROUTE_NAME } from '@/common/constants';

const PageNotFound = () => import('../views/PageNotFound');
const Manager = () => import('../views/CreateBook/Manager');
const PrintEdition = () => import('../views/CreateBook/PrintEdition');
const PrintMainScreen = () =>
  import('../views/CreateBook/PrintEdition/MainScreen');
const PrintEditScreen = () =>
  import('../views/CreateBook/PrintEdition/EditScreen');
const DigitalMainScreen = () =>
  import('../views/CreateBook/DigitalEdition/MainScreen');
const DigitalEditScreen = () =>
  import('../views/CreateBook/DigitalEdition/EditScreen');
const DigitalEdition = () => import('../views/CreateBook/DigitalEdition');
const Login = () => import('@/views/TempLogin');

Vue.use(VueRouter);

const authGuard = {
  beforeEnter: (to, from, next) => {
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
  }
};

const routes = [
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/',
    // TODO: remove once integrated with API
    redirect: '/book/1719/edit/manager',
    ...authGuard
  },
  {
    path: '/book/:bookId/edit/manager',
    name: ROUTE_NAME.MANAGER,
    component: Manager,
    ...authGuard
  },
  {
    path: '/book/:bookId/edit/print',
    component: PrintEdition,
    children: [
      {
        path: '/',
        name: ROUTE_NAME.PRINT,
        component: PrintMainScreen,
        ...authGuard
      },
      {
        path: 'edit-screen',
        name: ROUTE_NAME.PRINT_EDIT,
        component: PrintEditScreen,
        ...authGuard
      }
    ]
  },
  {
    path: '/book/:bookId/edit/digital',
    component: DigitalEdition,
    children: [
      {
        path: '/',
        name: ROUTE_NAME.DIGITAL,
        component: DigitalMainScreen,
        ...authGuard
      },
      {
        path: 'edit-screen',
        name: ROUTE_NAME.DIGITAL_EDIT,
        component: DigitalEditScreen,
        ...authGuard
      }
    ]
  },
  { path: '*', component: PageNotFound }
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
});

window.popStateDetected = false;
window.addEventListener('popstate', () => {
  window.popStateDetected = true;
});

router.beforeEach((to, from, next) => {
  const isBackFromBrowser = window.popStateDetected;
  if (isBackFromBrowser) {
    if (store.state.app.modal.isOpen) {
      store.commit(MUTATES.TOGGLE_MODAL, {
        isOpenModal: false
      });
    }

    if (store.state.app.isPrompt) {
      store.commit(MUTATES.SET_IS_PROMPT, {
        isPrompt: false
      });
    }
  }

  if (to.name === ROUTE_NAME.MANAGER) {
    next();

    return;
  }

  const sections = store.state.book?.sections;

  if (isEmpty(sections)) {
    next();

    return;
  }

  const emptySections = Object.values(sections).filter(
    ({ sheetIds }) => sheetIds.length === 0
  );

  if (from.name !== ROUTE_NAME.MANAGER || emptySections.length === 0) {
    next();

    return;
  }

  store.commit(MUTATES.TOGGLE_MODAL, {
    isOpenModal: true,
    modalData: {
      type: MODAL_TYPES.EMPTY_SECTION,
      props: { sections: emptySections }
    }
  });
});
export default router;
