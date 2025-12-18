/**
 * useFocusTimer Composable
 * [REQ 4] Demonstrates lifecycle hooks (onMounted) and composable patterns
 * 
 * A Pomodoro-style focus timer with configurable work/break durations
 */
import { ref, computed, onMounted, onUnmounted } from 'vue'

export function useFocusTimer(options = {}) {
    // Default options
    const defaultOptions = {
        workDuration: 25 * 60, // 25 minutes in seconds
        breakDuration: 5 * 60, // 5 minutes in seconds
        longBreakDuration: 15 * 60, // 15 minutes for long break
        sessionsBeforeLongBreak: 4
    }

    const config = { ...defaultOptions, ...options }

    // ============================================
    // [REQ 3] Using ref for reactive state
    // ============================================

    const timeRemaining = ref(config.workDuration)
    const isRunning = ref(false)
    const isWorkSession = ref(true)
    const completedSessions = ref(0)
    const totalFocusTime = ref(0) // Total focused seconds today

    let intervalId = null

    // ============================================
    // [REQ 3] Using computed for derived state
    // ============================================

    // Format time as MM:SS
    const formattedTime = computed(() => {
        const minutes = Math.floor(timeRemaining.value / 60)
        const seconds = timeRemaining.value % 60
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    })

    // Progress percentage (0-100)
    const progress = computed(() => {
        const total = isWorkSession.value ? config.workDuration : config.breakDuration
        return Math.round(((total - timeRemaining.value) / total) * 100)
    })

    // Current session type label
    const sessionLabel = computed(() => {
        if (isWorkSession.value) {
            return 'Focus Time'
        }
        return completedSessions.value % config.sessionsBeforeLongBreak === 0
            ? 'Long Break'
            : 'Short Break'
    })

    // Format total focus time as hours and minutes
    const formattedTotalTime = computed(() => {
        const hours = Math.floor(totalFocusTime.value / 3600)
        const minutes = Math.floor((totalFocusTime.value % 3600) / 60)
        if (hours > 0) {
            return `${hours}h ${minutes}m`
        }
        return `${minutes}m`
    })

    // ============================================
    // TIMER FUNCTIONS
    // ============================================

    /**
     * Start the timer
     */
    function start() {
        if (isRunning.value) return

        isRunning.value = true
        intervalId = setInterval(() => {
            if (timeRemaining.value > 0) {
                timeRemaining.value--
                // Track focus time only during work sessions
                if (isWorkSession.value) {
                    totalFocusTime.value++
                    saveFocusTime()
                }
            } else {
                // Timer completed
                handleTimerComplete()
            }
        }, 1000)
    }

    /**
     * Pause the timer
     */
    function pause() {
        isRunning.value = false
        if (intervalId) {
            clearInterval(intervalId)
            intervalId = null
        }
    }

    /**
     * Reset the timer to initial state
     */
    function reset() {
        pause()
        timeRemaining.value = isWorkSession.value ? config.workDuration : config.breakDuration
    }

    /**
     * Skip to next session
     */
    function skip() {
        pause()
        switchSession()
    }

    /**
     * Handle timer completion
     */
    function handleTimerComplete() {
        pause()

        if (isWorkSession.value) {
            completedSessions.value++
            // Play notification sound (if available)
            playNotificationSound()
        }

        switchSession()
    }

    /**
     * Switch between work and break sessions
     */
    function switchSession() {
        isWorkSession.value = !isWorkSession.value

        if (isWorkSession.value) {
            timeRemaining.value = config.workDuration
        } else {
            // Check if should be long break
            const shouldBeLongBreak = completedSessions.value % config.sessionsBeforeLongBreak === 0
            timeRemaining.value = shouldBeLongBreak ? config.longBreakDuration : config.breakDuration
        }
    }

    /**
     * Set custom time (for adjustments)
     */
    function setTime(minutes) {
        pause()
        timeRemaining.value = minutes * 60
    }

    /**
     * Play a notification sound
     */
    function playNotificationSound() {
        // Simple beep using Web Audio API
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)()
            const oscillator = audioContext.createOscillator()
            const gainNode = audioContext.createGain()

            oscillator.connect(gainNode)
            gainNode.connect(audioContext.destination)

            oscillator.frequency.value = 800
            oscillator.type = 'sine'
            gainNode.gain.value = 0.3

            oscillator.start()
            oscillator.stop(audioContext.currentTime + 0.2)
        } catch (e) {
            // Audio not supported, fail silently
        }
    }

    /**
     * Save focus time to localStorage
     */
    function saveFocusTime() {
        const today = new Date().toISOString().split('T')[0]
        localStorage.setItem(`lifeos_focus_${today}`, totalFocusTime.value.toString())
    }

    /**
     * Load today's focus time from localStorage
     */
    function loadFocusTime() {
        const today = new Date().toISOString().split('T')[0]
        const saved = localStorage.getItem(`lifeos_focus_${today}`)
        if (saved) {
            totalFocusTime.value = parseInt(saved, 10) || 0
        }
    }

    // ============================================
    // [REQ 4] LIFECYCLE HOOKS
    // ============================================

    // Load saved focus time when composable is mounted
    onMounted(() => {
        loadFocusTime()
        console.log('[useFocusTimer] Composable mounted, loaded focus time:', totalFocusTime.value)
    })

    // Cleanup interval when component unmounts
    onUnmounted(() => {
        if (intervalId) {
            clearInterval(intervalId)
        }
        console.log('[useFocusTimer] Composable unmounted, cleaned up timer')
    })

    // ============================================
    // RETURN PUBLIC API
    // ============================================

    return {
        // State
        timeRemaining,
        isRunning,
        isWorkSession,
        completedSessions,
        totalFocusTime,

        // Computed
        formattedTime,
        progress,
        sessionLabel,
        formattedTotalTime,

        // Methods
        start,
        pause,
        reset,
        skip,
        setTime
    }
}
