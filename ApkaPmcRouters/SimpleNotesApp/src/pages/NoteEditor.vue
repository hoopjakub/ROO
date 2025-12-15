<!-- 
  NoteEditor.vue - Page for creating and editing notes
  
  Purpose:
  - Create new notes or edit existing ones
  - Rich text input with title and content
  - Voice control for hands-free note taking
  - Speech reader for reading notes aloud
  - Auto-save functionality
  - Keyboard shortcuts support
  
  Features:
  - Title and content text areas
  - Save and cancel buttons
  - Voice input support
  - Text-to-speech for reading notes
  - Keyboard shortcuts (Ctrl+S to save, Escape to cancel)
-->

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useNotesApp } from '../composables/useNotesApp'
import { useNoteLanguages } from '../composables/useNoteLanguages'
import { useNoteShortcuts } from '../composables/useNoteShortcuts'
import NoteLanguagePicker from '../components/NoteLanguagePicker.vue'
import VoiceControl from '../components/VoiceControl.vue'
import SpeechReader from '../components/SpeechReader.vue'

// Router instances for navigation and route params
const route = useRoute()
const router = useRouter()

// Notes management composables
const { notes, addNote, updateNote } = useNotesApp()
const { getLanguageInfo } = useNoteLanguages()

// Note data - title, content, and language
const title = ref('')
const content = ref('')
const language = ref('en') // Default to English

// Flag to track if we're editing existing note or creating new one
const isEditing = ref(false)
const noteId = ref(null)

/**
 * Load note data if editing existing note
 */
onMounted(() => {
  const id = route.params.id
  
  // Check if we're editing (id exists and not 'new')
  if (id && id !== 'new') {
    isEditing.value = true
    noteId.value = id
    
    // Find and load the note
    const note = notes.value.find(n => n.id === id)
    if (note) {
      title.value = note.title
      content.value = note.content
      language.value = note.language || 'en'
    }
  }
})

/**
 * Save note - either create new or update existing
 */
const saveNote = () => {
  // Validate that title is provided
  if (!title.value.trim()) {
    alert('Please enter a title for the note')
    return
  }
  
  // Create note object
  const noteData = {
    title: title.value,
    content: content.value,
    language: language.value, // Save the language
    updatedAt: new Date().toISOString()
  }
  
  // Save note (create or update)
  if (isEditing.value) {
    updateNote(noteId.value, noteData)
  } else {
    addNote(noteData)
  }
  
  // Navigate back to home
  router.push('/')
}

/**
 * Cancel editing and return to home
 */
const cancelEdit = () => {
  router.push('/')
}

/**
 * Handle voice input result
 * @param {string} text - Transcribed text from voice input
 */
const handleVoiceInput = (text) => {
  // Append voice input to content
  content.value += (content.value ? '\n' : '') + text
}

// Setup keyboard shortcuts (Ctrl+S to save, Escape to cancel)
useNoteShortcuts({
  onSave: saveNote,
  onCancel: cancelEdit
})
</script>

<template>
  <div class="note-editor">
    <!-- Header with title and actions -->
    <header class="editor-header">
      <h2>{{ isEditing ? 'Edit Note' : 'New Note' }}</h2>
      
      <div class="header-actions">
        <!-- Language picker for note -->
        <NoteLanguagePicker v-model="language" />
        
        <!-- Voice control for dictation -->
        <VoiceControl @result="handleVoiceInput" />
        
        <!-- Speech reader for reading note aloud -->
        <SpeechReader :text="content" />
      </div>
    </header>

    <!-- Note editing form -->
    <div class="editor-form">
      <!-- Title input -->
      <div class="form-group">
        <label for="title">Title</label>
        <input
          id="title"
          v-model="title"
          type="text"
          placeholder="Enter note title..."
          class="title-input"
          autofocus
        />
      </div>

      <!-- Content textarea -->
      <div class="form-group">
        <label for="content">Content</label>
        <textarea
          id="content"
          v-model="content"
          placeholder="Write your note here..."
          class="content-textarea"
          rows="15"
        ></textarea>
      </div>

      <!-- Action buttons -->
      <div class="form-actions">
        <button @click="cancelEdit" class="btn-secondary">
          Cancel
        </button>
        <button @click="saveNote" class="btn-primary">
          Save Note
        </button>
      </div>

      <!-- Keyboard shortcuts hint -->
      <div class="shortcuts-hint">
        <small>
          💡 Tip: Press <kbd>Ctrl+S</kbd> to save, <kbd>Esc</kbd> to cancel
        </small>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Main editor container */
.note-editor {
  max-width: 800px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

/* Editor header with title and actions */
.editor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-md);
  border-bottom: 2px solid var(--color-border);
}

.editor-header h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  flex-wrap: wrap;
}

/* Form styling */
.editor-form {
  background-color: var(--color-background-soft);
  padding: var(--spacing-xl);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-group label {
  display: block;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  color: var(--color-heading);
}

/* Title input styling */
.title-input {
  width: 100%;
  padding: var(--spacing-md);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 1.2rem;
  font-weight: 600;
  transition: all var(--transition-normal);
  background-color: var(--color-background);
  color: var(--color-text);
}

.title-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

:root.dark .title-input:focus {
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.2);
}

/* Content textarea styling */
.content-textarea {
  width: 100%;
  padding: var(--spacing-md);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-family: inherit;
  line-height: 1.6;
  resize: vertical;
  transition: all var(--transition-normal);
  background-color: var(--color-background);
  color: var(--color-text);
}

.content-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

:root.dark .content-textarea:focus {
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.2);
}

/* Form action buttons */
.form-actions {
  display: flex;
  gap: var(--spacing-md);
  justify-content: flex-end;
  margin-top: var(--spacing-lg);
}

.btn-primary,
.btn-secondary {
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  box-shadow: var(--shadow-sm);
}

.btn-primary {
  background-color: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background-color: var(--color-primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.btn-primary:active {
  transform: translateY(0);
}

.btn-secondary {
  background-color: var(--color-background-mute);
  border: 2px solid var(--color-border);
  color: var(--color-text);
}

.btn-secondary:hover {
  background-color: var(--color-border);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.btn-secondary:active {
  transform: translateY(0);
}

/* Keyboard shortcuts hint */
.shortcuts-hint {
  margin-top: var(--spacing-lg);
  text-align: center;
  color: var(--color-text-mute);
  font-size: 0.9rem;
}

kbd {
  padding: 2px 6px;
  background-color: var(--color-background-mute);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  font-family: monospace;
  font-size: 0.9em;
}
</style>
