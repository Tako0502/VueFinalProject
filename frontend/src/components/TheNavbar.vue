<script setup>
/**
 * TheNavbar.vue - Navigation Component
 * [REQ 2] Demonstrates Props and component structure
 * [REQ 1] Uses v-if for conditional rendering based on auth state
 */
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { Target, LayoutDashboard, Calendar, Settings, LogOut } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// Initialize store on mount
userStore.initialize()

// [REQ 3] Computed property for checking authentication
const isLoggedIn = computed(() => userStore.isAuthenticated)
const userName = computed(() => userStore.user.name || 'Guest')

// Navigation items with icon components
const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { name: 'Planner', path: '/planner', icon: Calendar },
  { name: 'Settings', path: '/settings', icon: Settings }
]

// Check if current route matches nav item
const isActive = (path) => {
  return route.path.startsWith(path)
}

// Handle logout
const handleLogout = () => {
  userStore.logout()
  router.push('/login')
}
</script>

<template>
  <!-- [REQ 1] v-bind for dynamic class binding -->
  <nav class="navbar" :class="{ 'navbar--scrolled': true }">
    <div class="navbar__container">
      <!-- Logo -->
      <router-link to="/dashboard" class="navbar__logo">
        <Target class="logo-icon" :size="24" />
        <span class="logo-text">LifeOS</span>
      </router-link>

      <!-- [REQ 1] v-if/else for conditional rendering -->
      <template v-if="isLoggedIn">
        <!-- Navigation Links -->
        <ul class="navbar__nav">
          <!-- [REQ 1] v-for for iterating over nav items -->
          <li 
            v-for="item in navItems" 
            :key="item.path"
            class="navbar__item"
          >
            <!-- [REQ 1] v-bind (:class) for dynamic classes -->
            <router-link 
              :to="item.path"
              class="navbar__link"
              :class="{ 'navbar__link--active': isActive(item.path) }"
            >
              <component :is="item.icon" class="nav-icon" :size="18" />
              <span class="nav-text">{{ item.name }}</span>
            </router-link>
          </li>
        </ul>

        <!-- User Menu -->
        <div class="navbar__user">
          <span class="user-greeting">Hi, {{ userName }}</span>
          <!-- [REQ 1] v-on (@click) for event handling -->
          <button @click="handleLogout" class="btn-logout">
            <LogOut :size="16" />
            <span>Logout</span>
          </button>
        </div>
      </template>

      <!-- Not logged in state -->
      <template v-else>
        <router-link to="/login" class="navbar__login-btn">
          Login
        </router-link>
      </template>
    </div>
  </nav>
</template>

<style scoped>
/* [REQ 9] Scoped CSS */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 64px;
  background: rgba(30, 41, 59, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--border-color);
  z-index: 1000;
  transition: var(--transition);
}

.navbar__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.navbar__logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
  color: var(--text-primary);
  font-weight: 700;
  font-size: 1.25rem;
}

.logo-icon {
  font-size: 1.5rem;
}

.logo-text {
  background: linear-gradient(135deg, var(--primary-color), #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.navbar__nav {
  display: flex;
  list-style: none;
  gap: 0.5rem;
}

.navbar__link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: var(--radius);
  color: var(--text-secondary);
  text-decoration: none;
  transition: var(--transition);
}

.navbar__link:hover {
  color: var(--text-primary);
  background: var(--surface-hover);
}

.navbar__link--active {
  color: var(--primary-color);
  background: rgba(99, 102, 241, 0.15);
}

.nav-icon {
  font-size: 1.1rem;
}

.navbar__user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-greeting {
  color: var(--text-secondary);
  font-size: 0.9rem;
}

.btn-logout {
  padding: 0.5rem 1rem;
  background: transparent;
  border: 1px solid var(--danger-color);
  color: var(--danger-color);
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-logout:hover {
  background: var(--danger-color);
  color: white;
}

.navbar__login-btn {
  padding: 0.5rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border-radius: var(--radius);
  text-decoration: none;
  transition: var(--transition);
}

.navbar__login-btn:hover {
  background: var(--primary-hover);
}

/* Responsive */
@media (max-width: 768px) {
  .nav-text {
    display: none;
  }
  
  .user-greeting {
    display: none;
  }
}
</style>
