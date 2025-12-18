<script setup>
/**
 * FocusTimer.vue - Pomodoro Timer Component
 * [REQ 2] Component with Props/Emits
 * [REQ 4] Uses useFocusTimer composable with onMounted
 */
import { useFocusTimer } from '@/composables/useFocusTimer'
import { Timer, Play, Pause, RotateCcw, SkipForward } from 'lucide-vue-next'

// ============================================
// [REQ 2] EMITS
// ============================================
const emit = defineEmits(['session-complete'])

// ============================================
// [REQ 4] Use the composable (contains onMounted)
// ============================================
const {
  formattedTime,
  isRunning,
  isWorkSession,
  completedSessions,
  formattedTotalTime,
  progress,
  sessionLabel,
  start,
  pause,
  reset,
  skip
} = useFocusTimer()

// Handle session complete
const handleStart = () => {
  start()
}

const handlePause = () => {
  pause()
}

const handleReset = () => {
  reset()
}

const handleSkip = () => {
  skip()
}
</script>

<template>
  <div class="focus-timer">
    <!-- Timer Header -->
    <div class="timer-header">
      <h3 class="timer-title">
        <Timer class="title-icon" :size="20" />
        Focus Timer
      </h3>
      <span class="sessions-count">
        {{ completedSessions }} sessions today
      </span>
    </div>

    <!-- Session Type Indicator -->
    <!-- [REQ 1] v-bind for dynamic class -->
    <div 
      class="session-indicator"
      :class="{ 
        'session-indicator--work': isWorkSession,
        'session-indicator--break': !isWorkSession 
      }"
    >
      {{ sessionLabel }}
    </div>

    <!-- Timer Display -->
    <div class="timer-display">
      <!-- Progress Ring -->
      <div class="progress-ring">
        <svg class="progress-svg" viewBox="0 0 100 100">
          <!-- Background circle -->
          <circle
            class="progress-background"
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke-width="6"
          />
          <!-- Progress circle -->
          <!-- [REQ 1] v-bind (:stroke-dashoffset) for dynamic progress -->
          <circle
            class="progress-circle"
            :class="{ 'progress-circle--break': !isWorkSession }"
            cx="50"
            cy="50"
            r="45"
            fill="none"
            stroke-width="6"
            :stroke-dasharray="283"
            :stroke-dashoffset="283 - (283 * progress) / 100"
          />
        </svg>
        
        <!-- Time Display -->
        <div class="time-display">
          <span class="time-value">{{ formattedTime }}</span>
          <!-- [REQ 1] v-if for conditional text -->
          <span class="time-label">
            {{ isRunning ? 'remaining' : 'paused' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Control Buttons -->
    <div class="timer-controls">
      <!-- [REQ 1] v-if/else for conditional rendering -->
      <button 
        v-if="!isRunning"
        class="btn-control btn-start"
        @click="handleStart"
      >
        <Play :size="16" />
        Start
      </button>
      <button 
        v-else
        class="btn-control btn-pause"
        @click="handlePause"
      >
        <Pause :size="16" />
        Pause
      </button>

      <button 
        class="btn-control btn-reset"
        @click="handleReset"
      >
        <RotateCcw :size="16" />
        Reset
      </button>

      <button 
        class="btn-control btn-skip"
        @click="handleSkip"
      >
        <SkipForward :size="16" />
        Skip
      </button>
    </div>

    <!-- Total Focus Time -->
    <div class="total-time">
      <span class="total-label">Total focus today:</span>
      <span class="total-value">{{ formattedTotalTime }}</span>
    </div>
  </div>
</template>

<style scoped>
/* [REQ 9] Scoped CSS with animations */
.focus-timer {
  background: linear-gradient(135deg, var(--surface-color), rgba(168, 85, 247, 0.1));
  border-radius: var(--radius);
  padding: 1.5rem;
  border: 1px solid var(--border-color);
  text-align: center;
}

.timer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.timer-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  color: var(--text-primary);
}

.title-icon {
  font-size: 1.25rem;
}

.sessions-count {
  font-size: 0.875rem;
  color: var(--text-secondary);
  background: var(--surface-hover);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
}

.session-indicator {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.875rem;
  margin-bottom: 1.5rem;
  transition: var(--transition);
}

.session-indicator--work {
  background: rgba(99, 102, 241, 0.2);
  color: var(--primary-color);
}

.session-indicator--break {
  background: rgba(34, 197, 94, 0.2);
  color: var(--secondary-color);
}

.timer-display {
  margin-bottom: 1.5rem;
}

.progress-ring {
  position: relative;
  width: 200px;
  height: 200px;
  margin: 0 auto;
}

.progress-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.progress-background {
  stroke: var(--surface-hover);
}

.progress-circle {
  stroke: var(--primary-color);
  stroke-linecap: round;
  transition: stroke-dashoffset 1s ease;
}

.progress-circle--break {
  stroke: var(--secondary-color);
}

.time-display {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.time-value {
  display: block;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--text-primary);
  font-variant-numeric: tabular-nums;
}

.time-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.timer-controls {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
}

.btn-control {
  padding: 0.75rem 1.25rem;
  border-radius: var(--radius);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-start {
  background: var(--primary-color);
  color: white;
  border: none;
}

.btn-start:hover {
  background: var(--primary-hover);
}

.btn-pause {
  background: var(--warning-color);
  color: white;
  border: none;
}

.btn-pause:hover {
  background: #d97706;
}

.btn-reset,
.btn-skip {
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
}

.btn-reset:hover,
.btn-skip:hover {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.total-time {
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
}

.total-label {
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.total-value {
  font-weight: 600;
  color: var(--secondary-color);
  margin-left: 0.5rem;
}
</style>
