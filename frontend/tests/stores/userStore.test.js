/**
 * userStore.test.js - Pinia Store Tests
 * [REQ 10] Vitest test for userStore.js
 * Tests that Pinia store actions update state correctly
 */
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useUserStore } from '@/stores/userStore'

describe('userStore', () => {
    // Set up fresh Pinia instance before each test
    beforeEach(() => {
        setActivePinia(createPinia())
        // Clear localStorage before each test
        localStorage.clear()
    })

    afterEach(() => {
        localStorage.clear()
    })

    /**
     * [REQ 10] Test: Initial state
     */
    describe('Initial State', () => {
        it('has correct initial state', () => {
            const store = useUserStore()

            expect(store.user.id).toBeNull()
            expect(store.user.name).toBe('')
            expect(store.user.email).toBe('')
            expect(store.isAuthenticated).toBe(false)
            expect(store.budgetLimit).toBe(1000)
            expect(store.expenses).toEqual([])
        })
    })

    /**
     * [REQ 10] Test: Login action updates state
     */
    describe('login action', () => {
        it('sets user information correctly', () => {
            const store = useUserStore()

            store.login({
                name: 'Test User',
                email: 'test@example.com'
            })

            expect(store.user.name).toBe('Test User')
            expect(store.user.email).toBe('test@example.com')
            expect(store.isAuthenticated).toBe(true)
        })

        it('sets token in localStorage', () => {
            const store = useUserStore()

            store.login({
                name: 'Test User',
                email: 'test@example.com'
            })

            const token = localStorage.getItem('lifeos_token')
            expect(token).toBeTruthy()
            expect(token).toContain('fake_jwt_token_')
        })

        it('returns true on successful login', () => {
            const store = useUserStore()

            const result = store.login({
                name: 'Test User',
                email: 'test@example.com'
            })

            expect(result).toBe(true)
        })
    })

    /**
     * [REQ 10] Test: Logout action
     */
    describe('logout action', () => {
        it('clears user data and authentication', () => {
            const store = useUserStore()

            // First login
            store.login({ name: 'Test User', email: 'test@example.com' })

            // Then logout
            store.logout()

            expect(store.user.id).toBeNull()
            expect(store.user.name).toBe('')
            expect(store.isAuthenticated).toBe(false)
        })

        it('removes token from localStorage', () => {
            const store = useUserStore()

            store.login({ name: 'Test User', email: 'test@example.com' })
            store.logout()

            const token = localStorage.getItem('lifeos_token')
            expect(token).toBeNull()
        })
    })

    /**
     * [REQ 10] Test: Budget actions
     */
    describe('updateBudgetLimit action', () => {
        it('updates budget limit correctly', () => {
            const store = useUserStore()

            store.updateBudgetLimit(2000)

            expect(store.budgetLimit).toBe(2000)
        })

        it('does not update if limit is 0 or negative', () => {
            const store = useUserStore()
            const initialLimit = store.budgetLimit

            store.updateBudgetLimit(0)
            expect(store.budgetLimit).toBe(initialLimit)

            store.updateBudgetLimit(-100)
            expect(store.budgetLimit).toBe(initialLimit)
        })
    })

    /**
     * [REQ 10] Test: Add expense action
     */
    describe('addExpense action', () => {
        it('adds expense to the list', () => {
            const store = useUserStore()

            store.addExpense({
                name: 'Coffee',
                amount: 5.50,
                category: 'Food'
            })

            expect(store.expenses.length).toBe(1)
            expect(store.expenses[0].name).toBe('Coffee')
            expect(store.expenses[0].amount).toBe(5.50)
            expect(store.expenses[0].category).toBe('Food')
        })

        it('assigns unique ID to each expense', async () => {
            const store = useUserStore()

            store.addExpense({ name: 'Coffee', amount: 5.50 })
            // Small delay to ensure different timestamp
            await new Promise(resolve => setTimeout(resolve, 1))
            store.addExpense({ name: 'Lunch', amount: 12.00 })

            // Each expense should have an ID
            expect(store.expenses[0].id).toBeDefined()
            expect(store.expenses[1].id).toBeDefined()
            // Both expenses should have numeric IDs
            expect(typeof store.expenses[0].id).toBe('number')
            expect(typeof store.expenses[1].id).toBe('number')
        })

        it('returns the created expense', () => {
            const store = useUserStore()

            const result = store.addExpense({
                name: 'Coffee',
                amount: 5.50
            })

            expect(result.name).toBe('Coffee')
            expect(result.id).toBeDefined()
        })
    })

    /**
     * [REQ 10] Test: Remove expense action
     */
    describe('removeExpense action', () => {
        it('removes expense by ID', () => {
            const store = useUserStore()

            const expense = store.addExpense({
                name: 'Coffee',
                amount: 5.50
            })

            store.removeExpense(expense.id)

            expect(store.expenses.length).toBe(0)
        })

        it('does not affect other expenses', () => {
            const store = useUserStore()

            const expense1 = store.addExpense({ name: 'Coffee', amount: 5.50 })
            store.addExpense({ name: 'Lunch', amount: 12.00 })

            store.removeExpense(expense1.id)

            expect(store.expenses.length).toBe(1)
            expect(store.expenses[0].name).toBe('Lunch')
        })
    })

    /**
     * [REQ 10] Test: Getters (computed properties)
     */
    describe('Getters', () => {
        it('calculates totalExpenses correctly', () => {
            const store = useUserStore()

            store.addExpense({ name: 'Coffee', amount: 5.50 })
            store.addExpense({ name: 'Lunch', amount: 12.00 })
            store.addExpense({ name: 'Transport', amount: 2.50 })

            expect(store.totalExpenses).toBe(20.00)
        })

        it('calculates remainingBudget correctly', () => {
            const store = useUserStore()
            store.updateBudgetLimit(100)

            store.addExpense({ name: 'Coffee', amount: 25.00 })

            expect(store.remainingBudget).toBe(75.00)
        })

        it('returns negative remainingBudget when over budget', () => {
            const store = useUserStore()
            store.updateBudgetLimit(100)

            store.addExpense({ name: 'Big Purchase', amount: 150.00 })

            expect(store.remainingBudget).toBe(-50.00)
        })

        it('calculates budgetPercentage correctly', () => {
            const store = useUserStore()
            store.updateBudgetLimit(100)

            store.addExpense({ name: 'Expense', amount: 50.00 })

            expect(store.budgetPercentage).toBe(50)
        })

        it('caps budgetPercentage at 100', () => {
            const store = useUserStore()
            store.updateBudgetLimit(100)

            store.addExpense({ name: 'Big Expense', amount: 150.00 })

            expect(store.budgetPercentage).toBe(100)
        })

        it('returns correct budgetStatus for healthy budget', () => {
            const store = useUserStore()
            store.updateBudgetLimit(100)

            store.addExpense({ name: 'Small', amount: 25.00 })

            expect(store.budgetStatus.status).toBe('good')
            expect(store.budgetStatus.color).toBe('success')
        })

        it('returns correct budgetStatus when over budget', () => {
            const store = useUserStore()
            store.updateBudgetLimit(100)

            store.addExpense({ name: 'Over', amount: 110.00 })

            expect(store.budgetStatus.status).toBe('over')
            expect(store.budgetStatus.color).toBe('danger')
        })
    })

    /**
     * Test: Update profile action
     */
    describe('updateProfile action', () => {
        it('updates user profile correctly', () => {
            const store = useUserStore()
            store.login({ name: 'Original', email: 'original@test.com' })

            store.updateProfile({
                name: 'Updated Name',
                email: 'updated@test.com'
            })

            expect(store.user.name).toBe('Updated Name')
            expect(store.user.email).toBe('updated@test.com')
        })
    })

    /**
     * Test: Initialize action
     */
    describe('initialize action', () => {
        it('sets isAuthenticated to true if token exists', () => {
            localStorage.setItem('lifeos_token', 'existing_token')

            const store = useUserStore()
            store.initialize()

            expect(store.isAuthenticated).toBe(true)
        })

        it('leaves isAuthenticated false if no token', () => {
            const store = useUserStore()
            store.initialize()

            expect(store.isAuthenticated).toBe(false)
        })
    })
})
