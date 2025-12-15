<!-- 
  OfflineIndicator.vue - Display network connectivity status
  
  Purpose:
  - Show online/offline status using Network Information API
  - Alert user when connection is lost
  - Display connection type (wifi, cellular, etc.)
  - Show reconnection status
  
  Features:
  - Online/offline indicator
  - Connection type display
  - Visual feedback (color-coded)
  - Automatic reconnection detection
-->

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useDeviceStatus } from '../composables/useDeviceStatus'

// Get online status from composable
const { isOnline } = useDeviceStatus()

// Additional connection info
const connectionType = ref('unknown')
const effectiveType = ref('4g')

/**
 * Get connection information
 */
const updateConnectionInfo = () => {
  if ('connection' in navigator) {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    if (conn) {
      connectionType.value = conn.type || 'unknown'
      effectiveType.value = conn.effectiveType || '4g'
    }
  }
}

/**
 * Handle online event
 */
const handleOnline = () => {
  console.log('Connection restored')
  updateConnectionInfo()
}

/**
 * Handle offline event
 */
const handleOffline = () => {
  console.log('Connection lost')
}

// Lifecycle hooks
onMounted(() => {
  updateConnectionInfo()
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
})

onUnmounted(() => {
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})
</script>

<template>
  <div class="offline-indicator">
    <!-- Online status -->
    <div
      v-if="isOnline"
      class="status online"
      title="Connected to internet"
    >
      <span class="icon">🌐</span>
      <span class="text">Online</span>
    </div>

    <!-- Offline status -->
    <div
      v-else
      class="status offline"
      title="No internet connection"
    >
      <span class="icon">📡</span>
      <span class="text">Offline</span>
    </div>
  </div>
</template>

<style scoped>
/* Main container */
.offline-indicator {
  display: inline-flex;
  align-items: center;
}

/* Status display */
.status {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s;
}

.status .icon {
  font-size: 1.1rem;
}

.status .text {
  min-width: 50px;
}

/* Online state */
.status.online {
  color: #2d8659;
  background-color: rgba(45, 134, 89, 0.1);
}

/* Offline state */
.status.offline {
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.1);
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(0.98);
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .status.online {
    background-color: rgba(45, 134, 89, 0.2);
  }
  
  .status.offline {
    background-color: rgba(239, 68, 68, 0.2);
  }
}
</style>
