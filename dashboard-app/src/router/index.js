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
  },
  {
    path: "/:pathMatch(.*)*",
    name: "notFound",
    component: () => import("../views/notFound.vue"),
    meta: {
      requiresAuth: false
    }
  }
];

const router = createRouter({
  BASE_URL: process.env.NODE_ENV === "production" ? "/dashboard" : "/",
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  try {
    const data = await axios.get("/dashboard/auth/check");
    if (!data.data.authorized && to.meta.requiresAuth) {
      next("/dashboard/login");
    } else {
      next();
    }
  } catch {
    next();
  }
});
export default router;
