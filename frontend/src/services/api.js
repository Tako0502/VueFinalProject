const DEFAULT_DEV_API_BASE_URL = 'http://localhost:8000'
const API_BASE_URL =
    import.meta.env.VITE_API_BASE_URL ??
    (import.meta.env.DEV ? DEFAULT_DEV_API_BASE_URL : '')

function getToken() {
    return localStorage.getItem('lifeos_token')
}

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

    if (response.status === 401) {
        removeToken()
        window.location.href = '/login'
        throw new Error('Session expired. Please login again.')
    }

    if (response.status === 204) {
        return null
    }

    const data = await response.json()

    if (!response.ok) {
        throw new Error(data.detail || 'API request failed')
    }

    return data
}


export async function registerUser(userData) {
    const data = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(userData)
    })

    setToken(data.access_token)
    return data
}

export async function loginUser(credentials) {
    const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    })

    setToken(data.access_token)
    return data
}

export function logoutUser() {
    removeToken()
}

export async function fetchUserProfile() {
    return apiRequest('/users/me')
}

export async function updateUserProfile(data) {
    return apiRequest('/users/me', {
        method: 'PUT',
        body: JSON.stringify(data)
    })
}

export async function fetchBudgetSummary() {
    return apiRequest('/users/me/budget')
}


export async function fetchTasks() {
    return apiRequest('/tasks')
}

export async function fetchTasksByDate(date) {
    return apiRequest(`/tasks/date/${date}`)
}

export async function createTask(task) {
    return apiRequest('/tasks', {
        method: 'POST',
        body: JSON.stringify(task)
    })
}

export async function updateTask(id, updates) {
    return apiRequest(`/tasks/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
    })
}

export async function toggleTask(id) {
    return apiRequest(`/tasks/${id}/toggle`, {
        method: 'PATCH'
    })
}

export async function deleteTask(id) {
    return apiRequest(`/tasks/${id}`, {
        method: 'DELETE'
    })
}


export async function fetchExpenses() {
    return apiRequest('/expenses')
}

export async function fetchExpenseSummary() {
    return apiRequest('/expenses/summary')
}

export async function createExpense(expense) {
    return apiRequest('/expenses', {
        method: 'POST',
        body: JSON.stringify(expense)
    })
}

export async function deleteExpense(id) {
    return apiRequest(`/expenses/${id}`, {
        method: 'DELETE'
    })
}

export async function clearAllExpenses() {
    return apiRequest('/expenses', {
        method: 'DELETE'
    })
}


export { getToken, setToken, removeToken }
