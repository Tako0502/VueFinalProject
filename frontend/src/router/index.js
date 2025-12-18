/**
 * Vue Router Configuration
 * [REQ 5] Demonstrates:
 * - Lazy loading for pages
 * - Static route: /dashboard
 * - Dynamic route: /planner/:date
 * - Nested routes: /settings/profile and /settings/preferences
 * - Global Navigation Guard with token check
 * - 404 Page
 */
import { createRouter, createWebHistory } from 'vue-router'



const LoginView = () => import('@/views/LoginView.vue')
const DashboardView = () => import('@/views/DashboardView.vue')
const PlannerView = () => import('@/views/PlannerView.vue')
const PlannerDetail = () => import('@/views/PlannerDetail.vue')
const SettingsView = () => import('@/views/SettingsView.vue')
const ProfileSettings = () => import('@/views/ProfileSettings.vue')
const PreferencesSettings = () => import('@/views/PreferencesSettings.vue')
const NotFound = () => import('@/views/NotFound.vue')

const routes = [
    {
        path: '/',
        redirect: '/dashboard'
    },
    {
        path: '/login',
        name: 'Login',
        component: LoginView,
        meta: { requiresAuth: false }
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: DashboardView,
        meta: { requiresAuth: true }
    },
    {
        path: '/planner',
        name: 'Planner',
        component: PlannerView,
        meta: { requiresAuth: true }
    },
    {
        path: '/planner/:date',
        name: 'PlannerDetail',
        component: PlannerDetail,
        meta: { requiresAuth: true },
        props: true
    },
    {
        
        path: '/settings',
        name: 'Settings',
        component: SettingsView,
        meta: { requiresAuth: true },
        
        redirect: '/settings/profile',
        
        children: [
            {
                
                path: 'profile',
                name: 'ProfileSettings',
                component: ProfileSettings
            },
            {
                
                path: 'preferences',
                name: 'PreferencesSettings',
                component: PreferencesSettings
            }
        ]
    },
    {
        
        
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    }
]

const router = createRouter({
    
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
        return { top: 0 }
    }
})

/**
 * [REQ 5] Global Navigation Guard
 * Checks for authentication token before entering protected routes
 * If no token is found, redirects to the login page
 */
router.beforeEach((to, from, next) => {
    
    const requiresAuth = to.meta.requiresAuth !== false

    
    const token = localStorage.getItem('lifeos_token')

    if (requiresAuth && !token) {
        
        
        next({
            name: 'Login',
            query: { redirect: to.fullPath }
        })
    } else if (to.name === 'Login' && token) {
        
        next({ name: 'Dashboard' })
    } else {
        
        next()
    }
})

export default router
