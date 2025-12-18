<script setup>
const props = defineProps({

  message: {
    type: String,
    required: true
  },

  type: {
    type: String,
    default: 'info',
    validator: (value) => ['success', 'error', 'warning', 'info'].includes(value)
  },

  duration: {
    type: Number,
    default: 3000
  }
})

const emit = defineEmits(['close'])

const icons = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️'
}

const handleClose = () => {
  emit('close')
}
</script>

<template>
  <div class="toast" :class="`toast--${type}`">
    <span class="toast-icon">{{ icons[type] }}</span>
    <p class="toast-message">{{ message }}</p>
    <button class="toast-close" @click="handleClose">
      ✕
    </button>
  </div>
</template>

<style scoped>
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
