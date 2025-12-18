<script setup>
/**
 * BaseInput.vue - Reusable Input Component
 * [REQ 2] Demonstrates Props and Emits pattern
 * [REQ 1] Uses v-model, v-bind for two-way binding
 */
import { AlertCircle } from 'lucide-vue-next'

// ============================================
// [REQ 2] PROPS
// ============================================
const props = defineProps({
  // Current input value (for v-model)
  modelValue: {
    type: [String, Number],
    default: ''
  },
  // Input type (text, email, password, number, etc.)
  type: {
    type: String,
    default: 'text'
  },
  // Label text
  label: {
    type: String,
    default: ''
  },
  // Placeholder text
  placeholder: {
    type: String,
    default: ''
  },
  // Error message to display
  error: {
    type: String,
    default: ''
  },
  // Whether the field is required
  required: {
    type: Boolean,
    default: false
  },
  // Whether the input is disabled
  disabled: {
    type: Boolean,
    default: false
  },
  // Icon component to display
  icon: {
    type: [Object, null],
    default: null
  }
})

// ============================================
// [REQ 2] EMITS - For v-model support
// ============================================
const emit = defineEmits(['update:modelValue', 'blur', 'focus'])

// Handle input change
const handleInput = (event) => {
  emit('update:modelValue', event.target.value)
}

const handleBlur = (event) => {
  emit('blur', event)
}

const handleFocus = (event) => {
  emit('focus', event)
}
</script>

<template>
  <div class="input-wrapper" :class="{ 'has-error': error }">
    <!-- Label -->
    <!-- [REQ 1] v-if for conditional rendering -->
    <label v-if="label" class="input-label">
      {{ label }}
      <span v-if="required" class="required-mark">*</span>
    </label>

    <div class="input-container">
      <!-- Icon -->
      <component v-if="icon" :is="icon" class="input-icon" :size="18" />

      <!-- [REQ 1] v-model implementation through :value and @input -->
      <!-- [REQ 1] v-bind (:type, :placeholder, :disabled) for dynamic attributes -->
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        :required="required"
        class="input-field"
        :class="{ 'has-icon': icon }"
        @input="handleInput"
        @blur="handleBlur"
        @focus="handleFocus"
      />
    </div>

    <!-- Error Message -->
    <!-- [REQ 1] v-if for conditional error display -->
    <!-- [REQ 9] Transition for error message -->
    <Transition name="fade">
      <span v-if="error" class="error-message">
        <AlertCircle :size="14" />
        {{ error }}
      </span>
    </Transition>
  </div>
</template>

<style scoped>
/* [REQ 9] Scoped CSS */
.input-wrapper {
  margin-bottom: 1rem;
}

.input-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.required-mark {
  color: var(--danger-color);
  margin-left: 0.25rem;
}

.input-container {
  position: relative;
}

.input-icon {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  font-size: 1.1rem;
}

.input-field {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  background: var(--surface-color);
  color: var(--text-primary);
  transition: var(--transition);
}

.input-field.has-icon {
  padding-left: 2.75rem;
}

.input-field:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

.input-field:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.input-field::placeholder {
  color: var(--text-secondary);
}

/* Error state */
.has-error .input-field {
  border-color: var(--danger-color);
}

.has-error .input-field:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);
}

.error-message {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: var(--danger-color);
  margin-top: 0.5rem;
}

/* [REQ 9] Fade transition for error message */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-5px);
}
</style>
