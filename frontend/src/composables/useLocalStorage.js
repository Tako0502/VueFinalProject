/**
 * useLocalStorage Composable
 */
import { ref, watchEffect } from 'vue'

/**
 * Creates a reactive ref that syncs with localStorage
 * @param {string} key - localStorage key
 * @param {any} defaultValue - Default value if nothing in storage
 * @returns {Ref} Reactive reference synced with localStorage
 */
export function useLocalStorage(key, defaultValue) {
    // Initialize with value from localStorage or default
    const storedValue = localStorage.getItem(key)
    const data = ref(storedValue ? JSON.parse(storedValue) : defaultValue)

    // watchEffect - Automatically syncs to localStorage
    // This runs immediately and whenever data.value changes
    watchEffect(() => {
        localStorage.setItem(key, JSON.stringify(data.value))
    })

    /**
     * Clear the stored value and reset to default
     */
    function clear() {
        localStorage.removeItem(key)
        data.value = defaultValue
    }

    return {
        data,
        clear
    }
}

/**
 * Composable for managing a list in localStorage
 * Useful for tasks, expenses, etc.
 * @param {string} key - localStorage key
 * @returns {Object} Reactive list with helper methods
 */
export function useLocalStorageList(key) {
    const storedValue = localStorage.getItem(key)
    const items = ref(storedValue ? JSON.parse(storedValue) : [])

    // watchEffect syncs list to localStorage whenever it changes
    watchEffect(() => {
        localStorage.setItem(key, JSON.stringify(items.value))
    })

    /**
     * Add an item to the list
     */
    function add(item) {
        items.value.push({
            ...item,
            id: Date.now(),
            createdAt: new Date().toISOString()
        })
    }

    /**
     * Remove an item by ID
     */
    function remove(id) {
        const index = items.value.findIndex(item => item.id === id)
        if (index > -1) {
            items.value.splice(index, 1)
        }
    }

    /**
     * Update an item by ID
     */
    function update(id, updates) {
        const index = items.value.findIndex(item => item.id === id)
        if (index > -1) {
            items.value[index] = { ...items.value[index], ...updates }
        }
    }

    /**
     * Clear all items
     */
    function clear() {
        items.value = []
    }

    return {
        items,
        add,
        remove,
        update,
        clear
    }
}
