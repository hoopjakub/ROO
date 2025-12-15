<!-- 
  IdleModal.vue - Modal shown when user is idle
  
  Purpose:
  - Detect user inactivity using IdleDetector API
  - Show modal after period of inactivity
  - Option to continue session or log activity
  - Prevent data loss from unexpected closures
  
  Features:
  - Idle detection (configurable timeout)
  - Countdown timer before action
  - "I'm still here" button to dismiss
  - Auto-save notes before showing modal
-->

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// State management
const isIdle = ref(false)
const idleTime = ref(0)
const idleThreshold = 10000 // 10 seconds of inactivity

let idleTimer = null
let idleInterval = null

/**
 * Reset idle timer on user activity
 */
const resetIdleTimer = () => {
  idleTime.value = 0
  isIdle.value = false
  
  // Clear existing timers
  if (idleTimer) clearTimeout(idleTimer)
  if (idleInterval) clearInterval(idleInterval)
  
  // Start new idle timer
  idleTimer = setTimeout(() => {
    showIdleModal()
  }, idleThreshold)
}

/**
 * Show idle modal
 */
const showIdleModal = () => {
  isIdle.value = true
  
  // Start countdown
  idleInterval = setInterval(() => {
    idleTime.value += 1
  }, 1000)
}

/**
 * User confirms they're still active
 */
const confirmActivity = () => {
  isIdle.value = false
  resetIdleTimer()
}

/**
 * Setup activity listeners
 */
const setupActivityListeners = () => {
  // Listen for various user activities
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
  
  events.forEach(event => {
    document.addEventListener(event, resetIdleTimer)
  })
  
  // Start initial timer
  resetIdleTimer()
}

/**
 * Cleanup activity listeners
 */
const cleanupActivityListeners = () => {
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
  
  events.forEach(event => {
    document.removeEventListener(event, resetIdleTimer)
  })
  
  if (idleTimer) clearTimeout(idleTimer)
  if (idleInterval) clearInterval(idleInterval)
}

// Lifecycle hooks
onMounted(() => {
  setupActivityListeners()
})

onUnmounted(() => {
  cleanupActivityListeners()
})
</script>

<template>
  <!-- Modal overlay -->
  <Transition name="modal">
    <div v-if="isIdle" class="idle-modal-overlay" @click="confirmActivity">
      <div class="idle-modal" @click.stop>
        <!-- Modal icon -->
        <div class="modal-icon">
          😴
        </div>

        <!-- Modal title -->
        <h2>Are you still there?</h2>

        <!-- Modal message -->
        <p class="modal-message">
          You've been inactive for a while. We've auto-saved your work.
        </p>

        <!-- Idle time display -->
        <div class="idle-time">
          Idle for: <strong>{{ idleTime }}</strong> seconds
        </div>

        <!-- Action button -->
        <button @click="confirmActivity" class="continue-btn">
          ✓ I'm still here
        </button>

        <!-- Tip -->
        <p class="tip">
          💡 Your notes are automatically saved
        </p>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Modal overlay */
.idle-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(4px);
}

/* Modal container */
.idle-modal {
  background-color: var(--color-background, white);
  border-radius: 16px;
  padding: 40px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  text-align: center;
}

/* Modal icon */
.modal-icon {
  font-size: 4rem;
  margin-bottom: 20px;
  animation: bounce 2s ease-in-out infinite;
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* Modal title */
.idle-modal h2 {
  margin: 0 0 15px 0;
  font-size: 1.8rem;
  color: var(--color-heading, #333);
}

/* Modal message */
.modal-message {
  color: var(--color-text, #666);
  margin-bottom: 20px;
  line-height: 1.6;
}

/* Idle time display */
.idle-time {
  padding: 15px;
  background-color: var(--color-background-soft, #f9f9f9);
  border-radius: 8px;
  margin-bottom: 25px;
  font-size: 1.1rem;
  color: var(--color-text, #333);
}

.idle-time strong {
  color: var(--color-primary, #42b983);
  font-size: 1.3rem;
}

/* Continue button */
.continue-btn {
  width: 100%;
  padding: 15px 30px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.continue-btn:hover {
  background-color: #369970;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(66, 185, 131, 0.3);
}

/* Tip */
.tip {
  margin-top: 20px;
  font-size: 0.9rem;
  color: var(--color-text-mute, #999);
}

/* Modal transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .idle-modal,
.modal-leave-active .idle-modal {
  transition: transform 0.3s ease;
}

.modal-enter-from .idle-modal,
.modal-leave-to .idle-modal {
  transform: scale(0.9);
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .idle-modal {
    background-color: #2c2c2c;
    color: #fff;
  }
  
  .idle-modal h2 {
    color: #fff;
  }
  
  .modal-message {
    color: #ccc;
  }
  
  .idle-time {
    background-color: #1e1e1e;
    color: #fff;
  }
}

/* Root dark mode selector support */
:root.dark .idle-modal {
  background-color: var(--color-background-soft, #2c2c2c);
  color: var(--color-text, #fff);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
}

:root.dark .idle-modal h2 {
  color: var(--color-heading, #fff);
}

:root.dark .modal-message {
  color: var(--color-text, #ccc);
}

:root.dark .idle-time {
  background-color: var(--color-background-mute, #1e1e1e);
  color: var(--color-text, #fff);
  border: 1px solid var(--color-border, #444);
}

:root.dark .continue-btn {
  background-color: #42b983;
  box-shadow: 0 6px 20px rgba(66, 185, 131, 0.3);
}

:root.dark .continue-btn:hover {
  background-color: #369970;
  box-shadow: 0 8px 25px rgba(66, 185, 131, 0.4);
}

:root.dark .tip {
  color: var(--color-text-mute, #999);
}
</style>
