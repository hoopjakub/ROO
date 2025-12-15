import { ref, computed } from 'vue'

/**
 * Composable for managing note languages
 * 
 * Features:
 * - Assign language to each note
 * - Filter notes by language
 * - Support custom languages
 * - Persist language preferences to localStorage
 */

// Available languages with base support for Slovak and English
const baseLanguages = {
  'en': { name: 'English', code: 'en' },
  'sk': { name: 'Slovenčina', code: 'sk' }
}

// All available languages (base + custom)
const availableLanguages = ref({ ...baseLanguages })

// Custom languages stored in localStorage
const CUSTOM_LANGUAGES_KEY = 'noteapp-custom-languages'
const NOTE_LANGUAGES_KEY = 'noteapp-note-languages'

/**
 * Load custom languages from localStorage
 */
const loadCustomLanguages = () => {
  try {
    const saved = localStorage.getItem(CUSTOM_LANGUAGES_KEY)
    if (saved) {
      const custom = JSON.parse(saved)
      availableLanguages.value = { ...baseLanguages, ...custom }
    }
  } catch (error) {
    console.error('Failed to load custom languages:', error)
  }
}

/**
 * Save custom languages to localStorage
 */
const saveCustomLanguages = () => {
  try {
    const custom = {}
    Object.keys(availableLanguages.value).forEach(key => {
      if (!baseLanguages[key]) {
        custom[key] = availableLanguages.value[key]
      }
    })
    localStorage.setItem(CUSTOM_LANGUAGES_KEY, JSON.stringify(custom))
  } catch (error) {
    console.error('Failed to save custom languages:', error)
  }
}

/**
 * Add a new custom language
 * @param {string} code - Language code (e.g., 'fr', 'de')
 * @param {string} name - Language name
 */
const addCustomLanguage = (code, name) => {
  if (code.length < 2 || code.length > 5) {
    throw new Error('Language code must be 2-5 characters')
  }
  
  if (availableLanguages.value[code]) {
    throw new Error(`Language code "${code}" already exists`)
  }
  
  availableLanguages.value[code] = { name, code }
  saveCustomLanguages()
}

/**
 * Remove a custom language
 * @param {string} code - Language code to remove
 */
const removeCustomLanguage = (code) => {
  if (baseLanguages[code]) {
    throw new Error('Cannot remove base languages')
  }
  
  delete availableLanguages.value[code]
  saveCustomLanguages()
}

/**
 * Get language info by code
 * @param {string} code - Language code
 * @returns {Object} Language info or empty object
 */
const getLanguageInfo = (code) => {
  return availableLanguages.value[code] || {}
}

/**
 * Get all available languages
 * @returns {Object} All languages
 */
const getAvailableLanguages = () => {
  return { ...availableLanguages.value }
}

/**
 * Check if language exists
 * @param {string} code - Language code
 * @returns {boolean} True if language exists
 */
const hasLanguage = (code) => {
  return code in availableLanguages.value
}

export function useNoteLanguages() {
  // Load custom languages on initialization
  loadCustomLanguages()
  
  return {
    availableLanguages,
    baseLanguages,
    addCustomLanguage,
    removeCustomLanguage,
    getLanguageInfo,
    getAvailableLanguages,
    hasLanguage,
    saveCustomLanguages,
    loadCustomLanguages
  }
}
