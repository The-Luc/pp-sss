import Vue from 'vue';
import VueRouter from 'vue-router';

import store from '../store';
import { MUTATES } from '@/store/modules/app/const';
import { MODAL_TYPES, ROUTE_NAME } from '@/common/constants';
import { ENV_CONFIG } from '@/common/constants/config';

const PageNotFound = () => import('../views/PageNotFound');
const Manager = () => import('../views/CreateBook/Manager');
const PrintEdition = () => import('../views/CreateBook/PrintEdition');
const PrintMainScreen = () =>
  import('../views/CreateBook/PrintEdition/MainScreen');
const PrintEditScreen = () =>
  import('../views/CreateBook/PrintEdition/EditScreen');
const DigitalMainScreen = () =>
  import('../views/CreateBook/DigitalEdition/MainScreen');
const DigitalEdition = () => import('../views/CreateBook/DigitalEdition');

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
    redirect: `/book/${ENV_CONFIG.BOOK_ID}/edit/manager`,
    ...authGuard
  },
  {
    path: '/book/:bookId/edit/manager',
    name: ROUTE_NAME.MANAGER,
    component: Manager
  },
  {
    path: '/book/:bookId/edit/print',
    component: PrintEdition,
    children: [
      {
        path: '/',
        name: ROUTE_NAME.PRINT,
        component: PrintMainScreen
      },
      {
        path: 'edit-screen',
        name: ROUTE_NAME.PRINT_EDIT,
        component: PrintEditScreen
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
        component: DigitalMainScreen
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

router.beforeEach(async (to, from, next) => {
  if (to.name !== ROUTE_NAME.MANAGER) {
    const sections = store.state.book.book?.sections;
    const emptySections = sections.filter(item => item.sheets?.length === 0);
    if (emptySections.length !== 0) {
      if (from.name !== ROUTE_NAME.MANAGER) {
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
