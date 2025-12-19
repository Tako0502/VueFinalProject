<script setup>

import { computed } from 'vue'
import { Calendar, Pencil, Trash2 } from 'lucide-vue-next'
const props = defineProps({
  task: {
    type: Object,
    required: true,
    validator: (task) => {
      return task.id !== undefined && task.title !== undefined
    }
  },
  showDelete: {
    type: Boolean,
    default: true
  }
})

const emit = defineEmits([
  'toggle',
  'delete',
  'edit'
])

const priorityClass = computed(() => {
  const classes = {
    high: 'priority--high',
    medium: 'priority--medium',
    low: 'priority--low'
  }
  return classes[props.task.priority] || classes.medium
})

const formattedDate = computed(() => {
  if (!props.task.date) return ''
  const date = new Date(props.task.date)
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  })
})

const handleToggle = () => {
  emit('toggle', props.task.id)
}

const handleDelete = () => {
  emit('delete', props.task.id)
}

const handleEdit = () => {
  emit('edit', props.task)
}

</script>

<template>
  <div 
    class="task-item" 
    :class="{ 'task-item--completed': task.completed }"
  >
    <label class="task-checkbox">
      <input 
        type="checkbox"
        :checked="task.completed"
        @change="handleToggle"
        class="checkbox-input"
      />
      <span class="checkbox-custom"></span>
    </label>

    <div class="task-content">
      <h4 class="task-title">{{ task.title }}</h4>
      
      <p v-if="task.description" class="task-description">
        {{ task.description }}
      </p>
      
      <div class="task-meta">
        <span class="priority-badge" :class="priorityClass">
          {{ task.priority }}
        </span>
        <span v-if="task.date" class="task-date">
          <Calendar :size="12" />
          {{ formattedDate }}
        </span>
      </div>
    </div>

    <div class="task-actions">
      <button 
        class="btn-action btn-edit" 
        @click="handleEdit"
        title="Edit task"
      >
        <Pencil :size="16" />
      </button>
      
      <button 
        v-if="showDelete"
        class="btn-action btn-delete" 
        @click="handleDelete"
        title="Delete task"
      >
        <Trash2 :size="16" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.task-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: var(--surface-color);
  border-radius: var(--radius);
  border: 1px solid var(--border-color);
  transition: var(--transition);
}

.task-item:hover {
  border-color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.15);
}

.task-item--completed {
  opacity: 0.7;
}

.task-item--completed .task-title {
  text-decoration: line-through;
  color: var(--text-secondary);
}

.task-checkbox {
  position: relative;
  cursor: pointer;
  flex-shrink: 0;
}

.checkbox-input {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkbox-custom {
  display: block;
  width: 24px;
  height: 24px;
  border: 2px solid var(--border-color);
  border-radius: 6px;
  transition: var(--transition);
}

.checkbox-input:checked + .checkbox-custom {
  background: var(--secondary-color);
  border-color: var(--secondary-color);
}

.checkbox-input:checked + .checkbox-custom::after {
  content: '✓';
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  font-weight: bold;
}

.task-content {
  flex: 1;
  min-width: 0;
}

.task-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.25rem;
}

.task-description {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.task-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
}

.priority-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  text-transform: capitalize;
  font-weight: 500;
}

.priority--high {
  background: rgba(239, 68, 68, 0.2);
  color: #f87171;
}

.priority--medium {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
}

.priority--low {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
}

.task-date {
  color: var(--text-secondary);
}

.task-actions {
  display: flex;
  gap: 0.5rem;
  opacity: 0;
  transition: var(--transition);
}

.task-item:hover .task-actions {
  opacity: 1;
}

.btn-action {
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: var(--surface-hover);
  border-radius: 6px;
  cursor: pointer;
  transition: var(--transition);
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-action:hover {
  transform: scale(1.1);
}

.btn-delete:hover {
  background: rgba(239, 68, 68, 0.2);
}

.btn-edit:hover {
  background: rgba(99, 102, 241, 0.2);
}
</style>
