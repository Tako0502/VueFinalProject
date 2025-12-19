import { ref, watchEffect } from 'vue'

export function useLocalStorage(key, defaultValue) {
    const storedValue = localStorage.getItem(key)
    const data = ref(storedValue ? JSON.parse(storedValue) : defaultValue)

    watchEffect(() => {
        localStorage.setItem(key, JSON.stringify(data.value))
    })

    function clear() {
        localStorage.removeItem(key)
        data.value = defaultValue
    }

    return {
        data,
        clear
    }
}

export function useLocalStorageList(key) {
    const storedValue = localStorage.getItem(key)
    const items = ref(storedValue ? JSON.parse(storedValue) : [])

    watchEffect(() => {
        localStorage.setItem(key, JSON.stringify(items.value))
    })

    function add(item) {
        items.value.push({
            ...item,
            id: Date.now(),
            createdAt: new Date().toISOString()
        })
    }

    function remove(id) {
        const index = items.value.findIndex(item => item.id === id)
        if (index > -1) {
            items.value.splice(index, 1)
        }
    }

    function update(id, updates) {
        const index = items.value.findIndex(item => item.id === id)
        if (index > -1) {
            items.value[index] = { ...items.value[index], ...updates }
        }
    }

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
