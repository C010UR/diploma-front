import { createRouter, createWebHistory } from "vue-router";
import axios from "../../../shared/axios.js";
import DashboardView from "../views/DashboardView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: DashboardView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/login",
    name: "login",
    component: () => import(/* webpackChunkName: "about" */ "../views/LoginView.vue"),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: "/register",
    name: "register",
    component: () => import(/* webpackChunkName: "about" */ "../views/RegisterView.vue"),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: "/controls",
    name: "controls",
    component: () => import(/* webpackChunkName: "about" */ "../views/ControlsView.vue"),
    meta: {
      requiresAuth: true
    }
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  try {
    const data = await axios.get("/dashboard/auth/check");
    if (!data.data.authorized) {
      if (to.meta.requiresAuth) {
        next("/login");
      } else {
        next();
      }
    } else if (to.meta.requiresAuth) {
      next();
    } else {
      next("/");
    }
  } catch {
    next();
  }
});
export default router;
