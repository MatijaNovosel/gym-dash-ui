import Home from '../views/Home.vue'
import Membership from '../views/Membership.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
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