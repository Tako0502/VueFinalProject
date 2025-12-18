import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as api from '@/services/api'

export const useUserStore = defineStore('user', () => {

    const user = ref({
        id: null,
        name: '',
        email: ''
    })
    const isAuthenticated = ref(false)
    const budgetLimit = ref(1000)
    const expenses = ref([])
    const isLoading = ref(false)
    const error = ref(null)
    const totalExpenses = computed(() => {
        return expenses.value.reduce((total, expense) => total + expense.amount, 0)
    })
    const remainingBudget = computed(() => {
        return budgetLimit.value - totalExpenses.value
    })
    const budgetStatus = computed(() => {
        const percentage = (totalExpenses.value / budgetLimit.value) * 100
        if (percentage >= 100) {
            return { status: 'over', message: 'Budget exceeded!', color: 'danger' }
        } else if (percentage >= 80) {
            return { status: 'warning', message: 'Budget almost depleted', color: 'warning' }
        } else if (percentage >= 50) {
            return { status: 'moderate', message: 'Moderate spending', color: 'info' }
        }
        return { status: 'good', message: 'Budget healthy', color: 'success' }
    })

    const budgetPercentage = computed(() => {
        return Math.min(100, Math.round((totalExpenses.value / budgetLimit.value) * 100))
    })


    async function register(credentials) {
        isLoading.value = true
        error.value = null

        try {
            const data = await api.registerUser(credentials)
            user.value = data.user
            budgetLimit.value = data.user.budget_limit
            isAuthenticated.value = true
            return true
        } catch (err) {
            error.value = err.message
            return false
        } finally {
            isLoading.value = false
        }
    }

    async function login(credentials) {
        isLoading.value = true
        error.value = null

        try {
            const data = await api.loginUser(credentials)
            user.value = data.user
            budgetLimit.value = data.user.budget_limit
            isAuthenticated.value = true
    
            await loadExpenses()
            return true
        } catch (err) {
            error.value = err.message
            return false
        } finally {
            isLoading.value = false
        }
    }

    function logout() {
        api.logoutUser()
        user.value = { id: null, name: '', email: '' }
        isAuthenticated.value = false
        expenses.value = []
        budgetLimit.value = 1000
    }


    async function loadProfile() {
        try {
            const profile = await api.fetchUserProfile()
            user.value = profile
            budgetLimit.value = profile.budget_limit
            isAuthenticated.value = true
        } catch (err) {
    
            logout()
        }
    }

    async function updateProfile(profileData) {
        isLoading.value = true
        error.value = null

        try {
            const updated = await api.updateUserProfile(profileData)
            user.value = updated
            if (updated.budget_limit) {
                budgetLimit.value = updated.budget_limit
            }
            return true
        } catch (err) {
            error.value = err.message
            return false
        } finally {
            isLoading.value = false
        }
    }

    async function updateBudgetLimit(newLimit) {
        return updateProfile({ budget_limit: newLimit })
    }


    async function loadExpenses() {
        try {
            expenses.value = await api.fetchExpenses()
        } catch (err) {
            console.error('Failed to load expenses:', err)
        }
    }

    async function addExpense(expense) {
        isLoading.value = true
        error.value = null

        try {
            const newExpense = await api.createExpense(expense)
            expenses.value.push(newExpense)
            return newExpense
        } catch (err) {
            error.value = err.message
            return null
        } finally {
            isLoading.value = false
        }
    }

    async function removeExpense(expenseId) {
        try {
            await api.deleteExpense(expenseId)
            const index = expenses.value.findIndex(e => e.id === expenseId)
            if (index > -1) {
                expenses.value.splice(index, 1)
            }
        } catch (err) {
            error.value = err.message
        }
    }

    async function clearExpenses() {
        try {
            await api.clearAllExpenses()
            expenses.value = []
        } catch (err) {
            error.value = err.message
        }
    }


    async function initialize() {
        const token = api.getToken()
        if (token) {
            await loadProfile()
            if (isAuthenticated.value) {
                await loadExpenses()
            }
        }
    }

    return {
        user,
        isAuthenticated,
        budgetLimit,
        expenses,
        isLoading,
        error,
        totalExpenses,
        remainingBudget,
        budgetStatus,
        budgetPercentage,
        register,
        login,
        logout,
        loadProfile,
        updateProfile,
        updateBudgetLimit,
        loadExpenses,
        addExpense,
        removeExpense,
        clearExpenses,
        initialize
    }
})
