<!-- 
  NotesList.vue - Component displaying list/grid of notes
  
  Purpose:
  - Display notes in a responsive grid layout
  - Filter notes based on search query
  - Emit events for editing and deleting notes
  - Show empty state when no notes exist
  
  Props:
  - notes: Array of note objects
  - search: String for filtering notes
  
  Events:
  - @edit(id): Emitted when user wants to edit a note
  - @delete(id): Emitted when user wants to delete a note
-->

<script setup>
import { computed } from 'vue'
import NoteCard from './NoteCard.vue'

// Props definition
const props = defineProps({
  // Array of all notes to display
  notes: {
    type: Array,
    required: true,
    default: () => []
  },
  // Search query for filtering notes
  search: {
    type: String,
    default: ''
  }
})

// Events emitted to parent component
const emit = defineEmits(['edit', 'delete'])

/**
 * Filtered notes based on search query
 * Searches in both title and content
 */
const filteredNotes = computed(() => {
  if (!props.search) {
    return props.notes
  }
  
  const query = props.search.toLowerCase()
  return props.notes.filter(note => {
    const titleMatch = note.title.toLowerCase().includes(query)
    const contentMatch = note.content.toLowerCase().includes(query)
    return titleMatch || contentMatch
  })
})

/**
 * Handle edit button click
 * @param {string} id - Note ID to edit
 */
const handleEdit = (id) => {
  emit('edit', id)
}

/**
 * Handle delete button click
 * @param {string} id - Note ID to delete
 */
const handleDelete = (id) => {
  // Confirm before deleting
  if (confirm('Are you sure you want to delete this note?')) {
    emit('delete', id)
  }
}
</script>

<template>
  <div class="notes-list">
    <!-- Empty state when no notes exist -->
    <div v-if="filteredNotes.length === 0" class="empty-state">
      <p v-if="search">
        🔍 No notes found matching "{{ search }}"
      </p>
      <p v-else>
        📝 No notes yet. Create your first note!
      </p>
    </div>

    <!-- Grid of note cards -->
    <div v-else class="notes-grid">
      <NoteCard
        v-for="note in filteredNotes"
        :key="note.id"
        :note="note"
        @edit="handleEdit"
        @delete="handleDelete"
      />
    </div>

    <!-- Notes count -->
    <div v-if="filteredNotes.length > 0" class="notes-count">
      Showing {{ filteredNotes.length }} of {{ notes.length }} notes
    </div>
  </div>
</template>

<style scoped>
/* Main container */
.notes-list {
  margin-top: 20px;
}

/* Empty state styling */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--color-text-mute, #999);
  font-size: 1.2rem;
}

.empty-state p {
  margin: 0;
}

/* Responsive grid layout for notes */
.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

/* Notes count display */
.notes-count {
  text-align: center;
  padding: var(--spacing-md);
  color: var(--color-text-mute);
  font-size: 0.9rem;
  border-top: 1px solid var(--color-border);
  margin-top: var(--spacing-lg);
}

/* Dark mode support */
:root.dark .empty-state {
  color: var(--color-text-mute);
}

:root.dark .notes-count {
  color: var(--color-text-mute);
  border-top-color: var(--color-border);
}
</style>
