<script setup>
import { ref, reactive, computed, inject } from 'vue'
import BaseInput from './BaseInput.vue'
import { useUserStore } from '@/stores/userStore'
import { Receipt, FileText, DollarSign } from 'lucide-vue-next'




const props = defineProps({
  
  mode: {
    type: String,
    default: 'expense'
  }
})




const emit = defineEmits(['submit', 'cancel'])


const userStore = useUserStore()
const showNotification = inject('showNotification', () => {})




const form = reactive({
  name: '',
  amount: '',
  category: 'General'
})


const errors = ref({
  name: '',
  amount: ''
})


const isSubmitting = ref(false)


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






const validateForm = () => {
  let isValid = true
  
  
  errors.value = { name: '', amount: '' }
  
  
  if (!form.name.trim()) {
    errors.value.name = 'Expense name is required'
    isValid = false
  } else if (form.name.length < 2) {
    errors.value.name = 'Name must be at least 2 characters'
    isValid = false
  }
  
  
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


const isFormValid = computed(() => {
  return form.name.trim() && 
         parseFloat(form.amount) > 0 && 
         !errors.value.name && 
         !errors.value.amount
})





const handleSubmit = async () => {
  
  if (!validateForm()) {
    return
  }
  
  isSubmitting.value = true
  
  try {
    
    const expense = {
      name: form.name.trim(),
      amount: parseFloat(form.amount),
      category: form.category
    }
    
    userStore.addExpense(expense)
    emit('submit', expense)
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
    
    <form @submit.prevent="handleSubmit" class="form">
      <BaseInput
        v-model="form.name"
        label="Expense Name"
        placeholder="e.g., Coffee, Books"
        :icon="FileText"
        :error="errors.name"
        :required="true"
        @blur="validateField('name')"
      />
      
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
      
      <div class="form-group">
        <label class="input-label">Category</label>
        <div class="select-wrapper">
          <select v-model="form.category" class="select-field">
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
      
      <div v-if="errors.name || errors.amount" class="error-summary">
        <p>Please fix the errors above before submitting.</p>
      </div>
      
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
          <span v-if="isSubmitting">Adding...</span>
          <span v-else>Add Expense</span>
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>

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
