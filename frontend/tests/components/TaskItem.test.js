/**
 * TaskItem.test.js - Component Tests
 * [REQ 10] Vitest test for TaskItem.vue
 * Tests that component renders props correctly and emits events
 */
import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskItem from '@/components/TaskItem.vue'

describe('TaskItem.vue', () => {
    // Sample task data for testing
    const mockTask = {
        id: 1,
        title: 'Test Task',
        description: 'This is a test task description',
        date: '2024-12-15',
        priority: 'high',
        completed: false
    }

    /**
     * [REQ 10] Test: Component renders task props correctly
     */
    it('renders task title correctly', () => {
        const wrapper = mount(TaskItem, {
            props: {
                task: mockTask
            }
        })

        // Check that title is rendered
        expect(wrapper.text()).toContain('Test Task')
    })

    it('renders task description when provided', () => {
        const wrapper = mount(TaskItem, {
            props: {
                task: mockTask
            }
        })

        // Check that description is rendered
        expect(wrapper.text()).toContain('This is a test task description')
    })

    it('renders priority badge with correct class', () => {
        const wrapper = mount(TaskItem, {
            props: {
                task: mockTask
            }
        })

        // Find priority badge
        const priorityBadge = wrapper.find('.priority-badge')
        expect(priorityBadge.exists()).toBe(true)
        expect(priorityBadge.classes()).toContain('priority--high')
        expect(priorityBadge.text()).toBe('high')
    })

    it('renders different priority styles correctly', async () => {
        // Test low priority
        const lowTask = { ...mockTask, priority: 'low' }
        const lowWrapper = mount(TaskItem, {
            props: { task: lowTask }
        })
        expect(lowWrapper.find('.priority-badge').classes()).toContain('priority--low')

        // Test medium priority
        const mediumTask = { ...mockTask, priority: 'medium' }
        const mediumWrapper = mount(TaskItem, {
            props: { task: mediumTask }
        })
        expect(mediumWrapper.find('.priority-badge').classes()).toContain('priority--medium')
    })

    /**
     * [REQ 10] Test: Completed state styling
     */
    it('applies completed class when task is completed', () => {
        const completedTask = { ...mockTask, completed: true }
        const wrapper = mount(TaskItem, {
            props: {
                task: completedTask
            }
        })

        // Check for completed class on wrapper
        expect(wrapper.find('.task-item').classes()).toContain('task-item--completed')
    })

    it('checkbox is checked when task is completed', () => {
        const completedTask = { ...mockTask, completed: true }
        const wrapper = mount(TaskItem, {
            props: {
                task: completedTask
            }
        })

        const checkbox = wrapper.find('input[type="checkbox"]')
        expect(checkbox.element.checked).toBe(true)
    })

    /**
     * [REQ 10] Test: Component emits toggle event
     */
    it('emits toggle event when checkbox is clicked', async () => {
        const wrapper = mount(TaskItem, {
            props: {
                task: mockTask
            }
        })

        // Find and click the checkbox
        const checkbox = wrapper.find('input[type="checkbox"]')
        await checkbox.trigger('change')

        // Check that toggle event was emitted with task ID
        expect(wrapper.emitted('toggle')).toBeTruthy()
        expect(wrapper.emitted('toggle')[0]).toEqual([mockTask.id])
    })

    /**
     * [REQ 10] Test: Component emits delete event
     */
    it('emits delete event when delete button is clicked', async () => {
        const wrapper = mount(TaskItem, {
            props: {
                task: mockTask,
                showDelete: true
            }
        })

        // Find and click the delete button
        const deleteButton = wrapper.find('.btn-delete')
        await deleteButton.trigger('click')

        // Check that delete event was emitted with task ID
        expect(wrapper.emitted('delete')).toBeTruthy()
        expect(wrapper.emitted('delete')[0]).toEqual([mockTask.id])
    })

    /**
     * [REQ 10] Test: Component emits edit event
     */
    it('emits edit event when edit button is clicked', async () => {
        const wrapper = mount(TaskItem, {
            props: {
                task: mockTask
            }
        })

        // Find and click the edit button
        const editButton = wrapper.find('.btn-edit')
        await editButton.trigger('click')

        // Check that edit event was emitted with task object
        expect(wrapper.emitted('edit')).toBeTruthy()
        expect(wrapper.emitted('edit')[0]).toEqual([mockTask])
    })

    /**
     * Test: Delete button visibility based on showDelete prop
     */
    it('hides delete button when showDelete is false', () => {
        const wrapper = mount(TaskItem, {
            props: {
                task: mockTask,
                showDelete: false
            }
        })

        // Delete button should not exist
        expect(wrapper.find('.btn-delete').exists()).toBe(false)
    })

    it('shows delete button when showDelete is true (default)', () => {
        const wrapper = mount(TaskItem, {
            props: {
                task: mockTask
            }
        })

        // Delete button should exist
        expect(wrapper.find('.btn-delete').exists()).toBe(true)
    })

    /**
     * Test: Date formatting
     */
    it('displays formatted date correctly', () => {
        const wrapper = mount(TaskItem, {
            props: {
                task: mockTask
            }
        })

        // Check that date is displayed (format: "Dec 15")
        expect(wrapper.text()).toMatch(/Dec\s*15/)
    })

    /**
     * Test: Handles task without description
     */
    it('renders correctly without description', () => {
        const taskWithoutDescription = {
            id: 2,
            title: 'Task without description',
            date: '2024-12-15',
            priority: 'medium',
            completed: false
        }

        const wrapper = mount(TaskItem, {
            props: {
                task: taskWithoutDescription
            }
        })

        // Should not find description element
        expect(wrapper.find('.task-description').exists()).toBe(false)
        // Title should still render
        expect(wrapper.text()).toContain('Task without description')
    })
})
