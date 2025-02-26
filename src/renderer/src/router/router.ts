import { createMemoryHistory, createRouter, RouteRecordRaw } from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

const routes: Array<RouteRecordRaw> = [
  { path: '/', redirect: '/home' },
  { path: '/login', component: Login },
  { path: '/home', component: Home }
]

const router = createRouter({
  history: createMemoryHistory(),
  routes
})

export default router
