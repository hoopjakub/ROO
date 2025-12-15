/**
 * useDeviceStatus.js - Device status monitoring
 * 
 * Purpose:
 * - Monitor device battery status
 * - Track online/offline connectivity
 * - Measure app performance (FPS)
 * - Provide device information
 * 
 * Features:
 * - Battery level and charging status
 * - Network connectivity detection
 * - Real-time FPS monitoring
 * - Device capabilities detection
 * - Memory usage tracking
 * 
 * Usage:
 * const { battery, isOnline, fps } = useDeviceStatus()
 */

import { ref, onMounted, onUnmounted } from 'vue'

// Global reactive state for device status
const batteryLevel = ref(1)
const batteryCharging = ref(false)
const batterySupported = ref(false)
const isOnline = ref(navigator.onLine)
const fps = ref(60)

/**
 * Initialize device status monitoring
 * @returns {Object} Device status data and monitoring functions
 */
export function useDeviceStatus() {
  // Battery monitoring
  let battery = null

  /**
   * Initialize battery monitoring
   */
  const setupBatteryMonitoring = async () => {
    if ('getBattery' in navigator) {
      try {
        battery = await navigator.getBattery()
        batterySupported.value = true

        // Update battery info
        const updateBattery = () => {
          batteryLevel.value = battery.level
          batteryCharging.value = battery.charging
        }

        // Initial update
        updateBattery()

        // Listen for battery changes
        battery.addEventListener('levelchange', updateBattery)
        battery.addEventListener('chargingchange', updateBattery)
      } catch (error) {
        console.warn('Battery API not supported:', error)
        batterySupported.value = false
      }
    } else {
      batterySupported.value = false
    }
  }

  /**
   * Handle online event
   */
  const handleOnline = () => {
    isOnline.value = true
    console.log('Device is online')
  }

  /**
   * Handle offline event
   */
  const handleOffline = () => {
    isOnline.value = false
    console.log('Device is offline')
  }

  /**
   * Setup network status monitoring
   */
  const setupNetworkMonitoring = () => {
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    // Initial check
    isOnline.value = navigator.onLine
  }

  /**
   * Cleanup network monitoring
   */
  const cleanupNetworkMonitoring = () => {
    window.removeEventListener('online', handleOnline)
    window.removeEventListener('offline', handleOffline)
  }

  // FPS monitoring
  let fpsFrameCount = 0
  let fpsLastTime = performance.now()
  let fpsAnimationId = null

  /**
   * Calculate FPS
   */
  const calculateFPS = () => {
    fpsFrameCount++
    const currentTime = performance.now()
    const elapsed = currentTime - fpsLastTime

    // Update FPS every second
    if (elapsed >= 1000) {
      fps.value = Math.round((fpsFrameCount * 1000) / elapsed)
      fpsFrameCount = 0
      fpsLastTime = currentTime
    }

    // Continue monitoring
    fpsAnimationId = requestAnimationFrame(calculateFPS)
  }

  /**
   * Setup FPS monitoring
   */
  const setupFPSMonitoring = () => {
    fpsAnimationId = requestAnimationFrame(calculateFPS)
  }

  /**
   * Cleanup FPS monitoring
   */
  const cleanupFPSMonitoring = () => {
    if (fpsAnimationId) {
      cancelAnimationFrame(fpsAnimationId)
      fpsAnimationId = null
    }
  }

  /**
   * Get device information
   * @returns {Object} Device info
   */
  const getDeviceInfo = () => {
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      cookieEnabled: navigator.cookieEnabled,
      onLine: navigator.onLine,
      hardwareConcurrency: navigator.hardwareConcurrency || 'unknown',
      deviceMemory: navigator.deviceMemory || 'unknown',
      connection: navigator.connection || navigator.mozConnection || navigator.webkitConnection
    }
  }

  /**
   * Get memory usage (if available)
   * @returns {Object|null} Memory info
   */
  const getMemoryInfo = () => {
    if ('memory' in performance) {
      return {
        jsHeapSizeLimit: performance.memory.jsHeapSizeLimit,
        totalJSHeapSize: performance.memory.totalJSHeapSize,
        usedJSHeapSize: performance.memory.usedJSHeapSize
      }
    }
    return null
  }

  /**
   * Check if device is low on battery
   * @param {number} threshold - Battery threshold (0-1)
   * @returns {boolean} True if low battery
   */
  const isLowBattery = (threshold = 0.2) => {
    return batterySupported.value && !batteryCharging.value && batteryLevel.value < threshold
  }

  /**
   * Get connection type (if available)
   * @returns {string} Connection type
   */
  const getConnectionType = () => {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    if (conn) {
      return conn.effectiveType || conn.type || 'unknown'
    }
    return 'unknown'
  }

  /**
   * Check if on metered connection
   * @returns {boolean} True if metered
   */
  const isMeteredConnection = () => {
    const conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    if (conn && 'saveData' in conn) {
      return conn.saveData
    }
    return false
  }

  // Lifecycle hooks
  onMounted(() => {
    setupBatteryMonitoring()
    setupNetworkMonitoring()
    setupFPSMonitoring()
  })

  onUnmounted(() => {
    cleanupNetworkMonitoring()
    cleanupFPSMonitoring()
  })

  // Return public API
  return {
    // Battery
    battery,
    batteryLevel,
    batteryCharging,
    batterySupported,
    isLowBattery,

    // Network
    isOnline,
    getConnectionType,
    isMeteredConnection,

    // Performance
    fps,

    // Device info
    getDeviceInfo,
    getMemoryInfo
  }
}
