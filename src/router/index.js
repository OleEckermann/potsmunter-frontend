import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/zuordnen',
    name: 'home'
  },
  {
    path: '/zuordnen',
    name: 'treatmentAssignment',
    component: () => import('../views/TreatmentAssignmentView')
  },
  {
    path: '/anmelden',
    name: 'login',
    component: () => import('../views/LoginView.vue')
  },
  {
    path: '/berichte',
    name: 'reports',
    component: () => import('../views/ReportsView.vue')
  },
  {
    path: '/benutzerverwaltung',
    name: 'userManagement',
    component: () => import('../views/UserManagementView.vue')
  },
  {
    path: '/importieren',
    name: 'import',
    component: () => import('../views/FileUploadView.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
