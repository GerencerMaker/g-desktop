import { createMemoryHistory, createRouter, RouteRecordRaw } from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/home' },
  { path: '/login', component: Login },
  { path: '/home', component: Home, meta: { requiresAuth: true } }
];

const router = createRouter({
  history: createMemoryHistory(),
  routes
});


router.beforeEach((to, _, next) => {
  const isAuthenticated = !!localStorage.getItem('token');
  if (to.meta.requiresAuth && !isAuthenticated) {
    next('/login')
  } else if (to.path === '/login' && isAuthenticated) {
    next('/home')
  } else {
    next()
  }
});

export default router
