<script setup>
/**
 * BudgetForm.vue - Add Expense Form with Validation
 * [REQ 7] Forms + Validation: validate input, show error messages
 * [REQ 1] Uses v-model, v-on, v-if directives
 */
import { ref, reactive, computed, inject } from 'vue'
import BaseInput from './BaseInput.vue'
import { useUserStore } from '@/stores/userStore'
import { Receipt, FileText, DollarSign } from 'lucide-vue-next'

// ============================================
// [REQ 2] PROPS
// ============================================
const props = defineProps({
  // Mode: 'expense' or 'budget'
  mode: {
    type: String,
    default: 'expense'
  }
})

// ============================================
// [REQ 2] EMITS
// ============================================
const emit = defineEmits(['submit', 'cancel'])

// Access user store and notification
const userStore = useUserStore()
const showNotification = inject('showNotification', () => {})

// ============================================
// [REQ 3] REACTIVE - Form data
// ============================================
const form = reactive({
  name: '',
  amount: '',
  category: 'General'
})

// [REQ 3] REF - Validation errors
const errors = ref({
  name: '',
  amount: ''
})

// Form submission state
const isSubmitting = ref(false)

// Category options
const categories = [
  'General',
  'Food',
  'Transport',
  'Education',
  'Entertainment',
  'Shopping',
  'Health',
  'Utilities'
]

// ============================================
// [REQ 7] FORM VALIDATION
// ============================================

// Validate the entire form
const validateForm = () => {
  let isValid = true
  
  // Reset errors
  errors.value = { name: '', amount: '' }
  
  // [REQ 7] Validate name - required
  if (!form.name.trim()) {
    errors.value.name = 'Expense name is required'
    isValid = false
  } else if (form.name.length < 2) {
    errors.value.name = 'Name must be at least 2 characters'
    isValid = false
  }
  
  // [REQ 7] Validate amount - must be number > 0
  const amount = parseFloat(form.amount)
  if (!form.amount) {
    errors.value.amount = 'Amount is required'
    isValid = false
  } else if (isNaN(amount)) {
    errors.value.amount = 'Amount must be a valid number'
    isValid = false
  } else if (amount <= 0) {
    errors.value.amount = 'Amount must be greater than 0'
    isValid = false
  } else if (amount > 10000) {
    errors.value.amount = 'Amount cannot exceed $10,000'
    isValid = false
  }
  
  return isValid
}

// Validate individual field on blur
const validateField = (field) => {
  if (field === 'name') {
    if (!form.name.trim()) {
      errors.value.name = 'Expense name is required'
    } else if (form.name.length < 2) {
      errors.value.name = 'Name must be at least 2 characters'
    } else {
      errors.value.name = ''
    }
  }
  
  if (field === 'amount') {
    const amount = parseFloat(form.amount)
    if (!form.amount) {
      errors.value.amount = 'Amount is required'
    } else if (isNaN(amount)) {
      errors.value.amount = 'Amount must be a valid number'
    } else if (amount <= 0) {
      errors.value.amount = 'Amount must be greater than 0'
    } else {
      errors.value.amount = ''
    }
  }
}

// [REQ 3] Computed - Form validity check
const isFormValid = computed(() => {
  return form.name.trim() && 
         parseFloat(form.amount) > 0 && 
         !errors.value.name && 
         !errors.value.amount
})

// ============================================
// FORM SUBMISSION
// ============================================

const handleSubmit = async () => {
  // Validate form
  if (!validateForm()) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    // Add expense to store
    const expense = {
      name: form.name.trim(),
      amount: parseFloat(form.amount),
      category: form.category
    }
    
    userStore.addExpense(expense)
    
    // Show success notification
    showNotification(`Added expense: ${expense.name} ($${expense.amount})`, 'success')
    
    // Emit submit event
    emit('submit', expense)
    
    // Reset form
    form.name = ''
    form.amount = ''
    form.category = 'General'
    errors.value = { name: '', amount: '' }
    
  } catch (error) {
    showNotification('Failed to add expense', 'error')
  } finally {
    isSubmitting.value = false
  }
}

const handleCancel = () => {
  // Reset form
  form.name = ''
  form.amount = ''
  form.category = 'General'
  errors.value = { name: '', amount: '' }
  emit('cancel')
}
</script>

<template>
  <div class="budget-form">
    <h3 class="form-title">
      <Receipt class="title-icon" :size="20" />
      Add New Expense
    </h3>
    
    <!-- [REQ 1] v-on (@submit.prevent) for form submission -->
    <form @submit.prevent="handleSubmit" class="form">
      <!-- Expense Name Input -->
      <!-- [REQ 1] v-model for two-way binding -->
      <!-- [REQ 2] Using BaseInput component with props -->
      <BaseInput
        v-model="form.name"
        label="Expense Name"
        placeholder="e.g., Coffee, Books"
        :icon="FileText"
        :error="errors.name"
        :required="true"
        @blur="validateField('name')"
      />
      
      <!-- Amount Input -->
      <BaseInput
        v-model="form.amount"
        type="number"
        label="Amount ($)"
        placeholder="0.00"
        :icon="DollarSign"
        :error="errors.amount"
        :required="true"
        @blur="validateField('amount')"
      />
      
      <!-- Category Select -->
      <div class="form-group">
        <label class="input-label">Category</label>
        <div class="select-wrapper">
          <!-- [REQ 1] v-model for select binding -->
          <select v-model="form.category" class="select-field">
            <!-- [REQ 1] v-for for iterating options -->
            <option 
              v-for="category in categories" 
              :key="category"
              :value="category"
            >
              {{ category }}
            </option>
          </select>
        </div>
      </div>
      
      <!-- [REQ 7] Error Summary -->
      <!-- [REQ 1] v-if for conditional rendering -->
      <div v-if="errors.name || errors.amount" class="error-summary">
        <p>Please fix the errors above before submitting.</p>
      </div>
      
      <!-- Form Actions -->
      <div class="form-actions">
        <button 
          type="button" 
          class="btn-cancel"
          @click="handleCancel"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          class="btn-submit"
          :disabled="isSubmitting"
        >
          <!-- [REQ 1] v-if/else for loading state -->
          <span v-if="isSubmitting">Adding...</span>
          <span v-else>Add Expense</span>
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
/* [REQ 9] Scoped CSS */
.budget-form {
  background: var(--surface-color);
  border-radius: var(--radius);
  padding: 1.5rem;
  border: 1px solid var(--border-color);
}

.form-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.1rem;
  color: var(--text-primary);
  margin-bottom: 1.5rem;
}

.title-icon {
  font-size: 1.25rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.input-label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
}

.select-wrapper {
  position: relative;
}

.select-field {
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  background: var(--surface-color);
  color: var(--text-primary);
  cursor: pointer;
  appearance: none;
  transition: var(--transition);
}

.select-wrapper::after {
  content: '▼';
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-secondary);
  font-size: 0.75rem;
  pointer-events: none;
}

.select-field:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
}

.error-summary {
  padding: 0.75rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--danger-color);
  border-radius: var(--radius);
  color: var(--danger-color);
  font-size: 0.875rem;
  margin-bottom: 1rem;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.btn-cancel {
  flex: 1;
  padding: 0.75rem;
  background: transparent;
  color: var(--text-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--radius);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.btn-cancel:hover {
  border-color: var(--text-secondary);
  color: var(--text-primary);
}

.btn-submit {
  flex: 2;
  padding: 0.75rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius);
  font-weight: 500;
  cursor: pointer;
  transition: var(--transition);
}

.btn-submit:hover:not(:disabled) {
  background: var(--primary-hover);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
