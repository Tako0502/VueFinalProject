<script setup>
/**
 * LoginView.vue - Login/Register Page
 * [REQ 5] Navigation guard redirect destination
 * [REQ 7] Form with validation
 */
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import BaseInput from '@/components/BaseInput.vue'
import { Target, User, Mail, Lock } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

// Toggle between login and register mode
const isRegisterMode = ref(false)

// [REQ 3] Reactive form data
const form = reactive({
  name: '',
  email: '',
  password: ''
})

// [REQ 3] Ref for errors and loading
const errors = ref({
  name: '',
  email: '',
  password: ''
})
const isLoading = ref(false)
const formError = ref('')

// [REQ 7] Validate form
const validateForm = () => {
  let isValid = true
  errors.value = { name: '', email: '', password: '' }
  
  if (isRegisterMode.value && !form.name.trim()) {
    errors.value.name = 'Name is required'
    isValid = false
  }
  
  if (!form.email.trim()) {
    errors.value.email = 'Email is required'
    isValid = false
  } else if (!form.email.includes('@')) {
    errors.value.email = 'Please enter a valid email'
    isValid = false
  }
  
  if (!form.password) {
    errors.value.password = 'Password is required'
    isValid = false
  } else if (form.password.length < 4) {
    errors.value.password = 'Password must be at least 4 characters'
    isValid = false
  }
  
  return isValid
}

// Handle form submission (login or register)
const handleSubmit = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  formError.value = ''
  
  try {
    let success
    
    if (isRegisterMode.value) {
      // Register new user
      success = await userStore.register({
        name: form.name,
        email: form.email,
        password: form.password
      })
    } else {
      // Login existing user
      success = await userStore.login({
        email: form.email,
        password: form.password
      })
    }
    
    if (success) {
      // Redirect to intended destination or dashboard
      const redirectPath = route.query.redirect || '/dashboard'
      router.push(redirectPath)
    } else {
      formError.value = userStore.error || 'Authentication failed. Please try again.'
    }
  } catch (error) {
    formError.value = error.message || 'An error occurred. Please try again.'
  } finally {
    isLoading.value = false
  }
}

// Toggle between login and register
const toggleMode = () => {
  isRegisterMode.value = !isRegisterMode.value
  formError.value = ''
  errors.value = { name: '', email: '', password: '' }
}
</script>

<template>
  <div class="login-view">
    <div class="login-container">
      <!-- Logo -->
      <div class="login-header">
        <div class="logo">
          <Target class="logo-icon" :size="40" />
          <h1 class="logo-text">LifeOS</h1>
        </div>
        <p class="tagline">Your Personal Productivity Dashboard</p>
      </div>

      <!-- Login/Register Form -->
      <div class="login-card">
        <h2 class="card-title">{{ isRegisterMode ? 'Create Account' : 'Welcome Back' }}</h2>
        <p class="card-subtitle">
          {{ isRegisterMode ? 'Sign up to get started' : 'Sign in to continue to your dashboard' }}
        </p>

        <!-- [REQ 1] v-on for form submit -->
        <form @submit.prevent="handleSubmit" class="login-form">
          <!-- [REQ 1] v-if for error display -->
          <div v-if="formError" class="alert alert-error">
            {{ formError }}
          </div>

          <!-- Name Input (for registration) -->
          <BaseInput
            v-if="isRegisterMode"
            v-model="form.name"
            label="Full Name"
            placeholder="Your name"
            :icon="User"
            :error="errors.name"
            :required="true"
          />

          <!-- Email Input -->
          <BaseInput
            v-model="form.email"
            type="email"
            label="Email"
            placeholder="you@university.edu"
            :icon="Mail"
            :error="errors.email"
            :required="true"
          />

          <!-- Password Input -->
          <BaseInput
            v-model="form.password"
            type="password"
            label="Password"
            placeholder="••••••••"
            :icon="Lock"
            :error="errors.password"
            :required="true"
          />

          <!-- Submit Button -->
          <button 
            type="submit" 
            class="btn-login"
            :disabled="isLoading"
          >
            <span v-if="isLoading" class="loading-spinner"></span>
            <span v-else>{{ isRegisterMode ? 'Create Account' : 'Sign In' }}</span>
          </button>
        </form>

        <!-- Toggle Login/Register -->
        <p class="toggle-mode">
          {{ isRegisterMode ? 'Already have an account?' : "Don't have an account?" }}
          <button type="button" @click="toggleMode" class="toggle-btn">
            {{ isRegisterMode ? 'Sign In' : 'Sign Up' }}
          </button>
        </p>
      </div>

      <!-- Footer -->
      <p class="login-footer">
        LifeOS - Student Productivity Dashboard
      </p>
    </div>
  </div>
</template>

<style scoped>
/* [REQ 9] Scoped CSS */
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: radial-gradient(ellipse at top, rgba(99, 102, 241, 0.15), transparent),
              radial-gradient(ellipse at bottom, rgba(168, 85, 247, 0.1), transparent);
}

.login-container {
  width: 100%;
  max-width: 420px;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.logo-icon {
  color: var(--primary-color);
}

.logo-text {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--primary-color), #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.tagline {
  color: var(--text-secondary);
  font-size: 1rem;
}

.login-card {
  background: var(--surface-color);
  border-radius: var(--radius);
  padding: 2rem;
  border: 1px solid var(--border-color);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.card-title {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  text-align: center;
}

.card-subtitle {
  color: var(--text-secondary);
  font-size: 0.9rem;
  text-align: center;
  margin-bottom: 1.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.alert {
  padding: 0.75rem 1rem;
  border-radius: var(--radius);
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.alert-error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--danger-color);
  color: var(--danger-color);
}

.btn-login {
  width: 100%;
  padding: 1rem;
  background: linear-gradient(135deg, var(--primary-color), #a855f7);
  color: white;
  border: none;
  border-radius: var(--radius);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
}

.btn-login:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.toggle-mode {
  text-align: center;
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.toggle-btn {
  background: none;
  border: none;
  color: var(--primary-color);
  font-weight: 600;
  cursor: pointer;
  margin-left: 0.25rem;
  transition: var(--transition);
}

.toggle-btn:hover {
  color: var(--primary-hover);
  text-decoration: underline;
}

.login-footer {
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.8rem;
  margin-top: 2rem;
}
</style>
