<script setup>
/**
 * PlannerDetail.vue - Dynamic Route View
 */
import { ref, computed, onMounted, watch, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'

import TaskItem from '@/components/TaskItem.vue'
import BaseInput from '@/components/BaseInput.vue'

const route = useRoute()
const router = useRouter()
const taskStore = useTaskStore()
const showNotification = inject('showNotification', () => {})

// Loading and error states
const isLoading = ref(false)
const error = ref(null)

// UI State
const showAddTask = ref(false)
const newTask = ref({
  title: '',
  description: '',
  priority: 'medium'
})

// Get date from route params
// Computed properties
const currentDate = computed(() => route.params.date)

const formattedDate = computed(() => {
  const date = new Date(currentDate.value)
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const isToday = computed(() => {
  return currentDate.value === new Date().toISOString().split('T')[0]
})

const isPast = computed(() => {
  return new Date(currentDate.value) < new Date(new Date().toISOString().split('T')[0])
})

// Get tasks for the current date
const dateTasks = computed(() => {
  return taskStore.getTasksByDate(currentDate.value)
})

// Task stats for this date
const dateStats = computed(() => {
  const tasks = dateTasks.value
  const completed = tasks.filter(t => t.completed).length
  return {
    total: tasks.length,
    completed,
    pending: tasks.length - completed
  }
})

// Fetch tasks on mount and when date changes
const fetchData = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    // Load tasks for date
    await taskStore.loadTasksByDate(currentDate.value)
    
  } catch (err) {
    error.value = 'Failed to load tasks for this date'
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchData)

// Watch for route changes (date param changes)
watch(() => route.params.date, () => {
  fetchData()
})

// Navigation
const goToPreviousDay = () => {
  const date = new Date(currentDate.value)
  date.setDate(date.getDate() - 1)
  router.push(`/planner/${date.toISOString().split('T')[0]}`)
}

const goToNextDay = () => {
  const date = new Date(currentDate.value)
  date.setDate(date.getDate() + 1)
  router.push(`/planner/${date.toISOString().split('T')[0]}`)
}

const goToToday = () => {
  router.push(`/planner/${new Date().toISOString().split('T')[0]}`)
}

// Task handlers
const handleAddTask = () => {
  if (!newTask.value.title.trim()) {
    showNotification('Please enter a task title', 'warning')
    return
  }
  
  taskStore.addTask({
    title: newTask.value.title,
    description: newTask.value.description,
    priority: newTask.value.priority,
    date: currentDate.value
  })
  
  showNotification('Task added to ' + formattedDate.value, 'success')
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
</script>

<template>
  <div class="planner-detail">
    <!-- Navigation Header -->
    <header class="detail-header">
      <button @click="$router.push('/planner')" class="btn-back">
        ← Back to Calendar
      </button>
    </header>

    <!-- Date Navigation -->
    <div class="date-nav">
      <button @click="goToPreviousDay" class="btn-nav">
        ← Previous Day
      </button>
      
      <div class="date-display">
        <h1 
          class="date-title"
          :class="{ 'date-title--today': isToday, 'date-title--past': isPast }"
        >
        >
          {{ formattedDate }}
        </h1>
        <span v-if="isToday" class="today-badge">Today</span>
        <span v-else-if="isPast" class="past-badge">Past</span>
      </div>
      
      <button @click="goToNextDay" class="btn-nav">
        Next Day →
      </button>
    </div>

    <!-- Quick Stats -->
    <div class="date-stats">
      <div class="stat">
        <span class="stat-value">{{ dateStats.total }}</span>
        <span class="stat-label">Total</span>
      </div>
      <div class="stat stat--success">
        <span class="stat-value">{{ dateStats.completed }}</span>
        <span class="stat-label">Done</span>
      </div>
      <div class="stat stat--warning">
        <span class="stat-value">{{ dateStats.pending }}</span>
        <span class="stat-label">Pending</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="isLoading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading tasks...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <p>{{ error }}</p>
      <button @click="fetchData" class="btn-retry">Retry</button>
    </div>

    <!-- Content -->
    <template v-else>
      <!-- Add Task Section -->
      <section class="add-section">
        <button 
          class="btn-add"
          @click="showAddTask = !showAddTask"
        >
          {{ showAddTask ? '✕ Cancel' : '+ Add Task for this Day' }}
        </button>

        <!-- Add Task Form -->
        <div v-if="showAddTask" class="add-form">
          <BaseInput
            v-model="newTask.title"
            label="Task Title"
            placeholder="What needs to be done?"
            icon="📌"
            :required="true"
          />
          <BaseInput
            v-model="newTask.description"
            label="Description"
            placeholder="Add details..."
            icon="📝"
          />
          <div class="priority-group">
            <label>Priority:</label>
            <div class="priority-buttons">
              <button
                v-for="p in ['low', 'medium', 'high']"
                :key="p"
                type="button"
                class="priority-btn"
                :class="{ active: newTask.priority === p, [`priority--${p}`]: true }"
                @click="newTask.priority = p"
              >
                {{ p }}
              </button>
            </div>
          </div>
          <button @click="handleAddTask" class="btn-submit">
            Add Task
          </button>
        </div>
      </section>

      <!-- Tasks List -->
      <section class="tasks-section">
        <h2 class="section-title">Tasks for {{ formattedDate }}</h2>

        <!-- Empty State -->
        <div v-if="dateTasks.length === 0" class="empty-state">
          <span class="empty-icon">📭</span>
          <p>No tasks scheduled for this day</p>
          <button @click="showAddTask = true" class="btn-add-first">
            Add your first task
          </button>
        </div>

        <!-- Task List with Animations -->
        <TransitionGroup v-else name="list" tag="div" class="task-list">
          <TaskItem
            v-for="task in dateTasks"
            :key="task.id"
            :task="task"
            @toggle="handleToggleTask"
            @delete="handleDeleteTask"
          />
        </TransitionGroup>
      </section>

      <!-- Jump to Today -->
      <div v-if="!isToday" class="jump-today">
        <button @click="goToToday" class="btn-today">
          Jump to Today
        </button>
      </div>
    </template>
  </div>
</template>

<style scoped>
/* Scoped CSS */
.planner-detail {
  max-width: 800px;
  margin: 0 auto;
}

.detail-header {
  margin-bottom: 1.5rem;
}

.btn-back {
  padding: 0.5rem 1rem;
  background: var(--surface-color);
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);
}

.btn-back:hover {
  color: var(--primary-color);
  border-color: var(--primary-color);
}

/* Date Navigation */
.date-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.btn-nav {
  padding: 0.5rem 1rem;
  background: var(--surface-hover);
  color: var(--text-secondary);
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);
}

.btn-nav:hover {
  background: var(--primary-color);
  color: white;
}

.date-display {
  text-align: center;
}

.date-title {
  font-size: 1.5rem;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.date-title--today {
  color: var(--primary-color);
}

.date-title--past {
  color: var(--text-secondary);
}

.today-badge,
.past-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
}

.today-badge {
  background: rgba(99, 102, 241, 0.2);
  color: var(--primary-color);
}

.past-badge {
  background: var(--surface-hover);
  color: var(--text-secondary);
}

/* Stats */
.date-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: var(--surface-color);
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
}

.stat {
  text-align: center;
}

.stat .stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
}

.stat .stat-label {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.stat--success .stat-value { color: var(--secondary-color); }
.stat--warning .stat-value { color: var(--warning-color); }

/* Loading/Error */
.loading-state,
.error-state {
  text-align: center;
  padding: 3rem;
}

.btn-retry {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
}

/* Add Section */
.add-section {
  margin-bottom: 2rem;
}

.btn-add {
  width: 100%;
  padding: 1rem;
  background: var(--surface-color);
  color: var(--primary-color);
  border: 2px dashed var(--primary-color);
  border-radius: var(--radius);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.btn-add:hover {
  background: rgba(99, 102, 241, 0.1);
}

.add-form {
  margin-top: 1rem;
  padding: 1.5rem;
  background: var(--surface-color);
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
}

.priority-group {
  margin-bottom: 1rem;
}

.priority-group label {
  display: block;
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.priority-buttons {
  display: flex;
  gap: 0.5rem;
}

.priority-btn {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  background: var(--surface-hover);
  color: var(--text-secondary);
  cursor: pointer;
  text-transform: capitalize;
  transition: var(--transition);
}

.priority-btn.active {
  border-color: currentColor;
  color: white;
}

.priority-btn.priority--low.active { background: var(--secondary-color); }
.priority-btn.priority--medium.active { background: var(--warning-color); }
.priority-btn.priority--high.active { background: var(--danger-color); }

.btn-submit {
  width: 100%;
  padding: 0.75rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius);
  font-weight: 500;
  cursor: pointer;
}

/* Tasks Section */
.section-title {
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-bottom: 1rem;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: var(--surface-color);
  border-radius: var(--radius);
  border: 1px dashed var(--border-color);
}

.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
}

.empty-state p {
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

/* Jump to Today */
.jump-today {
  margin-top: 2rem;
  text-align: center;
}

.btn-today {
  padding: 0.75rem 2rem;
  background: var(--surface-color);
  color: var(--primary-color);
  border: 1px solid var(--primary-color);
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);
}

.btn-today:hover {
  background: var(--primary-color);
  color: white;
}

/* List animations */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}

.list-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>
