import Vue from 'vue';
import VueRouter from 'vue-router';

import moduleCreateBook from '@/views/CreateBook/routes';
import store from '../store';

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

export default router;
