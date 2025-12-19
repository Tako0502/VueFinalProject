import { ref, computed, onMounted, onUnmounted } from 'vue'

export function useFocusTimer(options = {}) {
    
    const defaultOptions = {
        workDuration: 25 * 60, 
        breakDuration: 5 * 60, 
        longBreakDuration: 15 * 60, 
        sessionsBeforeLongBreak: 4
    }

    const config = { ...defaultOptions, ...options }

    

    const timeRemaining = ref(config.workDuration)
    const isRunning = ref(false)
    const isWorkSession = ref(true)
    const completedSessions = ref(0)
    const totalFocusTime = ref(0) 

    let intervalId = null

    

    
    const formattedTime = computed(() => {
        const minutes = Math.floor(timeRemaining.value / 60)
        const seconds = timeRemaining.value % 60
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    })

    
    const progress = computed(() => {
        const total = isWorkSession.value ? config.workDuration : config.breakDuration
        return Math.round(((total - timeRemaining.value) / total) * 100)
    })

    
    const sessionLabel = computed(() => {
        if (isWorkSession.value) {
            return 'Focus Time'
        }
        return completedSessions.value % config.sessionsBeforeLongBreak === 0
            ? 'Long Break'
            : 'Short Break'
    })

    
    const formattedTotalTime = computed(() => {
        const hours = Math.floor(totalFocusTime.value / 3600)
        const minutes = Math.floor((totalFocusTime.value % 3600) / 60)
        if (hours > 0) {
            return `${hours}h ${minutes}m`
        }
        return `${minutes}m`
    })

    

    function start() {
        if (isRunning.value) return

        isRunning.value = true
        intervalId = setInterval(() => {
            if (timeRemaining.value > 0) {
                timeRemaining.value--
                
                if (isWorkSession.value) {
                    totalFocusTime.value++
                    saveFocusTime()
                }
            } else {
                
                handleTimerComplete()
            }
        }, 1000)
    }

    function pause() {
        isRunning.value = false
        if (intervalId) {
            clearInterval(intervalId)
            intervalId = null
        }
    }

    function reset() {
        pause()
        timeRemaining.value = isWorkSession.value ? config.workDuration : config.breakDuration
    }

    function skip() {
        pause()
        switchSession()
    }

    function handleTimerComplete() {
        pause()

        if (isWorkSession.value) {
            completedSessions.value++
            
            playNotificationSound()
        }

        switchSession()
    }

    function switchSession() {
        isWorkSession.value = !isWorkSession.value

        if (isWorkSession.value) {
            timeRemaining.value = config.workDuration
        } else {
            
            const shouldBeLongBreak = completedSessions.value % config.sessionsBeforeLongBreak === 0
            timeRemaining.value = shouldBeLongBreak ? config.longBreakDuration : config.breakDuration
        }
    }

    function setTime(minutes) {
        pause()
        timeRemaining.value = minutes * 60
    }

    function playNotificationSound() {
        
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
            
        }
    }

    function saveFocusTime() {
        const today = new Date().toISOString().split('T')[0]
        localStorage.setItem(`lifeos_focus_${today}`, totalFocusTime.value.toString())
    }

    function loadFocusTime() {
        const today = new Date().toISOString().split('T')[0]
        const saved = localStorage.getItem(`lifeos_focus_${today}`)
        if (saved) {
            totalFocusTime.value = parseInt(saved, 10) || 0
        }
    }

    

    
    onMounted(() => {
        loadFocusTime()
        console.log('[useFocusTimer] Composable mounted, loaded focus time:', totalFocusTime.value)
    })

    
    onUnmounted(() => {
        if (intervalId) {
            clearInterval(intervalId)
        }
        console.log('[useFocusTimer] Composable unmounted, cleaned up timer')
    })

    

    return {
        
        timeRemaining,
        isRunning,
        isWorkSession,
        completedSessions,
        totalFocusTime,

        
        formattedTime,
        progress,
        sessionLabel,
        formattedTotalTime,

        
        start,
        pause,
        reset,
        skip,
        setTime
    }
}
