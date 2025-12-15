/**
 * useNotificationManager.js - Push notifications manager
 * 
 * Purpose:
 * - Handle browser push notifications
 * - Request notification permissions
 * - Send notifications for app events
 * - Support notification actions
 * 
 * Features:
 * - Permission request handling
 * - Send desktop notifications
 * - Custom notification icons and actions
 * - Auto-dismiss after timeout
 * - Notification click handlers
 * 
 * Usage:
 * const { sendNotification, requestPermission, hasPermission } = useNotificationManager()
 */

import { ref } from 'vue'

// Notification permission state
const hasPermission = ref(false)
const permissionStatus = ref('default') // 'default', 'granted', 'denied'

/**
 * Initialize notification manager
 * @returns {Object} Notification functions and state
 */
export function useNotificationManager() {
  /**
   * Check if notifications are supported
   * @returns {boolean} True if supported
   */
  const isSupported = () => {
    return 'Notification' in window
  }

  /**
   * Check current permission status
   */
  const checkPermission = () => {
    if (!isSupported()) {
      permissionStatus.value = 'unsupported'
      return
    }

    permissionStatus.value = Notification.permission
    hasPermission.value = Notification.permission === 'granted'
  }

  /**
   * Request notification permission from user
   * @returns {Promise<boolean>} True if granted
   */
  const requestPermission = async () => {
    if (!isSupported()) {
      console.warn('Notifications not supported')
      return false
    }

    if (Notification.permission === 'granted') {
      hasPermission.value = true
      return true
    }

    try {
      const permission = await Notification.requestPermission()
      permissionStatus.value = permission
      hasPermission.value = permission === 'granted'
      
      return hasPermission.value
    } catch (error) {
      console.error('Failed to request notification permission:', error)
      return false
    }
  }

  /**
   * Send a notification
   * @param {string} title - Notification title
   * @param {Object} options - Notification options
   * @param {string} options.body - Notification body text
   * @param {string} options.icon - Icon URL
   * @param {string} options.tag - Unique tag to prevent duplicates
   * @param {number} options.timeout - Auto-dismiss timeout (ms)
   * @param {Function} options.onClick - Click handler
   * @returns {Notification|null} Notification instance or null
   */
  const sendNotification = (title, options = {}) => {
    if (!isSupported() || !hasPermission.value) {
      console.warn('Cannot send notification: permission not granted')
      return null
    }

    try {
      const {
        body = '',
        icon = '/icon.png',
        tag = `note-${Date.now()}`,
        timeout = 5000,
        onClick = null
      } = options

      // Create notification
      const notification = new Notification(title, {
        body,
        icon,
        tag,
        badge: icon,
        vibrate: [200, 100, 200], // Vibration pattern
        requireInteraction: false
      })

      // Handle click event
      if (onClick) {
        notification.onclick = (event) => {
          event.preventDefault()
          onClick(event)
          notification.close()
        }
      }

      // Auto-dismiss after timeout
      if (timeout > 0) {
        setTimeout(() => {
          notification.close()
        }, timeout)
      }

      return notification
    } catch (error) {
      console.error('Failed to send notification:', error)
      return null
    }
  }

  /**
   * Send note saved notification
   * @param {string} noteTitle - Title of saved note
   */
  const notifyNoteSaved = (noteTitle) => {
    sendNotification('Note Saved ✓', {
      body: `"${noteTitle}" has been saved successfully`,
      icon: '/icon.png',
      tag: 'note-saved',
      timeout: 3000
    })
  }

  /**
   * Send note deleted notification
   * @param {string} noteTitle - Title of deleted note
   */
  const notifyNoteDeleted = (noteTitle) => {
    sendNotification('Note Deleted', {
      body: `"${noteTitle}" has been deleted`,
      icon: '/icon.png',
      tag: 'note-deleted',
      timeout: 3000
    })
  }

  /**
   * Send reminder notification
   * @param {string} message - Reminder message
   */
  const notifyReminder = (message) => {
    sendNotification('Reminder 🔔', {
      body: message,
      icon: '/icon.png',
      tag: 'reminder',
      timeout: 0, // No auto-dismiss
      onClick: () => {
        window.focus() // Focus app window
      }
    })
  }

  /**
   * Send offline notification
   */
  const notifyOffline = () => {
    sendNotification('You are offline 📡', {
      body: 'Your changes will be saved locally',
      icon: '/icon.png',
      tag: 'offline-status',
      timeout: 5000
    })
  }

  /**
   * Send back online notification
   */
  const notifyOnline = () => {
    sendNotification('Back online 🌐', {
      body: 'Your connection has been restored',
      icon: '/icon.png',
      tag: 'online-status',
      timeout: 3000
    })
  }

  // Check permission on initialization
  checkPermission()

  // Return public API
  return {
    hasPermission,
    permissionStatus,
    isSupported,
    checkPermission,
    requestPermission,
    sendNotification,
    notifyNoteSaved,
    notifyNoteDeleted,
    notifyReminder,
    notifyOffline,
    notifyOnline
  }
}
