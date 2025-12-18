<script setup>
import { computed } from 'vue'
import { useUserStore } from '@/stores/userStore'
import { Wallet, Plus } from 'lucide-vue-next'




const props = defineProps({
  title: {
    type: String,
    default: 'Monthly Budget'
  },
  showDetails: {
    type: Boolean,
    default: true
  }
})




const emit = defineEmits(['add-expense', 'view-details'])


const userStore = useUserStore()






const budgetLimit = computed(() => userStore.budgetLimit)
const totalSpent = computed(() => userStore.totalExpenses)
const remaining = computed(() => userStore.remainingBudget)
const percentage = computed(() => userStore.budgetPercentage)
const status = computed(() => userStore.budgetStatus)


const progressColor = computed(() => {
  const colors = {
    success: 'var(--secondary-color)',
    info: 'var(--primary-color)',
    warning: 'var(--warning-color)',
    danger: 'var(--danger-color)'
  }
  return colors[status.value.color] || colors.info
})


const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(amount)
}


const recentExpenses = computed(() => {
  return [...userStore.expenses]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3)
})
</script>

<template>
  <div class="budget-card">
    <!-- Header -->
    <div class="budget-header">
      <h3 class="budget-title">
        <Wallet class="title-icon" :size="20" />
        {{ title }}
      </h3>
      <!-- [REQ 1] v-bind for dynamic styling -->
      <span 
        class="status-badge" 
        :class="`status-badge--${status.color}`"
      >
        {{ status.message }}
      </span>
    </div>

    <!-- Main Amount Display -->
    <div class="budget-amount">
      <div class="amount-remaining">
        <span class="amount-label">Remaining</span>
        <!-- [REQ 1] v-bind for dynamic class based on remaining amount -->
        <span 
          class="amount-value"
          :class="{ 'amount-value--negative': remaining < 0 }"
        >
          {{ formatCurrency(remaining) }}
        </span>
      </div>
      <div class="amount-total">
        of {{ formatCurrency(budgetLimit) }}
      </div>
    </div>

    <!-- Progress Bar -->
    <div class="progress-container">
      <div class="progress-bar">
        <!-- [REQ 1] v-bind (:style) for dynamic inline styles -->
        <div 
          class="progress-fill"
          :style="{ 
            width: `${Math.min(percentage, 100)}%`,
            backgroundColor: progressColor
          }"
        ></div>
      </div>
      <span class="progress-text">{{ percentage }}% used</span>
    </div>

    <!-- [REQ 1] v-if for conditional rendering -->
    <template v-if="showDetails">
      <!-- Stats Row -->
      <div class="budget-stats">
        <div class="stat">
          <span class="stat-label">Spent</span>
          <span class="stat-value stat-value--spent">
            {{ formatCurrency(totalSpent) }}
          </span>
        </div>
        <div class="stat">
          <span class="stat-label">Daily Avg</span>
          <span class="stat-value">
            {{ formatCurrency(totalSpent / new Date().getDate()) }}
          </span>
        </div>
      </div>

      <!-- Recent Expenses -->
      <!-- [REQ 1] v-if to check if there are expenses -->
      <div v-if="recentExpenses.length > 0" class="recent-expenses">
        <h4 class="section-title">Recent Expenses</h4>
        <ul class="expense-list">
          <!-- [REQ 1] v-for for iterating -->
          <li 
            v-for="expense in recentExpenses" 
            :key="expense.id"
            class="expense-item"
          >
            <span class="expense-name">{{ expense.name }}</span>
            <span class="expense-amount">
              -{{ formatCurrency(expense.amount) }}
            </span>
          </li>
        </ul>
      </div>

      <!-- Empty state -->
      <div v-else class="empty-expenses">
        <p>No expenses recorded yet</p>
      </div>
    </template>

    <!-- Actions -->
    <div class="budget-actions">
      <!-- [REQ 1] v-on (@click) for event handling -->
      <button 
        class="btn-add-expense"
        @click="emit('add-expense')"
      >
        <Plus :size="16" />
        Add Expense
      </button>
      <button 
        class="btn-view-details"
        @click="emit('view-details')"
      >
        View All
      </button>
    </div>
  </div>
</template>

<style scoped>
/* [REQ 9] Scoped CSS */
.budget-card {
  background: linear-gradient(135deg, var(--surface-color), rgba(99, 102, 241, 0.1));
  border-radius: var(--radius);
  padding: 1.5rem;
  border: 1px solid var(--border-color);
}

.budget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.budget-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.title-icon {
  font-size: 1.25rem;
}

.status-badge {
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.status-badge--success {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
}

.status-badge--info {
  background: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
}

.status-badge--warning {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
}

.status-badge--danger {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
}

.budget-amount {
  text-align: center;
  margin-bottom: 1.5rem;
}

.amount-remaining {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.amount-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.amount-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--secondary-color);
}

.amount-value--negative {
  color: var(--danger-color);
}

.amount-total {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-top: 0.25rem;
}

.progress-container {
  margin-bottom: 1.5rem;
}

.progress-bar {
  height: 8px;
  background: var(--surface-hover);
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.5s ease, background-color 0.3s ease;
}

.progress-text {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.budget-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  padding: 1rem 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  margin-bottom: 1rem;
}

.stat {
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.75rem;
  color: var(--text-secondary);
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.stat-value--spent {
  color: var(--warning-color);
}

.section-title {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}

.expense-list {
  list-style: none;
}

.expense-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid var(--border-color);
}

.expense-item:last-child {
  border-bottom: none;
}

.expense-name {
  color: var(--text-primary);
  font-size: 0.875rem;
}

.expense-amount {
  color: var(--danger-color);
  font-size: 0.875rem;
  font-weight: 500;
}

.empty-expenses {
  text-align: center;
  padding: 1rem;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.recent-expenses {
  margin-bottom: 1rem;
}

.budget-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
}

.btn-add-expense {
  flex: 1;
  padding: 0.75rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.btn-add-expense:hover {
  background: var(--primary-hover);
}

.btn-view-details {
  padding: 0.75rem 1rem;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);
}

.btn-view-details:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}
</style>
