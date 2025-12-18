<script setup>
/**
 * PlannerView.vue - Planner Overview
 * Shows a calendar-style view with links to specific dates
 */
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useTaskStore } from '@/stores/taskStore'

const router = useRouter()
const taskStore = useTaskStore()

// Current date info
const today = new Date()
const currentMonth = ref(today.getMonth())
const currentYear = ref(today.getFullYear())

// Month names
const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

// Day names
const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Get days in month
const getDaysInMonth = (month, year) => {
  return new Date(year, month + 1, 0).getDate()
}

// Get first day of month (0 = Sunday)
const getFirstDayOfMonth = (month, year) => {
  return new Date(year, month, 1).getDay()
}

// [REQ 3] Computed - Generate calendar days
const calendarDays = computed(() => {
  const days = []
  const daysInMonth = getDaysInMonth(currentMonth.value, currentYear.value)
  const firstDay = getFirstDayOfMonth(currentMonth.value, currentYear.value)
  
  // Add empty slots for days before first of month
  for (let i = 0; i < firstDay; i++) {
    days.push({ day: null, date: null })
  }
  
  // Add actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const date = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
    const tasks = taskStore.getTasksByDate(date)
    days.push({
      day,
      date,
      isToday: date === today.toISOString().split('T')[0],
      hasTask: tasks.length > 0,
      taskCount: tasks.length
    })
  }
  
  return days
})

// Navigation
const previousMonth = () => {
  if (currentMonth.value === 0) {
    currentMonth.value = 11
    currentYear.value--
  } else {
    currentMonth.value--
  }
}

const nextMonth = () => {
  if (currentMonth.value === 11) {
    currentMonth.value = 0
    currentYear.value++
  } else {
    currentMonth.value++
  }
}

const goToToday = () => {
  currentMonth.value = today.getMonth()
  currentYear.value = today.getFullYear()
}

// Navigate to specific date
const selectDate = (date) => {
  if (date) {
    router.push(`/planner/${date}`)
  }
}
</script>

<template>
  <div class="planner-view">
    <header class="planner-header">
      <div>
        <h1 class="page-title">📅 Planner</h1>
        <p class="page-subtitle">Plan your tasks and events</p>
      </div>
      <button @click="goToToday" class="btn-today">
        Today
      </button>
    </header>

    <!-- Calendar -->
    <div class="calendar-container">
      <!-- Month Navigation -->
      <div class="calendar-nav">
        <button @click="previousMonth" class="btn-nav">
          ← Previous
        </button>
        <h2 class="month-title">
          {{ monthNames[currentMonth] }} {{ currentYear }}
        </h2>
        <button @click="nextMonth" class="btn-nav">
          Next →
        </button>
      </div>

      <!-- Day Headers -->
      <div class="calendar-header">
        <!-- [REQ 1] v-for for day names -->
        <div 
          v-for="day in dayNames" 
          :key="day" 
          class="day-header"
        >
          {{ day }}
        </div>
      </div>

      <!-- Calendar Grid -->
      <div class="calendar-grid">
        <!-- [REQ 1] v-for for calendar days -->
        <div
          v-for="(item, index) in calendarDays"
          :key="index"
          class="calendar-day"
          :class="{
            'calendar-day--empty': !item.day,
            'calendar-day--today': item.isToday,
            'calendar-day--has-tasks': item.hasTask
          }"
          @click="selectDate(item.date)"
        >
          <!-- [REQ 1] v-if for conditional content -->
          <template v-if="item.day">
            <span class="day-number">{{ item.day }}</span>
            <span v-if="item.hasTask" class="task-indicator">
              {{ item.taskCount }} task{{ item.taskCount > 1 ? 's' : '' }}
            </span>
          </template>
        </div>
      </div>
    </div>

    <!-- Quick Stats -->
    <div class="planner-stats">
      <div class="stat-item">
        <span class="stat-value">{{ taskStore.taskStats.total }}</span>
        <span class="stat-label">Total Tasks</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ taskStore.taskStats.pending }}</span>
        <span class="stat-label">Pending</span>
      </div>
      <div class="stat-item">
        <span class="stat-value">{{ taskStore.taskStats.completed }}</span>
        <span class="stat-label">Completed</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* [REQ 9] Scoped CSS */
.planner-view {
  max-width: 900px;
  margin: 0 auto;
}

.planner-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.page-title {
  font-size: 1.75rem;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.page-subtitle {
  color: var(--text-secondary);
}

.btn-today {
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius);
  cursor: pointer;
  transition: var(--transition);
}

.btn-today:hover {
  background: var(--primary-hover);
}

/* Calendar */
.calendar-container {
  background: var(--surface-color);
  border-radius: var(--radius);
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  margin-bottom: 2rem;
}

.calendar-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.month-title {
  font-size: 1.25rem;
  color: var(--text-primary);
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

.calendar-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
  margin-bottom: 0.5rem;
}

.day-header {
  text-align: center;
  padding: 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 4px;
}

.calendar-day {
  aspect-ratio: 1;
  padding: 0.5rem;
  background: var(--surface-hover);
  border-radius: 8px;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80px;
}

.calendar-day:hover:not(.calendar-day--empty) {
  background: rgba(99, 102, 241, 0.2);
  transform: scale(1.02);
}

.calendar-day--empty {
  background: transparent;
  cursor: default;
}

.calendar-day--today {
  background: var(--primary-color);
}

.calendar-day--today .day-number {
  color: white;
}

.calendar-day--has-tasks {
  border: 2px solid var(--secondary-color);
}

.day-number {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
}

.task-indicator {
  font-size: 0.65rem;
  color: var(--secondary-color);
  margin-top: 0.25rem;
}

/* Stats */
.planner-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.stat-item {
  background: var(--surface-color);
  border-radius: var(--radius);
  padding: 1.5rem;
  text-align: center;
  border: 1px solid var(--border-color);
}

.stat-item .stat-value {
  display: block;
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-color);
}

.stat-item .stat-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
}
</style>
