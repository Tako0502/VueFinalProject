/**
 * Mock API Service
 */

// Simulated delay to mimic network latency
const DELAY = 500

/**
 * Helper function to simulate network delay
 * @param {any} data - Data to return after delay
 * @param {boolean} shouldFail - Whether the request should fail
 * @returns {Promise} Resolves after delay with data or rejects with error
 */
function simulateDelay(data, shouldFail = false) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldFail) {
                reject(new Error('Network error: Failed to fetch data'))
            } else {
                resolve(data)
            }
        }, DELAY)
    })
}

/**
 * Mock task data
 */
const mockTasks = [
    {
        id: 1,
        title: 'Complete Vue.js Assignment',
        description: 'Finish the LifeOS project with all 12 requirements',
        date: new Date().toISOString().split('T')[0],
        priority: 'high',
        completed: false
    },
    {
        id: 2,
        title: 'Study for Midterm',
        description: 'Review chapters 5-8 for Computer Science exam',
        date: new Date().toISOString().split('T')[0],
        priority: 'high',
        completed: false
    },
    {
        id: 3,
        title: 'Grocery Shopping',
        description: 'Buy vegetables, fruits, and milk',
        date: new Date().toISOString().split('T')[0],
        priority: 'low',
        completed: true
    },
    {
        id: 4,
        title: 'Workout Session',
        description: '30 minutes cardio + strength training',
        date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
        priority: 'medium',
        completed: false
    }
]

/**
 * Mock expense data
 */
const mockExpenses = [
    { id: 1, name: 'Coffee', amount: 5.50, category: 'Food', date: new Date().toISOString().split('T')[0] },
    { id: 2, name: 'Textbook', amount: 45.00, category: 'Education', date: new Date().toISOString().split('T')[0] },
    { id: 3, name: 'Bus Pass', amount: 35.00, category: 'Transport', date: new Date().toISOString().split('T')[0] },
    { id: 4, name: 'Lunch', amount: 12.00, category: 'Food', date: new Date().toISOString().split('T')[0] }
]

// API FUNCTIONS

/**
 * Fetch all tasks
 * @returns {Promise<Array>} Array of tasks
 */
export async function fetchTasks() {
    console.log('[MockAPI] Fetching tasks...')
    return simulateDelay([...mockTasks])
}

/**
 * Fetch tasks for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Array>} Array of tasks for that date
 */
export async function fetchTasksByDate(date) {
    console.log('[MockAPI] Fetching tasks for date:', date)
    const filtered = mockTasks.filter(task => task.date === date)
    return simulateDelay(filtered)
}

/**
 * Add a new task
 * @param {Object} task - Task data
 * @returns {Promise<Object>} Created task with ID
 */
export async function createTask(task) {
    console.log('[MockAPI] Creating task:', task)
    const newTask = {
        ...task,
        id: Date.now(),
        completed: false,
        createdAt: new Date().toISOString()
    }
    mockTasks.push(newTask)
    return simulateDelay(newTask)
}

/**
 * Update a task
 * @param {number} id - Task ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated task
 */
export async function updateTask(id, updates) {
    console.log('[MockAPI] Updating task:', id, updates)
    const index = mockTasks.findIndex(t => t.id === id)
    if (index > -1) {
        mockTasks[index] = { ...mockTasks[index], ...updates }
        return simulateDelay(mockTasks[index])
    }
    return simulateDelay(null, true)
}

/**
 * Delete a task
 * @param {number} id - Task ID
 * @returns {Promise<boolean>} Success status
 */
export async function deleteTask(id) {
    console.log('[MockAPI] Deleting task:', id)
    const index = mockTasks.findIndex(t => t.id === id)
    if (index > -1) {
        mockTasks.splice(index, 1)
        return simulateDelay(true)
    }
    return simulateDelay(false, true)
}

/**
 * Fetch all expenses
 * @returns {Promise<Array>} Array of expenses
 */
export async function fetchExpenses() {
    console.log('[MockAPI] Fetching expenses...')
    return simulateDelay([...mockExpenses])
}

/**
 * Add a new expense
 * @param {Object} expense - Expense data
 * @returns {Promise<Object>} Created expense with ID
 */
export async function createExpense(expense) {
    console.log('[MockAPI] Creating expense:', expense)
    const newExpense = {
        ...expense,
        id: Date.now(),
        date: expense.date || new Date().toISOString().split('T')[0]
    }
    mockExpenses.push(newExpense)
    return simulateDelay(newExpense)
}

/**
 * Fetch user profile
 * @returns {Promise<Object>} User profile data
 */
export async function fetchUserProfile() {
    console.log('[MockAPI] Fetching user profile...')
    return simulateDelay({
        id: 1,
        name: 'Student User',
        email: 'student@university.edu',
        budgetLimit: 1000,
        preferences: {
            theme: 'dark',
            notifications: true,
            focusDuration: 25
        }
    })
}

/**
 * Update user profile
 * @param {Object} data - Profile data to update
 * @returns {Promise<Object>} Updated profile
 */
export async function updateUserProfile(data) {
    console.log('[MockAPI] Updating user profile:', data)
    return simulateDelay({ ...data, updatedAt: new Date().toISOString() })
}

/**
 * Simulate a failing request (for error state testing)
 * @returns {Promise} Always rejects with error
 */
export async function simulateError() {
    console.log('[MockAPI] Simulating error...')
    return simulateDelay(null, true)
}

/**
 * Validate user credentials (for login)
 * @param {Object} credentials - { email, password }
 * @returns {Promise<Object>} User data with fake token
 */
export async function loginUser(credentials) {
    console.log('[MockAPI] Logging in user:', credentials.email)
    // Simulate validation - accept any non-empty credentials
    if (credentials.email && credentials.password) {
        return simulateDelay({
            user: {
                id: 1,
                name: credentials.name || 'Student User',
                email: credentials.email
            },
            token: 'fake_jwt_token_' + Date.now()
        })
    }
    return simulateDelay(null, true)
}
