<script setup>
/**
 * App.vue - Root Component
 * Contains the main layout structure with navigation and router view
 */
import { provide, ref } from 'vue'
import TheNavbar from '@/components/TheNavbar.vue'
import NotificationToast from '@/components/NotificationToast.vue'

// [REQ 3] Using ref for reactive state
// Global notification state - provided to all child components
const notification = ref({
  show: false,
  message: '',
  type: 'info' // 'success', 'error', 'warning', 'info'
})

// Function to show notifications from anywhere in the app
const showNotification = (message, type = 'info') => {
  notification.value = { show: true, message, type }
  // Auto-hide after 3 seconds
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

// Provide notification function to all child components
provide('showNotification', showNotification)
</script>

<template>
  <div class="app-container">
    <!-- [REQ 2] TheNavbar component -->
    <TheNavbar />
    
    <!-- Main content area with router view -->
    <main class="main-content">
      <!-- [REQ 5] RouterView for displaying matched route components -->
      <RouterView v-slot="{ Component }">
        <!-- [REQ 9] Fade transition for route changes -->
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    
    <!-- [REQ 2] NotificationToast component with props and emits -->
    <!-- [REQ 1] v-if directive for conditional rendering -->
    <NotificationToast
      v-if="notification.show"
      :message="notification.message"
      :type="notification.type"
      @close="notification.show = false"
    />
  </div>
</template>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  padding: 2rem;
  padding-top: 5rem; /* Account for fixed navbar */
}
</style>
