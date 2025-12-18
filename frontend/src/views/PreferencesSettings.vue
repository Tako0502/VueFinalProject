<script setup>
/**
 * PreferencesSettings.vue - App Preferences Settings
 * [REQ 5] Nested route: /settings/preferences
 */
import { ref, inject } from 'vue'
import { useUserStore } from '@/stores/userStore'
import BaseInput from '@/components/BaseInput.vue'

const userStore = useUserStore()
const showNotification = inject('showNotification', () => {})

// Budget limit input
const budgetLimit = ref(userStore.budgetLimit)
const budgetError = ref('')

// Validate and save budget
const updateBudget = () => {
  const limit = parseFloat(budgetLimit.value)
  
  if (isNaN(limit) || limit <= 0) {
    budgetError.value = 'Please enter a valid positive number'
    return
  }
  
  if (limit > 100000) {
    budgetError.value = 'Budget limit cannot exceed $100,000'
    return
  }
  
  budgetError.value = ''
  userStore.updateBudgetLimit(limit)
  showNotification(`Budget limit updated to $${limit.toFixed(2)}`, 'success')
}

// Clear all expenses
const clearExpenses = () => {
  if (confirm('Are you sure you want to clear all expenses? This cannot be undone.')) {
    userStore.expenses = []
    showNotification('All expenses cleared', 'info')
  }
}

// Clear all tasks
const clearTasks = () => {
  if (confirm('Are you sure you want to clear all tasks? This cannot be undone.')) {
    localStorage.removeItem('lifeos_tasks')
    showNotification('All tasks cleared. Refresh to see changes.', 'info')
  }
}
</script>

<template>
  <div class="preferences-settings">
    <h2 class="section-title">Preferences</h2>
    <p class="section-description">
      Customize your LifeOS experience
    </p>

    <!-- Budget Settings -->
    <div class="settings-group">
      <h3 class="group-title">💰 Budget Settings</h3>
      
      <div class="setting-item">
        <label class="setting-label">Monthly Budget Limit</label>
        <div class="setting-control">
          <!-- [REQ 1] v-model for budget input -->
          <BaseInput
            v-model="budgetLimit"
            type="number"
            placeholder="Enter budget limit"
            icon="💵"
            :error="budgetError"
          />
          <button @click="updateBudget" class="btn-update">
            Update
          </button>
        </div>
      </div>

      <div class="setting-item">
        <div class="setting-info">
          <span class="setting-label">Current Spending</span>
          <span class="setting-value">${{ userStore.totalExpenses.toFixed(2) }}</span>
        </div>
        <div class="setting-info">
          <span class="setting-label">Remaining</span>
          <span 
            class="setting-value"
            :class="{ 'text-danger': userStore.remainingBudget < 0 }"
          >
            ${{ userStore.remainingBudget.toFixed(2) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Data Management -->
    <div class="settings-group">
      <h3 class="group-title">🗄️ Data Management</h3>
      
      <div class="setting-item">
        <div>
          <span class="setting-label">Clear All Expenses</span>
          <p class="setting-description">
            Remove all expense records from your account
          </p>
        </div>
        <!-- [REQ 1] v-on for click handler -->
        <button @click="clearExpenses" class="btn-danger">
          Clear Expenses
        </button>
      </div>

      <div class="setting-item">
        <div>
          <span class="setting-label">Clear All Tasks</span>
          <p class="setting-description">
            Remove all tasks from your planner
          </p>
        </div>
        <button @click="clearTasks" class="btn-danger">
          Clear Tasks
        </button>
      </div>
    </div>

    <!-- About -->
    <div class="settings-group">
      <h3 class="group-title">ℹ️ About LifeOS</h3>
      <div class="about-info">
        <p><strong>Version:</strong> 1.0.0</p>
        <p><strong>Built with:</strong> Vue 3, Vite, Pinia, Vue Router</p>
        <p><strong>Purpose:</strong> Personal productivity dashboard for students</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* [REQ 9] Scoped CSS */
.section-title {
  font-size: 1.25rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.section-description {
  color: var(--text-secondary);
  margin-bottom: 2rem;
}

.settings-group {
  margin-bottom: 2rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid var(--border-color);
}

.settings-group:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.group-title {
  font-size: 1rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background: var(--surface-hover);
  border-radius: var(--radius);
}

.setting-label {
  display: block;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.setting-description {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.setting-value {
  font-weight: 600;
  color: var(--text-primary);
}

.setting-value.text-danger {
  color: var(--danger-color);
}

.setting-control {
  display: flex;
  gap: 0.5rem;
  flex: 1;
  max-width: 400px;
}

.setting-info {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

.btn-update {
  padding: 0.75rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  white-space: nowrap;
  transition: var(--transition);
}

.btn-update:hover {
  background: var(--primary-hover);
}

.btn-danger {
  padding: 0.5rem 1rem;
  background: transparent;
  color: var(--danger-color);
  border: 1px solid var(--danger-color);
  border-radius: var(--radius);
  cursor: pointer;
  white-space: nowrap;
  transition: var(--transition);
}

.btn-danger:hover {
  background: var(--danger-color);
  color: white;
}

.about-info {
  padding: 1rem;
  background: var(--surface-hover);
  border-radius: var(--radius);
}

.about-info p {
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.about-info p:last-child {
  margin-bottom: 0;
}

.about-info strong {
  color: var(--text-primary);
}
</style>
