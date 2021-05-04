import Vue from "vue";
import VueRouter from "vue-router";

import moduleCreateBook from "@/views/CreateBook/routes";
// import store from "../store";

// const Home = () => import("../views/Home");
const Login = () => import("../views/Login");
const Icon = () => import("../views/Icon");
const PageNotFound = () => import("../views/PageNotFound");
const Modal = () => import("../views/Modal");
const Error = () => import("../views/Error");
const Manager = () => import("../views/CreateBook/Manager");

Vue.use(VueRouter);

const authGuard = {
  beforeEnter: (to, _, next) => {
    const redirect = () => {
      next();
      // if (store.state.auth.token) {
      //   if (to.path === "/login") {
      //     next("/");
      //   } else {
      //     next();
      //   }
      // } else {
      //   next("/login");
      // }
    };
    redirect();
  }
};

const routes = [
  {
    path: "/",
    redirect: "/create-book/manager",
    component: Login,
    ...authGuard
  },
  {
    path: "/create-book",
    redirect: "/create-book/manager",
    component: Manager,
    ...authGuard
  },
  { path: "/login", component: Login },
  { path: "/icon", component: Icon, ...authGuard },
  { path: "/modal", component: Modal, ...authGuard },
  { path: "/error", component: Error },
  { path: "*", component: PageNotFound }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [...routes, ...moduleCreateBook],
  scrollBehavior() {
    return { x: 0, y: 0 };
  }
});

export default router;
