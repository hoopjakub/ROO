<!-- 
  FpsMonitor.vue - Display frames per second (FPS) counter
  
  Purpose:
  - Monitor app performance in real-time
  - Display current FPS using requestAnimationFrame
  - Color-coded indicator (green: good, yellow: fair, red: poor)
  - Help identify performance issues
  
  Features:
  - Real-time FPS calculation
  - Average FPS over time
  - Visual performance indicator
  - Toggle show/hide
-->

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useDeviceStatus } from '../composables/useDeviceStatus'

// Get FPS from composable
const { fps } = useDeviceStatus()

// Show/hide toggle
const isVisible = ref(true)

/**
 * Get FPS color based on performance
 * @returns {string} CSS color class
 */
const getFpsColor = () => {
  if (fps.value >= 50) return 'green'
  if (fps.value >= 30) return 'yellow'
  return 'red'
}

/**
 * Get performance status text
 * @returns {string} Performance description
 */
const getPerformanceStatus = () => {
  if (fps.value >= 50) return 'Excellent'
  if (fps.value >= 30) return 'Good'
  if (fps.value >= 20) return 'Fair'
  return 'Poor'
}

/**
 * Toggle visibility
 */
const toggleVisibility = () => {
  isVisible.value = !isVisible.value
}
</script>

<template>
  <div class="fps-monitor">
    <!-- Collapsed view (just icon) -->
    <button
      v-if="!isVisible"
      @click="toggleVisibility"
      class="fps-toggle"
      title="Show FPS Monitor"
    >
      📊
    </button>

    <!-- Expanded view (full stats) -->
    <div
      v-else
      class="fps-display"
      :class="getFpsColor()"
      :title="`Performance: ${getPerformanceStatus()}`"
    >
      <button @click="toggleVisibility" class="close-btn">✕</button>
      
      <div class="fps-content">
        <span class="icon">📊</span>
        <div class="fps-info">
          <div class="fps-value">{{ Math.round(fps) }}</div>
          <div class="fps-label">FPS</div>
        </div>
      </div>
      
      <div class="performance-bar">
        <div
          class="performance-fill"
          :style="{ width: `${(fps / 60) * 100}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Main container */
.fps-monitor {
  display: inline-flex;
  align-items: center;
}

/* Toggle button (collapsed state) */
.fps-toggle {
  padding: 6px 12px;
  background-color: var(--color-background-soft, #f9f9f9);
  border: none;
  border-radius: 20px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.fps-toggle:hover {
  background-color: var(--color-border, #e0e0e0);
  transform: scale(1.05);
}

/* FPS display (expanded state) */
.fps-display {
  position: relative;
  padding: 10px 15px;
  background-color: var(--color-background-soft, #f9f9f9);
  border-radius: 12px;
  min-width: 120px;
  transition: all 0.3s;
}

/* Close button */
.close-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  background: none;
  border: none;
  font-size: 0.8rem;
  cursor: pointer;
  color: var(--color-text-mute, #999);
  padding: 2px;
  line-height: 1;
}

.close-btn:hover {
  color: var(--color-text, #333);
}

/* FPS content */
.fps-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.fps-content .icon {
  font-size: 1.5rem;
}

.fps-info {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.fps-value {
  font-size: 1.5rem;
  font-weight: 700;
  line-height: 1;
}

.fps-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-top: 2px;
}

/* Performance bar */
.performance-bar {
  height: 4px;
  background-color: rgba(0, 0, 0, 0.1);
  border-radius: 2px;
  margin-top: 8px;
  overflow: hidden;
}

.performance-fill {
  height: 100%;
  background-color: currentColor;
  transition: width 0.3s ease;
  border-radius: 2px;
}

/* Color states */
.fps-display.green {
  color: #2d8659;
  background-color: rgba(45, 134, 89, 0.1);
}

.fps-display.yellow {
  color: #f59e0b;
  background-color: rgba(245, 158, 11, 0.1);
}

.fps-display.red {
  color: #ef4444;
  background-color: rgba(239, 68, 68, 0.1);
  animation: warning 2s ease-in-out infinite;
}

@keyframes warning {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.02); }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .fps-toggle {
    background-color: #2c2c2c;
  }
  
  .fps-display {
    background-color: #2c2c2c;
  }
  
  .fps-display.green {
    background-color: rgba(45, 134, 89, 0.2);
  }
  
  .fps-display.yellow {
    background-color: rgba(245, 158, 11, 0.2);
  }
  
  .fps-display.red {
    background-color: rgba(239, 68, 68, 0.2);
  }
  
  .close-btn:hover {
    color: #fff;
  }
}
</style>
