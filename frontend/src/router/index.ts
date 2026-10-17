// Vue
import { createRouter, createWebHistory } from "vue-router";

// Types
import type { UserRole } from "../types";

// Views
import LoginView from "../views/LoginView.vue";
import RequesterView from "../views/RequesterView.vue";
import TeamPlanningView from "../views/TeamPlanningView.vue";
import ValidatorView from "../views/ValidatorView.vue";

// Composables
import { homePathForRole, useAuth } from "../composables/useAuth";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/login", component: LoginView, meta: { public: true } },
    {
      path: "/requests",
      component: RequesterView,
      meta: { roles: ["Requester"] },
    },
    {
      path: "/review",
      component: ValidatorView,
      meta: { roles: ["Validator"] },
    },
    {
      path: "/team",
      component: TeamPlanningView,
      meta: { roles: ["Requester", "Validator"] },
    },
    { path: "/", redirect: "/login" },
  ],
});

router.beforeEach((to) => {
  const { user, isLoggedIn } = useAuth();

  if (to.meta.public) {
    if (isLoggedIn.value && user.value) {
      return homePathForRole(user.value.role);
    }
    return true;
  }

  if (!isLoggedIn.value || !user.value) {
    return "/login";
  }

  const roles = to.meta.roles as UserRole[] | undefined;
  if (roles && !roles.includes(user.value.role)) {
    return homePathForRole(user.value.role);
  }

  return true;
});

export default router;
