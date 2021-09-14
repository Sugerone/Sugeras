import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home'
import MarkPage from '../components/MarkPage.vue'
import AllPage from '../components/AllPage.vue'
import Login from '../components/Login.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login
  },
  {
    path: '/MarkPage',
    name: 'MarkPage',
    components: {
      default: MarkPage,
      Home: MarkPage
    }
  },
  {
    path: '/AllPage',
    name: 'AllPage',
    component: AllPage
  }
]

const router = createRouter({
  // history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  var userInfo = window.localStorage.getItem('token');
  if (to.path == '/Login') {
    if (userInfo) {
      next({ name: 'Home' });
    }
    else {
      next();
    }
  }
  else {
    if (userInfo) {
      next();
    }
    else {
        next({name:'Login'});
    }
  }

})

export default router
