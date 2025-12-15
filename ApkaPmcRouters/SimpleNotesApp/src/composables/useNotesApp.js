/**
 * useNotesApp.js - Main composable for notes management
 * 
 * Purpose:
 * - Manage notes CRUD operations (Create, Read, Update, Delete)
 * - Handle localStorage persistence
 * - Provide reactive notes state
 * - Search and filter functionality
 * 
 * Features:
 * - Add new notes
 * - Update existing notes
 * - Delete notes
 * - Search notes by title/content
 * - Auto-save to localStorage
 * - Reactive state management
 * 
 * Usage:
 * const { notes, addNote, updateNote, deleteNote, searchQuery } = useNotesApp()
 */

import { ref, computed, watch } from 'vue'

// Storage key for localStorage
const STORAGE_KEY = 'noteapp-notes'

// Global reactive state for notes (shared across components)
const notes = ref([])

/**
 * Initialize notes app composable
 * @returns {Object} Notes state and CRUD functions
 */
export function useNotesApp() {
  /**
   * Load notes from localStorage
   */
  const loadNotes = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        notes.value = JSON.parse(saved)
      } else {
        // Initialize with sample notes if empty
        notes.value = [
          {
            id: generateId(),
            title: 'Welcome to Notes App! 👋',
            content: 'This is a simple notes application built with Vue 3. You can create, edit, and delete notes. Try using voice input or reading notes aloud!',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ]
        saveNotes()
      }
    } catch (error) {
      console.error('Failed to load notes:', error)
      notes.value = []
    }
  }

  /**
   * Save notes to localStorage
   */
  const saveNotes = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes.value))
    } catch (error) {
      console.error('Failed to save notes:', error)
    }
  }

  /**
   * Generate unique ID for new notes
   * @returns {string} Unique identifier
   */
  const generateId = () => {
    return `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Add new note
   * @param {Object} noteData - Note data (title, content, language)
   * @returns {Object} Created note with ID
   */
  const addNote = (noteData) => {
    const newNote = {
      id: generateId(),
      title: noteData.title || 'Untitled Note',
      content: noteData.content || '',
      language: noteData.language || 'en', // Default to English
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    notes.value.unshift(newNote) // Add to beginning
    saveNotes()
    
    return newNote
  }

  /**
   * Update existing note
   * @param {string} id - Note ID to update
   * @param {Object} updates - Updated note data
   * @returns {boolean} True if successful
   */
  const updateNote = (id, updates) => {
    const index = notes.value.findIndex(note => note.id === id)
    
    if (index !== -1) {
      notes.value[index] = {
        ...notes.value[index],
        ...updates,
        updatedAt: new Date().toISOString()
      }
      saveNotes()
      return true
    }
    
    return false
  }

  /**
   * Delete note by ID
   * @param {string} id - Note ID to delete
   * @returns {boolean} True if successful
   */
  const deleteNote = (id) => {
    const index = notes.value.findIndex(note => note.id === id)
    
    if (index !== -1) {
      notes.value.splice(index, 1)
      saveNotes()
      return true
    }
    
    return false
  }

  /**
   * Get notes by language
   * @param {string} language - Language code (e.g., 'en', 'sk')
   * @returns {Array} Notes in specified language
   */
  const getNotesByLanguage = (language) => {
    return notes.value.filter(note => note.language === language)
  }

  /**
   * Get note by ID
   * @param {string} id - Note ID to find
   * @returns {Object|null} Note object or null
   */
  const getNoteById = (id) => {
    return notes.value.find(note => note.id === id) || null
  }

  /**
   * Search notes by query
   * @param {string} query - Search query
   * @returns {Array} Filtered notes
   */
  const searchNotes = (query) => {
    if (!query) return notes.value
    
    const lowerQuery = query.toLowerCase()
    return notes.value.filter(note => {
      const titleMatch = note.title.toLowerCase().includes(lowerQuery)
      const contentMatch = note.content.toLowerCase().includes(lowerQuery)
      return titleMatch || contentMatch
    })
  }

  /**
   * Get notes count
   * @returns {number} Number of notes
   */
  const notesCount = computed(() => notes.value.length)

  /**
   * Clear all notes (use with caution!)
   */
  const clearAllNotes = () => {
    if (confirm('Are you sure you want to delete ALL notes? This cannot be undone!')) {
      notes.value = []
      saveNotes()
    }
  }

  // Watch for changes and auto-save
  watch(notes, () => {
    saveNotes()
  }, { deep: true })

  // Load notes on initialization
  if (notes.value.length === 0) {
    loadNotes()
  }

  // Return public API
  return {
    notes,
    notesCount,
    addNote,
    updateNote,
    deleteNote,
    getNoteById,
    searchNotes,
    getNotesByLanguage,
    clearAllNotes
  }
}
