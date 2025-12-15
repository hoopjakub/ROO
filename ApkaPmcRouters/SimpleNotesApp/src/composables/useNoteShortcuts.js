/**
 * useNoteShortcuts.js - Keyboard shortcuts for notes app
 * 
 * Purpose:
 * - Define and handle keyboard shortcuts
 * - Improve productivity with hotkeys
 * - Support common editor shortcuts
 * - Cross-platform key binding support
 * 
 * Features:
 * - Ctrl+S / Cmd+S: Save note
 * - Ctrl+N / Cmd+N: New note
 * - Escape: Cancel/close
 * - Ctrl+F / Cmd+F: Focus search
 * - Customizable shortcuts
 * 
 * Usage:
 * useNoteShortcuts({
 *   onSave: () => console.log('Save'),
 *   onCancel: () => console.log('Cancel')
 * })
 */

import { onMounted, onUnmounted } from 'vue'

/**
 * Initialize keyboard shortcuts
 * @param {Object} callbacks - Callback functions for shortcuts
 * @param {Function} callbacks.onSave - Called on Ctrl+S
 * @param {Function} callbacks.onCancel - Called on Escape
 * @param {Function} callbacks.onNew - Called on Ctrl+N
 * @param {Function} callbacks.onSearch - Called on Ctrl+F
 */
export function useNoteShortcuts(callbacks = {}) {
  /**
   * Check if Mac OS (for Cmd vs Ctrl)
   * @returns {boolean} True if Mac
   */
  const isMac = () => {
    return navigator.platform.toUpperCase().indexOf('MAC') >= 0
  }

  /**
   * Handle keyboard events
   * @param {KeyboardEvent} event - Keyboard event
   */
  const handleKeyDown = (event) => {
    const { key, ctrlKey, metaKey, shiftKey } = event
    
    // Use Cmd on Mac, Ctrl on Windows/Linux
    const modKey = isMac() ? metaKey : ctrlKey

    // Ctrl+S / Cmd+S: Save
    if (modKey && key.toLowerCase() === 's') {
      event.preventDefault()
      if (callbacks.onSave) {
        callbacks.onSave()
      }
      return
    }

    // Ctrl+N / Cmd+N: New note
    if (modKey && key.toLowerCase() === 'n') {
      event.preventDefault()
      if (callbacks.onNew) {
        callbacks.onNew()
      }
      return
    }

    // Ctrl+F / Cmd+F: Focus search
    if (modKey && key.toLowerCase() === 'f') {
      event.preventDefault()
      if (callbacks.onSearch) {
        callbacks.onSearch()
      }
      return
    }

    // Escape: Cancel/close
    if (key === 'Escape') {
      event.preventDefault()
      if (callbacks.onCancel) {
        callbacks.onCancel()
      }
      return
    }

    // Ctrl+Shift+D / Cmd+Shift+D: Toggle dark mode
    if (modKey && shiftKey && key.toLowerCase() === 'd') {
      event.preventDefault()
      if (callbacks.onToggleDark) {
        callbacks.onToggleDark()
      }
      return
    }

    // Ctrl+Delete / Cmd+Delete: Delete note
    if (modKey && key === 'Delete') {
      event.preventDefault()
      if (callbacks.onDelete) {
        callbacks.onDelete()
      }
      return
    }
  }

  /**
   * Setup keyboard event listeners
   */
  const setupListeners = () => {
    document.addEventListener('keydown', handleKeyDown)
  }

  /**
   * Cleanup keyboard event listeners
   */
  const cleanupListeners = () => {
    document.removeEventListener('keydown', handleKeyDown)
  }

  // Lifecycle hooks
  onMounted(() => {
    setupListeners()
  })

  onUnmounted(() => {
    cleanupListeners()
  })

  // Return control functions
  return {
    setupListeners,
    cleanupListeners
  }
}
