import Home from '../views/Home.vue'
import Membership from '../views/Membership.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import routeNames from "./routeNames";

const routes = [
  {
    path: '/',
    name: routeNames.HOME,
    component: Home
  },
  {
    path: '/membership',
    name: routeNames.MEMBERSHIP,
    component: Membership
  },
  {
    path: '/login',
    name: routeNames.LOGIN,
    component: Login
  },
  {
    path: '/register',
    name: routeNames.REGISTER,
    component: Register
  }
]

export default routes;