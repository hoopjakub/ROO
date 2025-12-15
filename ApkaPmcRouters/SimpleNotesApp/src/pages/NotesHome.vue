<!-- 
  NotesHome.vue - Main page displaying all notes
  
  Purpose:
  - Display list of all notes in a grid/list layout
  - Show battery indicator, offline status, and FPS monitor
  - Provide button to create new notes
  - Display idle modal when user is inactive
  - Show language selector and style customizer
  
  Features:
  - Grid layout of note cards
  - Search/filter notes
  - Navigate to note editor for creating/editing notes
-->

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useNotesApp } from '../composables/useNotesApp'
import { useNoteLanguages } from '../composables/useNoteLanguages'
import { useDeviceStatus } from '../composables/useDeviceStatus'
import NotesList from '../components/NotesList.vue'
import NoteLanguagePicker from '../components/NoteLanguagePicker.vue'
import BatteryIndicator from '../components/BatteryIndicator.vue'
import OfflineIndicator from '../components/OfflineIndicator.vue'
import FpsMonitor from '../components/FpsMonitor.vue'
import IdleModal from '../components/IdleModal.vue'
import StyleCustomizer from '../components/StyleCustomizer.vue'
import LanguageSelector from '../components/LanguageSelector.vue'

// Router instance for navigation
const router = useRouter()

// Notes management composable - handles CRUD operations
const { notes, deleteNote } = useNotesApp()

// Language management
const { availableLanguages } = useNoteLanguages()

// Device status monitoring (battery, online status, FPS)
const { battery, isOnline, fps } = useDeviceStatus()

// Filter states
const search = ref('')
const selectedLanguageFilter = ref('all') // 'all' or specific language code

/**
 * Filtered notes based on language selection
 */
const filteredNotesByLanguage = computed(() => {
  if (selectedLanguageFilter.value === 'all') {
    return notes.value
  }
  return notes.value.filter(note => note.language === selectedLanguageFilter.value)
})

/**
 * Navigate to note editor for creating a new note
 */
const createNewNote = () => {
  router.push('/note/new')
}

/**
 * Navigate to note editor for editing existing note
 * @param {string} id - Note ID to edit
 */
const editNote = (id) => {
  router.push(`/note/${id}`)
}
</script>

<template>
  <div class="notes-home">
    <!-- Header with app title and status indicators -->
    <header class="app-header">
      <h1>My Notes App</h1>
      
      <!-- Status indicators row -->
      <div class="status-bar">
        <BatteryIndicator />
        <OfflineIndicator />
        <FpsMonitor />
      </div>
    </header>

    <!-- Toolbar with search and actions -->
    <div class="toolbar">
      <!-- Search input for filtering notes -->
      <input
        v-model="search"
        type="text"
        placeholder="Search notes..."
        class="search-input"
      />
      
      <!-- Language filter picker -->
      <NoteLanguagePicker v-model="selectedLanguageFilter" />
      
      <!-- Button to create new note -->
      <button @click="createNewNote" class="btn-primary">
        New Note
      </button>
      
      <!-- Additional controls -->
      <StyleCustomizer />
    </div>

    <!-- Notes list/grid component -->
    <NotesList
      :notes="filteredNotesByLanguage"
      :search="search"
      @edit="editNote"
      @delete="deleteNote"
    />

    <!-- Modal shown when user is idle for too long -->
    <IdleModal />
  </div>
</template>

<style scoped>
/* Main container styling */
.notes-home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

/* Header styling with title and status indicators */
.app-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 2px solid var(--color-border);
}

.app-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-heading);
}

/* Status bar with indicators */
.status-bar {
  display: flex;
  gap: var(--spacing-lg);
  align-items: center;
}

/* Toolbar with search and actions */
.toolbar {
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
  align-items: center;
}

/* Search input styling */
.search-input {
  flex: 1;
  min-width: 200px;
  padding: var(--spacing-md);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 1rem;
  transition: all var(--transition-normal);
  background-color: var(--color-background-soft);
  color: var(--color-text);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

:root.dark .search-input:focus {
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.2);
}

/* Primary button styling */
.btn-primary {
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  box-shadow: var(--shadow-sm);
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-primary:active {
  transform: translateY(0);
}
</style>
