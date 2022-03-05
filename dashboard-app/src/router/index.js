import { createRouter, createWebHistory } from "vue-router";
import axios from "../../../shared/axios.js";
import DashboardView from "../views/DashboardView.vue";

const routes = [
  {
    path: "/dashboard",
    name: "home",
    component: DashboardView,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: "/dashboard/login",
    name: "login",
    component: () => import("../views/LoginView.vue"),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: "/dashboard/register",
    name: "register",
    component: () => import("../views/RegisterView.vue"),
    meta: {
      requiresAuth: false
    }
  },
  {
    path: "/dashboard/controls",
    name: "controls",
    component: () => import("../views/ControlsView.vue"),
    meta: {
      requiresAuth: true
    }
  }
];

const router = createRouter({
  BASE_URL: process.env.NODE_ENV === "production" ? "/dashboard/" : "/",
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
