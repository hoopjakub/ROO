<!-- 
  NoteCard.vue - Individual note card component
  
  Purpose:
  - Display a single note in card format
  - Show note title and content preview
  - Provide action buttons (edit, delete)
  - Display metadata (created/updated dates)
  
  Props:
  - note: Object containing note data (id, title, content, createdAt, updatedAt)
  
  Events:
  - @edit: Emitted when edit button is clicked
  - @delete: Emitted when delete button is clicked
  
  Features:
  - Card hover effects
  - Content truncation with ellipsis
  - Formatted date display
  - Responsive design
-->

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'

// Props definition
const props = defineProps({
  // Note object with all data
  note: {
    type: Object,
    required: true,
    validator: (note) => {
      return note.id && note.title !== undefined && note.content !== undefined
    }
  }
})

// Events emitted to parent
const emit = defineEmits(['edit', 'delete'])

// Parallax effect state
const cardElement = ref(null)
const parallaxOffset = ref(0)

/**
 * Handle parallax scroll effect
 */
const handleScroll = () => {
  if (!cardElement.value) return
  
  const rect = cardElement.value.getBoundingClientRect()
  const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
  
  // Apply parallax transform based on scroll position
  parallaxOffset.value = scrollProgress * 10 // Adjust 10 for parallax intensity
  cardElement.value.style.transform = `translateY(${parallaxOffset.value}px)`
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

/**
 * Truncate content for preview
 * @returns {string} Truncated content
 */
const contentPreview = computed(() => {
  const maxLength = 150
  if (props.note.content.length <= maxLength) {
    return props.note.content
  }
  return props.note.content.substring(0, maxLength) + '...'
})

/**
 * Format date to readable string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
const formatDate = (dateString) => {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)
  
  // Show relative time for recent notes
  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins} min ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  
  // Otherwise show formatted date
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  })
}

/**
 * Handle edit button click
 */
const handleEdit = () => {
  emit('edit', props.note.id)
}

/**
 * Handle delete button click
 */
const handleDelete = () => {
  emit('delete', props.note.id)
}
</script>

<template>
  <div class="note-card" ref="cardElement" @click="handleEdit">
    <!-- Card header with title -->
    <div class="card-header">
      <h3 class="note-title">{{ note.title }}</h3>
    </div>

    <!-- Card body with content preview -->
    <div class="card-body">
      <p class="note-content">{{ contentPreview }}</p>
    </div>

    <!-- Card footer with metadata and actions -->
    <div class="card-footer">
      <div class="note-meta">
        <span class="note-language" :title="`Language: ${note.language || 'en'}`">
          [{{ (note.language || 'en').toUpperCase() }}]
        </span>
        <span class="note-date" :title="`Updated: ${new Date(note.updatedAt).toLocaleString()}`">
          {{ formatDate(note.updatedAt) }}
        </span>
      </div>

      <!-- Action buttons -->
      <div class="card-actions" @click.stop>
        <button 
          @click="handleEdit" 
          class="action-btn edit-btn"
          title="Edit note"
        >
          <span class="btn-text">Edit</span>
        </button>
        <button 
          @click="handleDelete" 
          class="action-btn delete-btn"
          title="Delete note"
        >
          <span class="btn-text">Delete</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Note card container with parallax support */
.note-card {
  background-color: var(--color-background-soft, #f9f9f9);
  border: 2px solid var(--color-border, #e0e0e0);
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 200px;
  box-shadow: var(--shadow-sm, 0 2px 4px rgba(0, 0, 0, 0.05));
  will-change: transform;
}

.note-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--shadow-lg, 0 12px 24px rgba(0, 0, 0, 0.15));
  border-color: var(--color-primary, #42b983);
}

/* Dark mode styling for note card */
:root.dark .note-card {
  background-color: var(--color-background-soft, #2c2c2c);
  border-color: var(--color-border, #444);
  color: var(--color-text, #e0e0e0);
}

:root.dark .note-card:hover {
  box-shadow: var(--shadow-lg, 0 12px 24px rgba(0, 0, 0, 0.5));
}

/* Card header */
.card-header {
  border-bottom: 1px solid var(--color-border, #e0e0e0);
  padding-bottom: 10px;
}

:root.dark .card-header {
  border-bottom-color: var(--color-border, #444);
}

.note-title {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-heading, #333);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

:root.dark .note-title {
  color: var(--color-heading, #fff);
}

/* Card body */
.card-body {
  flex: 1;
  overflow: hidden;
}

.note-content {
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--color-text, #666);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  line-clamp: 4;
  overflow: hidden;
}

:root.dark .note-content {
  color: var(--color-text, #bbb);
}

/* Card footer */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 10px;
  border-top: 1px solid var(--color-border, #e0e0e0);
}

:root.dark .card-footer {
  border-top-color: var(--color-border, #444);
}

.note-meta {
  display: flex;
  gap: 10px;
  align-items: center;
}

.note-language {
  font-size: 0.8rem;
  font-weight: 600;
  font-family: monospace;
  color: var(--color-primary, #42b983);
  padding: 2px 6px;
  background-color: var(--color-background-mute, #f0f0f0);
  border-radius: 4px;
}

:root.dark .note-language {
  background-color: var(--color-background-mute, #3c3c3c);
  color: var(--color-primary, #42b983);
}

.note-date {
  font-size: 0.85rem;
  color: var(--color-text-mute, #999);
  display: flex;
  align-items: center;
  gap: 4px;
}

.date-icon {
  display: inline-block;
}

:root.dark .note-date {
  color: var(--color-text-mute, #999);
}

/* Parallax animation */
@media (prefers-reduced-motion: no-preference) {
  .note-card {
    transform: translate3d(0, 0, 0);
    transition: box-shadow 0.3s ease, border-color 0.3s ease;
  }
}

/* Action buttons */
.card-actions {
  display: flex;
  gap: 8px;
  opacity: 0;
  transition: opacity var(--transition-fast, 0.2s ease);
}

.note-card:hover .card-actions {
  opacity: 1;
}

.action-btn {
  padding: 6px 12px;
  background-color: var(--color-background-mute, #f0f0f0);
  border: 1px solid var(--color-border, #ddd);
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast, 0.2s ease);
  color: var(--color-text, #333);
  white-space: nowrap;
}

:root.dark .action-btn {
  background-color: var(--color-background-mute, #3c3c3c);
  border-color: var(--color-border, #555);
  color: var(--color-text, #e0e0e0);
}

.action-btn:hover {
  transform: scale(1.05);
}

.btn-text {
  display: inline;
}

.edit-btn:hover {
  background-color: var(--color-primary, #42b983);
  border-color: var(--color-primary, #42b983);
  color: white;
}

:root.dark .edit-btn:hover {
  background-color: var(--color-primary, #42b983);
  border-color: var(--color-primary, #42b983);
  color: white;
}

.delete-btn:hover {
  background-color: #ef4444;
  border-color: #ef4444;
  color: white;
}

:root.dark .delete-btn:hover {
  background-color: #ef4444;
  border-color: #ef4444;
  color: white;
}

/* Smooth parallax transition */
@media (prefers-reduced-motion: no-preference) {
  .note-card {
    transition: box-shadow 0.3s ease, border-color 0.3s ease;
  }
}
</style>
