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

// [REQ 5] Lazy loading - components are loaded only when the route is visited
// This improves initial load performance by code-splitting
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
        // Login route - accessible without authentication
        path: '/login',
        name: 'Login',
        component: LoginView,
        meta: { requiresAuth: false }
    },
    {
        // [REQ 5] Static route: /dashboard
        path: '/dashboard',
        name: 'Dashboard',
        component: DashboardView,
        meta: { requiresAuth: true }
    },
    {
        // Planner overview
        path: '/planner',
        name: 'Planner',
        component: PlannerView,
        meta: { requiresAuth: true }
    },
    {
        // [REQ 5] Dynamic route: /planner/:date
        // The :date parameter captures the date from the URL
        // Example: /planner/2024-12-15 shows tasks for December 15, 2024
        path: '/planner/:date',
        name: 'PlannerDetail',
        component: PlannerDetail,
        meta: { requiresAuth: true },
        // Validate date format using route props
        props: true
    },
    {
        // [REQ 5] Nested routes: Parent settings route
        path: '/settings',
        name: 'Settings',
        component: SettingsView,
        meta: { requiresAuth: true },
        // Redirect to profile by default
        redirect: '/settings/profile',
        // Nested child routes
        children: [
            {
                // [REQ 5] Nested route: /settings/profile
                path: 'profile',
                name: 'ProfileSettings',
                component: ProfileSettings
            },
            {
                // [REQ 5] Nested route: /settings/preferences
                path: 'preferences',
                name: 'PreferencesSettings',
                component: PreferencesSettings
            }
        ]
    },
    {
        // [REQ 5] 404 Page - Catch-all route for unmatched paths
        // Must be placed last in the routes array
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: NotFound
    }
]

const router = createRouter({
    // Use HTML5 history mode for clean URLs (no hash)
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    // Scroll to top on route change
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
    // Check if the route requires authentication
    const requiresAuth = to.meta.requiresAuth !== false

    // Get the fake token from localStorage
    const token = localStorage.getItem('lifeos_token')

    if (requiresAuth && !token) {
        // No token found, redirect to login
        // Store the intended destination for redirect after login
        next({
            name: 'Login',
            query: { redirect: to.fullPath }
        })
    } else if (to.name === 'Login' && token) {
        // User is already logged in, redirect to dashboard
        next({ name: 'Dashboard' })
    } else {
        // Allow navigation
        next()
    }
})

export default router
