<script setup>
import { provide, ref } from 'vue'
import TheNavbar from '@/components/TheNavbar.vue'
import NotificationToast from '@/components/NotificationToast.vue'

const notification = ref({
  show: false,
  message: '',
  type: 'info'
})

const showNotification = (message, type = 'info') => {
  notification.value = { show: true, message, type }
  setTimeout(() => {
    notification.value.show = false
  }, 3000)
}

provide('showNotification', showNotification)
</script>

<template>
  <div class="app-container">
    <TheNavbar />
    
    <main class="main-content">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    
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
  padding-top: 5rem;
}
</style>
