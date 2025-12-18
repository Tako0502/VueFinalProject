<script setup>
/**
 * DashboardView.vue - Main Hub
 * [REQ 5] Static route /dashboard
 * [REQ 8] Loading and Error states for API calls
 * [REQ 1] v-for, v-if, v-bind, v-on directives
 */
import { ref, onMounted, inject, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/userStore'
import { useTaskStore } from '@/stores/taskStore'

// Components
import TaskItem from '@/components/TaskItem.vue'
import BudgetCard from '@/components/BudgetCard.vue'
import FocusTimer from '@/components/FocusTimer.vue'
import BudgetForm from '@/components/BudgetForm.vue'
import BaseInput from '@/components/BaseInput.vue'

// Icons
import { 
  ClipboardList, CheckCircle, Clock, TrendingUp, FileEdit, 
  Pin, FileText, PartyPopper, AlertTriangle, Plus, X
} from 'lucide-vue-next'

const router = useRouter()
const userStore = useUserStore()
const taskStore = useTaskStore()
const showNotification = inject('showNotification', () => {})

// ============================================
// [REQ 8] LOADING AND ERROR STATES
// ============================================
const isLoading = ref(true)
const error = ref(null)

// UI State
const showAddTask = ref(false)
const showBudgetForm = ref(false)

// New task form
const newTask = ref({
  title: '',
  description: '',
  priority: 'medium'
})

// [REQ 3] Computed properties
const today = computed(() => new Date().toISOString().split('T')[0])
const todaysTasks = computed(() => taskStore.getTasksByDate(today.value))
const taskStats = computed(() => taskStore.taskStats)

// ============================================
// [REQ 8] DATA FETCHING WITH LOADING/ERROR
// ============================================
onMounted(async () => {
  isLoading.value = true
  error.value = null
  
  try {
    // [REQ 8] Fetch tasks from backend API
    await taskStore.loadTasks()
    // Also load expenses for budget card
    await userStore.loadExpenses()
  } catch (err) {
    // [REQ 8] Handle error state
    error.value = 'Failed to load data. Please try again.'
    console.error('Error fetching data:', err)
  } finally {
    isLoading.value = false
  }
})

// ============================================
// EVENT HANDLERS
// ============================================

const handleAddTask = () => {
  if (!newTask.value.title.trim()) {
    showNotification('Please enter a task title', 'warning')
    return
  }
  
  taskStore.addTask({
    title: newTask.value.title,
    description: newTask.value.description,
    priority: newTask.value.priority,
    date: today.value
  })
  
  showNotification('Task added successfully!', 'success')
  
  // Reset form
  newTask.value = { title: '', description: '', priority: 'medium' }
  showAddTask.value = false
}

const handleToggleTask = (taskId) => {
  taskStore.toggleTask(taskId)
}

const handleDeleteTask = (taskId) => {
  taskStore.deleteTask(taskId)
  showNotification('Task deleted', 'info')
}

const handleEditTask = (task) => {
  // Navigate to planner with task date
  router.push(`/planner/${task.date}`)
}

const handleAddExpense = () => {
  showBudgetForm.value = true
}

const handleExpenseSubmit = () => {
  showBudgetForm.value = false
}

const navigateToPlanner = () => {
  router.push(`/planner/${today.value}`)
}
</script>

<template>
  <div class="dashboard">
    <!-- Header -->
    <header class="dashboard-header">
      <div class="header-content">
        <h1 class="page-title">
          Good {{ new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 17 ? 'Afternoon' : 'Evening' }}, 
          {{ userStore.user.name || 'Student' }}!
        </h1>
        <p class="page-subtitle">Here's your productivity overview for today</p>
      </div>
      <div class="header-date">
        <span class="date-label">Today</span>
        <span class="date-value">{{ new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }) }}</span>
      </div>
    </header>

    <!-- [REQ 8] Loading State -->
    <!-- [REQ 1] v-if for conditional rendering -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading your dashboard...</p>
    </div>

    <!-- [REQ 8] Error State -->
    <div v-else-if="error" class="error-state">
      <AlertTriangle class="error-icon" :size="48" />
      <p>{{ error }}</p>
      <button @click="$router.go(0)" class="btn-retry">
        Retry
      </button>
    </div>

    <!-- Main Content -->
    <template v-else>
      <!-- Stats Overview -->
      <div class="stats-grid">
        <div class="stat-card">
          <ClipboardList class="stat-icon" :size="32" />
          <div class="stat-content">
            <span class="stat-value">{{ taskStats.total }}</span>
            <span class="stat-label">Total Tasks</span>
          </div>
        </div>
        <div class="stat-card stat-card--success">
          <CheckCircle class="stat-icon" :size="32" />
          <div class="stat-content">
            <span class="stat-value">{{ taskStats.completed }}</span>
            <span class="stat-label">Completed</span>
          </div>
        </div>
        <div class="stat-card stat-card--warning">
          <Clock class="stat-icon" :size="32" />
          <div class="stat-content">
            <span class="stat-value">{{ taskStats.pending }}</span>
            <span class="stat-label">Pending</span>
          </div>
        </div>
        <div class="stat-card stat-card--info">
          <TrendingUp class="stat-icon" :size="32" />
          <div class="stat-content">
            <span class="stat-value">{{ taskStats.percentage }}%</span>
            <span class="stat-label">Progress</span>
          </div>
        </div>
      </div>

      <!-- Main Grid -->
      <div class="dashboard-grid">
        <!-- Tasks Section -->
        <section class="section tasks-section">
          <div class="section-header">
            <h2 class="section-title">
              <FileEdit class="title-icon" :size="20" />
              Today's Tasks
            </h2>
            <button 
              class="btn-add"
              @click="showAddTask = !showAddTask"
            >
              <component :is="showAddTask ? X : Plus" :size="16" />
              {{ showAddTask ? 'Cancel' : 'Add Task' }}
            </button>
          </div>

          <!-- Add Task Form -->
          <!-- [REQ 1] v-if for conditional form display -->
          <div v-if="showAddTask" class="add-task-form">
            <BaseInput
              v-model="newTask.title"
              label="Task Title"
              placeholder="What needs to be done?"
              :icon="Pin"
              :required="true"
            />
            <BaseInput
              v-model="newTask.description"
              label="Description (optional)"
              placeholder="Add details..."
              :icon="FileText"
            />
            <div class="priority-select">
              <label class="priority-label">Priority</label>
              <div class="priority-options">
                <!-- [REQ 1] v-for with v-model -->
                <label 
                  v-for="p in ['low', 'medium', 'high']" 
                  :key="p"
                  class="priority-option"
                  :class="{ active: newTask.priority === p }"
                >
                  <input 
                    type="radio" 
                    v-model="newTask.priority" 
                    :value="p"
                  />
                  {{ p }}
                </label>
              </div>
            </div>
            <button @click="handleAddTask" class="btn-submit-task">
              Add Task
            </button>
          </div>

          <!-- Task List -->
          <div class="task-list">
            <!-- [REQ 1] v-if for empty state -->
            <div v-if="todaysTasks.length === 0" class="empty-tasks">
              <PartyPopper class="empty-icon" :size="48" />
              <p>No tasks for today!</p>
              <button @click="showAddTask = true" class="btn-add-first">
                Add your first task
              </button>
            </div>

            <!-- [REQ 1] v-for for task list -->
            <!-- [REQ 9] Vue transition-group for list animation -->
            <TransitionGroup name="list" tag="div" class="tasks-container">
              <TaskItem
                v-for="task in todaysTasks"
                :key="task.id"
                :task="task"
                @toggle="handleToggleTask"
                @delete="handleDeleteTask"
                @edit="handleEditTask"
              />
            </TransitionGroup>
          </div>

          <!-- View All Link -->
          <button 
            v-if="todaysTasks.length > 0"
            @click="navigateToPlanner"
            class="btn-view-all"
          >
            View in Planner →
          </button>
        </section>

        <!-- Right Column -->
        <div class="right-column">
          <!-- Focus Timer -->
          <section class="section">
            <FocusTimer />
          </section>

          <!-- Budget Card -->
          <section class="section">
            <!-- [REQ 1] v-if/else for form toggle -->
            <BudgetForm 
              v-if="showBudgetForm"
              @submit="handleExpenseSubmit"
              @cancel="showBudgetForm = false"
            />
            <BudgetCard 
              v-else
              @add-expense="handleAddExpense"
              @view-details="$router.push('/settings/preferences')"
            />
          </section>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* [REQ 9] Scoped CSS */
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.75rem;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: var(--text-secondary);
}

.header-date {
  text-align: right;
  background: var(--surface-color);
  padding: 0.75rem 1rem;
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
}

.date-label {
  display: block;
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.date-value {
  font-weight: 600;
  color: var(--text-primary);
}

/* Loading & Error States */
.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.loading-state p,
.error-state p {
  color: var(--text-secondary);
  margin-top: 1rem;
}

.error-icon {
  font-size: 3rem;
}

.btn-retry {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--surface-color);
  border-radius: var(--radius);
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid var(--border-color);
  transition: var(--transition);
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow);
}

.stat-icon {
  font-size: 2rem;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-card--success .stat-value { color: var(--secondary-color); }
.stat-card--warning .stat-value { color: var(--warning-color); }
.stat-card--info .stat-value { color: var(--primary-color); }

/* Dashboard Grid */
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 1.5rem;
}

.section {
  margin-bottom: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.25rem;
  color: var(--text-primary);
}

.title-icon {
  font-size: 1.25rem;
}

.btn-add {
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius);
  font-size: 0.875rem;
  cursor: pointer;
  transition: var(--transition);
}

.btn-add:hover {
  background: var(--primary-hover);
}

/* Add Task Form */
.add-task-form {
  background: var(--surface-color);
  border-radius: var(--radius);
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 1px solid var(--border-color);
}

.priority-select {
  margin-bottom: 1rem;
}

.priority-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.priority-options {
  display: flex;
  gap: 0.5rem;
}

.priority-option {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  background: var(--surface-hover);
  border-radius: var(--radius);
  cursor: pointer;
  text-transform: capitalize;
  font-size: 0.875rem;
  color: var(--text-secondary);
  transition: var(--transition);
}

.priority-option input {
  display: none;
}

.priority-option.active {
  background: var(--primary-color);
  color: white;
}

.btn-submit-task {
  width: 100%;
  padding: 0.75rem;
  background: var(--secondary-color);
  color: white;
  border: none;
  border-radius: var(--radius);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.btn-submit-task:hover {
  background: #16a34a;
}

/* Task List */
.task-list {
  min-height: 200px;
}

.tasks-container {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.empty-tasks {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 2rem;
  background: var(--surface-color);
  border-radius: var(--radius);
  border: 1px dashed var(--border-color);
  text-align: center;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-tasks p {
  color: var(--text-secondary);
  margin-bottom: 1rem;
}

.btn-add-first {
  padding: 0.75rem 1.5rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
}

.btn-view-all {
  display: block;
  width: 100%;
  padding: 0.75rem;
  background: transparent;
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: var(--radius);
  cursor: pointer;
  margin-top: 1rem;
  transition: var(--transition);
}

.btn-view-all:hover {
  background: rgba(99, 102, 241, 0.1);
}

/* Right Column */
.right-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* [REQ 9] List transition animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-move {
  transition: transform 0.4s ease;
}

/* Responsive */
@media (max-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 600px) {
  .dashboard-header {
    flex-direction: column;
    gap: 1rem;
  }
  
  .header-date {
    text-align: left;
    width: 100%;
  }
  
  .stats-grid {
    grid-template-columns: 1fr 1fr;
  }
}
</style>
