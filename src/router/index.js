import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/zuordnen',
    name: 'treatment-assignment',
    component: () => import('../views/TreatmentAssignmentView')
  },
  {
    path: '/anmelden',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/benutzerverwaltung',
    name: 'userManagement',
    component: () => import('../views/UserManagementView.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
