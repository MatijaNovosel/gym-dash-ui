import Home from '../views/Home.vue'
import Membership from '../views/Membership.vue'
import Equipment from '../views/Equipment.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import AdminPanel from '../views/AdminPanel.vue'
import UserProfile from '../views/UserProfile.vue'
import routeNames from "./routeNames";

const routes = [
  {
    path: '/',
    name: routeNames.HOME,
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/membership',
    name: routeNames.MEMBERSHIP,
    component: Membership,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/equipment',
    name: routeNames.EQUIPMENT,
    component: Equipment,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/admin-panel',
    name: routeNames.ADMIN_PANEL,
    component: AdminPanel,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/user-profile',
    name: routeNames.USER_PROFILE,
    component: UserProfile,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/login',
    name: routeNames.LOGIN,
    component: Login,
    meta: {
      guest: true
    }
  },
  {
    path: '/register',
    name: routeNames.REGISTER,
    component: Register,
    meta: {
      guest: true
    }
  }
]

export default routes;