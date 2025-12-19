<script setup>
/**
 * NotFound.vue - 404 Page
 */
import { useRouter } from 'vue-router'
import { Home, ArrowLeft, Calendar, Settings } from 'lucide-vue-next'

const router = useRouter()

const goHome = () => {
  router.push('/dashboard')
}

const goBack = () => {
  router.back()
}
</script>

<template>
  <div class="not-found">
    <div class="not-found-content">
      <!-- 404 Illustration -->
      <div class="error-code">
        <span class="digit">4</span>
        <span class="digit zero">0</span>
        <span class="digit">4</span>
      </div>
      
      <h1 class="error-title">Page Not Found</h1>
      <p class="error-message">
        Oops! The page you're looking for doesn't exist or has been moved.
      </p>

      <!-- Actions -->
      <div class="actions">
        <button @click="goHome" class="btn-primary">
          <Home :size="18" />
          Go to Dashboard
        </button>
        <button @click="goBack" class="btn-secondary">
          <ArrowLeft :size="18" />
          Go Back
        </button>
      </div>

      <!-- Helpful Links -->
      <div class="helpful-links">
        <p>Or try these pages:</p>
        <div class="links">
          <router-link to="/planner">
            <Calendar :size="16" />
            Planner
          </router-link>
          <router-link to="/settings">
            <Settings :size="16" />
            Settings
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scoped CSS with animations */
.not-found {
  min-height: 70vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
}

.not-found-content {
  max-width: 500px;
}

.error-code {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
}

.digit {
  font-size: 6rem;
  font-weight: 800;
  background: linear-gradient(135deg, var(--primary-color), #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: pulse 2s ease-in-out infinite;
}

.digit.zero {
  animation-delay: 0.2s;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.8;
  }
}

.error-title {
  font-size: 2rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.error-message {
  color: var(--text-secondary);
  font-size: 1.1rem;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.btn-primary {
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, var(--primary-color), #a855f7);
  color: white;
  border: none;
  border-radius: var(--radius);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(99, 102, 241, 0.4);
}

.btn-secondary {
  padding: 0.875rem 1.5rem;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-secondary:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.helpful-links {
  padding-top: 2rem;
  border-top: 1px solid var(--border-color);
}

.helpful-links p {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.links {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
}

.links a {
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
  transition: var(--transition);
}

.links a:hover {
  color: var(--primary-hover);
}
</style>
