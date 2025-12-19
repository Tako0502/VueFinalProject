<script setup>
/**
 * SettingsView.vue - Settings Parent View
 */
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div class="settings-view">
    <!-- Settings Header -->
    <header class="settings-header">
      <h1 class="page-title">⚙️ Settings</h1>
      <p class="page-subtitle">Manage your account and preferences</p>
    </header>

    <!-- Settings Navigation -->
    <nav class="settings-nav">
      <router-link 
        to="/settings/profile" 
        class="nav-tab"
        :class="{ active: route.path === '/settings/profile' }"
      >
        👤 Profile
      </router-link>
      <router-link 
        to="/settings/preferences" 
        class="nav-tab"
        :class="{ active: route.path === '/settings/preferences' }"
      >
        🎨 Preferences
      </router-link>
    </nav>

    <div class="settings-content">
      <RouterView />
    </div>
  </div>
</template>

<style scoped>
/* Scoped CSS */
.settings-view {
  max-width: 800px;
  margin: 0 auto;
}

.settings-header {
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.75rem;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.page-subtitle {
  color: var(--text-secondary);
}

.settings-nav {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 2rem;
  padding: 0.5rem;
  background: var(--surface-color);
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
}

.nav-tab {
  flex: 1;
  padding: 0.75rem 1rem;
  text-align: center;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 8px;
  transition: var(--transition);
}

.nav-tab:hover {
  color: var(--text-primary);
  background: var(--surface-hover);
}

.nav-tab.active {
  color: white;
  background: var(--primary-color);
}

.settings-content {
  background: var(--surface-color);
  border-radius: var(--radius);
  padding: 2rem;
  border: 1px solid var(--border-color);
}
</style>
