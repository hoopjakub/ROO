<!-- 
  BatteryIndicator.vue - Display device battery status
  
  Purpose:
  - Show current battery level and charging status
  - Use Battery Status API (if available)
  - Display visual indicator (color-coded by level)
  - Show alert when battery is low
  
  Features:
  - Battery percentage display
  - Charging indicator (lightning bolt icon)
  - Color coding: green (>50%), yellow (20-50%), red (<20%)
  - Fallback message if API not supported
-->

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useDeviceStatus } from '../composables/useDeviceStatus'

// Get battery status from composable
const { battery, batteryLevel, batteryCharging, batterySupported } = useDeviceStatus()

/**
 * Get battery color based on level
 * @returns {string} CSS color class
 */
const getBatteryColor = () => {
  if (!batteryLevel.value) return 'gray'
  
  const level = batteryLevel.value * 100
  if (level > 50) return 'green'
  if (level > 20) return 'yellow'
  return 'red'
}

/**
 * Get battery icon based on level and charging status
 * @returns {string} Battery level indicator
 */
const getBatteryIcon = () => {
  if (batteryCharging.value) return '🔌'
  
  const level = batteryLevel.value * 100
  if (level > 75) return 'Full'
  if (level > 50) return 'Good'
  if (level > 25) return 'Low'
  return 'Critical'
}
</script>

<template>
  <div class="battery-indicator">
    <!-- Battery not supported -->
    <div v-if="!batterySupported" class="battery-status" title="Battery API not supported">
      <span class="icon">🔌</span>
      <span class="text">N/A</span>
    </div>

    <!-- Battery supported -->
    <div
      v-else
      class="battery-status"
      :class="getBatteryColor()"
      :title="batteryCharging ? 'Charging' : 'Battery'"
    >
      <span class="icon">{{ getBatteryIcon() }}</span>
      <span class="text">
        {{ Math.round(batteryLevel * 100) }}%
      </span>
      <span v-if="batteryCharging" class="charging-indicator">Charging</span>
    </div>
  </div>
</template>

<style scoped>
/* Main container */
.battery-indicator {
  display: inline-flex;
  align-items: center;
}

/* Battery status display */
.battery-status {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 6px 12px;
  background-color: var(--color-background-soft, #f9f9f9);
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s;
}

.battery-status .icon {
  font-size: 1.1rem;
}

.battery-status .text {
  min-width: 35px;
  text-align: center;
}

/* Charging indicator */
.charging-indicator {
  font-size: 0.8rem;
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

/* Color states */
.battery-status.green {
  color: #2d8659;
  background-color: rgba(45, 134, 89, 0.1);
}

.battery-status.yellow {
  color: #f59e0b;
  background-color: rgba(245, 158, 11, 0.1);
}

.battery-status.red {
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.1);
  animation: blink 2s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

.battery-status.gray {
  color: #999;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .battery-status {
    background-color: #2c2c2c;
  }
  
  .battery-status.green {
    background-color: rgba(45, 134, 89, 0.2);
  }
  
  .battery-status.yellow {
    background-color: rgba(245, 158, 11, 0.2);
  }
  
  .battery-status.red {
    background-color: rgba(239, 68, 68, 0.2);
  }
}
</style>
