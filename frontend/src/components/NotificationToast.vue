<script setup>
/**
 * NotificationToast.vue - Toast Notification Component
 * [REQ 2] Demonstrates Props and Emits pattern
 * [REQ 9] Uses CSS transitions for fade in/out
 */

// ============================================
// [REQ 2] PROPS
// ============================================
const props = defineProps({
  // Message to display
  message: {
    type: String,
    required: true
  },
  // Type of notification (success, error, warning, info)
  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },
  // Duration in ms (0 = persistent)
  duration: {
    type: Number,
    default: 3000
  }
})

// ============================================
// [REQ 2] EMITS
// ============================================
const emit = defineEmits(['close'])

// Icons for each notification type
const icons = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️'
}

// Handle close
const handleClose = () => {
  emit('close')
}
</script>

<template>
  <!-- [REQ 9] Transition wrapper handled by parent component -->
  <!-- [REQ 1] v-bind (:class) for dynamic styling based on type -->
  <div class="toast" :class="`toast--${type}`">
    <!-- Icon -->
    <span class="toast-icon">{{ icons[type] }}</span>
    
    <!-- Message -->
    <p class="toast-message">{{ message }}</p>
    
    <!-- Close Button -->
    <!-- [REQ 1] v-on (@click) for event handling -->
    <button class="toast-close" @click="handleClose">
      ✕
    </button>
  </div>
</template>

<style scoped>
/* [REQ 9] Scoped CSS */
.toast {
  position: fixed;
  top: 80px;
  right: 20px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem 1.5rem;
  border-radius: var(--radius);
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
  z-index: 2000;
  min-width: 300px;
  max-width: 450px;
  
  /* [REQ 9] Animation */
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Type-specific styling */
.toast--success {
  border-left: 4px solid var(--secondary-color);
}

.toast--error {
  border-left: 4px solid var(--danger-color);
}

.toast--warning {
  border-left: 4px solid var(--warning-color);
}

.toast--info {
  border-left: 4px solid var(--primary-color);
}

.toast-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.toast-message {
  flex: 1;
  font-size: 0.9rem;
  color: var(--text-primary);
  line-height: 1.4;
}

.toast-close {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 50%;
  transition: var(--transition);
  flex-shrink: 0;
}

.toast-close:hover {
  background: var(--surface-hover);
  color: var(--text-primary);
}
</style>
