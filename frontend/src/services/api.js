/**
 * API Service - Real Backend Integration
 * Connects Vue frontend to Python FastAPI backend
 */

const API_BASE_URL = 'http://localhost:8000'

/**
 * Get stored JWT token
 */
function getToken() {
    return localStorage.getItem('lifeos_token')
}

/**
 * Set JWT token in storage
 */
function setToken(token) {
    localStorage.setItem('lifeos_token', token)
}


function removeToken() {
    localStorage.removeItem('lifeos_token')
}

async function apiRequest(endpoint, options = {}) {
    const token = getToken()

    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` }),
            ...options.headers
        },
        ...options
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    // Handle 401 Unauthorized
    if (response.status === 401) {
        removeToken()
        window.location.href = '/login'
        throw new Error('Session expired. Please login again.')
    }

    // Handle no content responses
    if (response.status === 204) {
        return null
    }

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.detail || 'API request failed')
    }

    return data
}

// ============================================
// AUTHENTICATION API
// ============================================

/**
 * Register a new user
 */
export async function registerUser(userData) {
    const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    })

    setToken(data.access_token)
    return data
}

/**
 * Login with email and password
 */
export async function loginUser(credentials) {
    const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    })

    setToken(data.access_token)
    return data
}

/**
 * Logout - clear token
 */
export function logoutUser() {
    removeToken()
}

/**
 * Get current user profile
 */
export async function fetchUserProfile() {
    return apiRequest('/users/me')
}

/**
 * Update user profile
 */
export async function updateUserProfile(data) {
    return apiRequest('/users/me', {
        method: 'PUT',
        body: JSON.stringify(data)
    })
}

/**
 * Get budget summary
 */
export async function fetchBudgetSummary() {
    return apiRequest('/users/me/budget')
}

// ============================================
// TASKS API
// ============================================

/**
 * Fetch all tasks
 */
export async function fetchTasks() {
    return apiRequest('/tasks')
}

/**
 * Fetch tasks for a specific date
 */
export async function fetchTasksByDate(date) {
    return apiRequest(`/tasks/date/${date}`)
}

/**
 * Create a new task
 */
export async function createTask(task) {
    return apiRequest('/tasks', {
        method: 'POST',
        body: JSON.stringify(task)
    })
}

/**
 * Update a task
 */
export async function updateTask(id, updates) {
    return apiRequest(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
    })
}

/**
 * Toggle task completion
 */
export async function toggleTask(id) {
    return apiRequest(`/tasks/${id}/toggle`, {
        method: 'PATCH'
    })
}

/**
 * Delete a task
 */
export async function deleteTask(id) {
    return apiRequest(`/tasks/${id}`, {
        method: 'DELETE'
    })
}

// ============================================
// EXPENSES API
// ============================================

/**
 * Fetch all expenses
 */
export async function fetchExpenses() {
    return apiRequest('/expenses')
}

/**
 * Get expense summary
 */
export async function fetchExpenseSummary() {
    return apiRequest('/expenses/summary')
}

/**
 * Create a new expense
 */
export async function createExpense(expense) {
    return apiRequest('/expenses', {
        method: 'POST',
        body: JSON.stringify(expense)
    })
}

/**
 * Delete an expense
 */
export async function deleteExpense(id) {
    return apiRequest(`/expenses/${id}`, {
        method: 'DELETE'
    })
}

/**
 * Delete all expenses
 */
export async function clearAllExpenses() {
    return apiRequest('/expenses', {
        method: 'DELETE'
    })
}

// ============================================
// UTILITY EXPORTS
// ============================================

export { getToken, setToken, removeToken }
