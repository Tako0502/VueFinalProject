import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import * as api from '@/services/api'

export const useTaskStore = defineStore('tasks', () => {
    const tasks = ref([])
    const isLoading = ref(false)
    const error = ref(null)

    const completedTasks = computed(() => {
        return tasks.value.filter(task => task.completed)
    })

    const pendingTasks = computed(() => {
        return tasks.value.filter(task => !task.completed)
    })

    const getTasksByDate = computed(() => {
        return (date) => {
            return tasks.value.filter(task => task.date === date)
        }
    })

    const taskStats = computed(() => {
        const total = tasks.value.length
        const completed = completedTasks.value.length
        const pending = pendingTasks.value.length
        const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

        return { total, completed, pending, percentage }
    })





    async function loadTasks() {
        isLoading.value = true
        error.value = null

        try {
            tasks.value = await api.fetchTasks()
        } catch (err) {
            error.value = err.message
            console.error('Failed to load tasks:', err)
        } finally {
            isLoading.value = false
        }
    }

    async function loadTasksByDate(date) {
        isLoading.value = true
        error.value = null

        try {
            const dateTasks = await api.fetchTasksByDate(date)

            dateTasks.forEach(task => {
                const index = tasks.value.findIndex(t => t.id === task.id)
                if (index > -1) {
                    tasks.value[index] = task
                } else {
                    tasks.value.push(task)
                }
            })
            return dateTasks
        } catch (err) {
            error.value = err.message
            return []
        } finally {
            isLoading.value = false
        }
    }

    async function addTask(taskData) {
        isLoading.value = true
        error.value = null

        try {
            const newTask = await api.createTask(taskData)
            tasks.value.push(newTask)
            return newTask
        } catch (err) {
            error.value = err.message
            return null
        } finally {
            isLoading.value = false
        }
    }

    async function toggleTask(taskId) {
        error.value = null

        try {
            const updatedTask = await api.toggleTask(taskId)
            const index = tasks.value.findIndex(t => t.id === taskId)
            if (index > -1) {
                tasks.value[index] = updatedTask
            }
            return updatedTask
        } catch (err) {
            error.value = err.message
            return null
        }
    }

    async function updateTask(taskId, updates) {
        error.value = null

        try {
            const updatedTask = await api.updateTask(taskId, updates)
            const index = tasks.value.findIndex(t => t.id === taskId)
            if (index > -1) {
                tasks.value[index] = updatedTask
            }
            return updatedTask
        } catch (err) {
            error.value = err.message
            return null
        }
    }

    async function deleteTask(taskId) {
        error.value = null

        try {
            await api.deleteTask(taskId)
            const index = tasks.value.findIndex(t => t.id === taskId)
            if (index > -1) {
                tasks.value.splice(index, 1)
            }
            return true
        } catch (err) {
            error.value = err.message
            return false
        }
    }

    function clearCompleted() {

        const completedIds = completedTasks.value.map(t => t.id)
        completedIds.forEach(id => deleteTask(id))
    }

    function setTasks(newTasks) {
        tasks.value = newTasks
    }

    function setLoading(loading) {
        isLoading.value = loading
    }

    function setError(err) {
        error.value = err
    }

    return {
        tasks,
        isLoading,
        error,
        completedTasks,
        pendingTasks,
        getTasksByDate,
        taskStats,
        loadTasks,
        loadTasksByDate,
        addTask,
        toggleTask,
        updateTask,
        deleteTask,
        clearCompleted,
        setTasks,
        setLoading,
        setError
    }
})
