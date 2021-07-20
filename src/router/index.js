import Vue from 'vue';
import VueRouter from 'vue-router';

const PageNotFound = () => import('@/views/PageNotFound');
const Manager = () => import('@/views/CreateBook/Manager');
const PrintEdition = () => import('@/views/CreateBook/PrintEdition');
const PrintMainScreen = () =>
  import('@/views/CreateBook/PrintEdition/MainScreen');
const PrintEditScreen = () =>
  import('@/views/CreateBook/PrintEdition/EditScreen');
const DigitalMainScreen = () =>
  import('@/views/CreateBook/DigitalEdition/MainScreen');
const DigitalEditScreen = () =>
  import('@/views/CreateBook/DigitalEdition/EditScreen');
const DigitalEdition = () => import('@/views/CreateBook/DigitalEdition');
const Login = () => import('@/views/TempLogin');

import { ROUTE_NAME } from '@/common/constants';
import authGuard from './guards/authGuard';
import {
  beforeEnterGuard,
  closeModalsOnPopState,
  setActiveEditionByRoute,
  showEmptySectionPrompt
} from './utils';

Vue.use(VueRouter);

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
    ...beforeEnterGuard(authGuard)
  },
  {
    path: '/book/:bookId/edit/manager',
    name: ROUTE_NAME.MANAGER,
    component: Manager,
    ...beforeEnterGuard(authGuard)
  },
  {
    path: '/book/:bookId/edit/print',
    component: PrintEdition,
    children: [
      {
        path: '/',
        name: ROUTE_NAME.PRINT,
        component: PrintMainScreen,
        ...beforeEnterGuard(authGuard)
      },
      {
        path: 'edit-screen',
        name: ROUTE_NAME.PRINT_EDIT,
        component: PrintEditScreen,
        ...beforeEnterGuard(authGuard)
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
        ...beforeEnterGuard(authGuard)
      },
      {
        path: 'edit-screen',
        name: ROUTE_NAME.DIGITAL_EDIT,
        component: DigitalEditScreen,
        ...beforeEnterGuard(authGuard)
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
  window.popStateDetected && closeModalsOnPopState();

  setActiveEditionByRoute(to.name);

  if (to.name === ROUTE_NAME.MANAGER) {
    next();

    return;
  }

  if (showEmptySectionPrompt()) {
    return;
  }

  next();
});

export default router;
