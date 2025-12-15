/**
 * useDark.js - Composable for dark mode management
 * 
 * Purpose:
 * - Manage dark/light theme toggle
 * - Save theme preference to localStorage
 * - Apply theme to document and CSS variables
 * - Support system preference detection
 * 
 * Features:
 * - Reactive dark mode state
 * - Toggle function
 * - Persistent preference storage
 * - System theme detection
 * - CSS variable integration
 * 
 * Usage:
 * const { isDark, toggleDark } = useDark()
 */

import { ref, watch } from 'vue'

// Global state for dark mode (shared across components)
const isDark = ref(false)
let isInitialized = false

/**
 * Initialize dark mode composable
 * @returns {Object} Dark mode state and toggle function
 */
export function useDark() {
  /**
   * Apply CSS variables for theme
   */
  const applyThemeVariables = () => {
    const root = document.documentElement
    
    if (isDark.value) {
      // Dark mode colors
      root.style.setProperty('--color-background', '#1e1e1e')
      root.style.setProperty('--color-background-soft', '#2c2c2c')
      root.style.setProperty('--color-background-mute', '#3c3c3c')
      root.style.setProperty('--color-border', '#444444')
      root.style.setProperty('--color-text', '#ffffff')
      root.style.setProperty('--color-text-mute', '#999999')
      root.style.setProperty('--color-heading', '#ffffff')
    } else {
      // Light mode colors
      root.style.setProperty('--color-background', '#ffffff')
      root.style.setProperty('--color-background-soft', '#f9f9f9')
      root.style.setProperty('--color-background-mute', '#f0f0f0')
      root.style.setProperty('--color-border', '#e0e0e0')
      root.style.setProperty('--color-text', '#333333')
      root.style.setProperty('--color-text-mute', '#666666')
      root.style.setProperty('--color-heading', '#1a1a1a')
    }
  }

  /**
   * Apply theme class and colors to document
   */
  const applyTheme = () => {
    const root = document.documentElement
    const body = document.body
    
    if (isDark.value) {
      root.classList.add('dark')
      body.classList.add('dark')
      root.setAttribute('data-theme', 'dark')
      document.documentElement.style.colorScheme = 'dark'
    } else {
      root.classList.remove('dark')
      body.classList.remove('dark')
      root.setAttribute('data-theme', 'light')
      document.documentElement.style.colorScheme = 'light'
    }
    
    applyThemeVariables()
  }

  /**
   * Load theme preference from localStorage
   */
  const loadThemePreference = () => {
    const saved = localStorage.getItem('noteapp-theme')
    
    if (saved !== null) {
      // Use saved preference
      isDark.value = saved === 'dark'
    } else {
      // Detect system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      isDark.value = prefersDark
    }
  }

  /**
   * Save theme preference to localStorage
   */
  const saveThemePreference = () => {
    localStorage.setItem('noteapp-theme', isDark.value ? 'dark' : 'light')
  }

  /**
   * Toggle between dark and light mode
   */
  const toggleDark = () => {
    isDark.value = !isDark.value
  }

  /**
   * Set dark mode explicitly
   * @param {boolean} value - True for dark mode, false for light mode
   */
  const setDark = (value) => {
    isDark.value = value
  }

  // Watch for theme changes and apply immediately
  watch(isDark, () => {
    applyTheme()
    saveThemePreference()
  }, { immediate: false })

  // Initialize only once globally
  if (!isInitialized) {
    loadThemePreference()
    applyTheme()
    isInitialized = true
  }

  // Return reactive state and functions
  return {
    isDark,
    toggleDark,
    setDark
  }
}
