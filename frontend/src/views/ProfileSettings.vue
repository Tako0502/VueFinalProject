<script setup>
/**
 * ProfileSettings.vue - User Profile Settings
 */
import { ref, reactive, inject } from 'vue'
import { useUserStore } from '@/stores/userStore'
import BaseInput from '@/components/BaseInput.vue'

const userStore = useUserStore()
const showNotification = inject('showNotification', () => {})

// Reactive form data
const form = reactive({
  name: userStore.user.name || '',
  email: userStore.user.email || ''
})

const errors = ref({
  name: '',
  email: ''
})

const isSaving = ref(false)

// Validation
const validateForm = () => {
  let isValid = true
  errors.value = { name: '', email: '' }
  
  if (!form.name.trim()) {
    errors.value.name = 'Name is required'
    isValid = false
  } else if (form.name.length < 2) {
    errors.value.name = 'Name must be at least 2 characters'
    isValid = false
  }
  
  if (!form.email.trim()) {
    errors.value.email = 'Email is required'
    isValid = false
  } else if (!form.email.includes('@')) {
    errors.value.email = 'Please enter a valid email'
    isValid = false
  }
  
  return isValid
}

// Save profile
const handleSave = async () => {
  if (!validateForm()) return
  
  isSaving.value = true
  
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    
    userStore.updateProfile({
      name: form.name.trim(),
      email: form.email.trim()
    })
    
    showNotification('Profile updated successfully!', 'success')
  } catch (error) {
    showNotification('Failed to update profile', 'error')
  } finally {
    isSaving.value = false
  }
}

// Reset form
const handleReset = () => {
  form.name = userStore.user.name || ''
  form.email = userStore.user.email || ''
  errors.value = { name: '', email: '' }
}
</script>

<template>
  <div class="profile-settings">
    <h2 class="section-title">Profile Information</h2>
    <p class="section-description">
      Update your personal information
    </p>

    
    <form @submit.prevent="handleSave" class="profile-form">
      
      <div class="avatar-section">
        <div class="avatar">
          {{ form.name.charAt(0).toUpperCase() || '👤' }}
        </div>
        <div class="avatar-info">
          <span class="avatar-name">{{ form.name || 'Your Name' }}</span>
          <span class="avatar-email">{{ form.email || 'your@email.com' }}</span>
        </div>
      </div>

      <!-- Name Input -->
      <BaseInput
        v-model="form.name"
        label="Full Name"
        placeholder="Enter your name"
        icon="👤"
        :error="errors.name"
        :required="true"
      />

      <!-- Email Input -->
      <BaseInput
        v-model="form.email"
        type="email"
        label="Email Address"
        placeholder="you@example.com"
        icon="📧"
        :error="errors.email"
        :required="true"
      />

      <!-- Form Actions -->
      <div class="form-actions">
        <button 
          type="button" 
          class="btn-reset"
          @click="handleReset"
        >
          Reset
        </button>
        <button 
          type="submit" 
          class="btn-save"
          :disabled="isSaving"
        >
          <span v-if="isSaving">Saving...</span>
          <span v-else>Save Changes</span>
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* Scoped CSS */
.section-title {
  font-size: 1.25rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.section-description {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.profile-form {
  max-width: 500px;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-color), #a855f7);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  color: white;
  font-weight: 600;
}

.avatar-name {
  display: block;
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.avatar-email {
  display: block;
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.btn-reset {
  padding: 0.75rem 1.5rem;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);
}

.btn-reset:hover {
  border-color: var(--text-secondary);
}

.btn-save {
  flex: 1;
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.btn-save:hover:not(:disabled) {
  background: var(--primary-hover);
}

.btn-save:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
