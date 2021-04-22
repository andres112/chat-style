import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import { auth } from "@/firebase";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
    meta: { requiresAuth: true },
  },
  {
    path: "/user",
    name: "User",
    component: () => import(/* webpackChunkName: "user" */ "../views/User.vue"),
  },
  {
    path: "/calibration",
    name: "Calibration",
    component: () => import(/* webpackChunkName: "user" */ "../views/calibration.vue"),
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  const currentUser = auth.currentUser;
  if (to.matched.some((x) => x.meta.requiresAuth)) {
    if (currentUser) {
      next();
    } else {
      next("/user");
    }
  } else {
    next();
  }
});

export default router;
