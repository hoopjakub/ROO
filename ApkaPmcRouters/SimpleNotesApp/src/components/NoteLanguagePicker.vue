<!-- 
  NoteLanguagePicker.vue - Language selection component for notes
  
  Purpose:
  - Allow users to select/change note language
  - Display available languages
  - Support custom language creation
  
  Props:
  - modelValue: Currently selected language code
  
  Events:
  - @update:modelValue: Emitted when language is changed
-->

<script setup>
import { ref, computed } from 'vue'
import { useNoteLanguages } from '../composables/useNoteLanguages'

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: 'en'
  }
})

// Events
const emit = defineEmits(['update:modelValue'])

// Composables
const { availableLanguages, addCustomLanguage } = useNoteLanguages()

// Local state
const isOpen = ref(false)
const showCustomForm = ref(false)
const customCode = ref('')
const customName = ref('')
const errorMessage = ref('')

/**
 * Handle language selection
 */
const selectLanguage = (code) => {
  emit('update:modelValue', code)
  isOpen.value = false
  showCustomForm.value = false
}

/**
 * Add custom language
 */
const addLanguage = () => {
  errorMessage.value = ''
  
  if (!customCode.value.trim()) {
    errorMessage.value = 'Language code is required'
    return
  }
  
  if (!customName.value.trim()) {
    errorMessage.value = 'Language name is required'
    return
  }
  
  try {
    addCustomLanguage(customCode.value.toLowerCase().trim(), customName.value.trim())
    selectLanguage(customCode.value.toLowerCase().trim())
    resetCustomForm()
  } catch (error) {
    errorMessage.value = error.message
  }
}

/**
 * Reset custom form
 */
const resetCustomForm = () => {
  customCode.value = ''
  customName.value = ''
  showCustomForm.value = false
}

/**
 * Get current language name and flag
 */
const currentLanguageDisplay = computed(() => {
  if (props.modelValue === 'all') {
    return 'All Languages'
  }
  const lang = availableLanguages.value[props.modelValue]
  if (lang) {
    return `${lang.code.toUpperCase()} - ${lang.name}`
  }
  return 'Select Language'
})
</script>

<template>
  <div class="language-picker">
    <!-- Language selector button -->
    <button 
      @click="isOpen = !isOpen"
      class="language-btn"
      :title="`Current language: ${currentLanguageDisplay}`"
    >
      {{ currentLanguageDisplay }}
    </button>

    <!-- Language dropdown menu -->
    <div v-if="isOpen" class="language-dropdown">
      <!-- Available languages -->
      <div class="languages-list">
        <!-- All languages option -->
        <button
          @click="selectLanguage('all')"
          class="language-option"
          :class="{ active: props.modelValue === 'all' }"
        >
          <span class="code">ALL</span>
          <span class="name">All Languages</span>
          <span v-if="props.modelValue === 'all'" class="check">✓</span>
        </button>

        <!-- Individual languages -->
        <button
          v-for="(lang, code) in availableLanguages"
          :key="code"
          @click="selectLanguage(code)"
          class="language-option"
          :class="{ active: props.modelValue === code }"
        >
          <span class="code">{{ code.toUpperCase() }}</span>
          <span class="name">{{ lang.name }}</span>
          <span v-if="props.modelValue === code" class="check">✓</span>
        </button>
      </div>

      <!-- Divider -->
      <div class="dropdown-divider"></div>

      <!-- Add custom language button -->
      <button 
        @click="showCustomForm = !showCustomForm"
        class="add-language-btn"
      >
        + Add Custom Language
      </button>

      <!-- Custom language form -->
      <div v-if="showCustomForm" class="custom-form">
        <h4>Create Custom Language</h4>
        
        <!-- Error message -->
        <div v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </div>

        <!-- Form inputs -->
        <div class="form-group">
          <label for="lang-code">Code (2-5 chars):</label>
          <input
            id="lang-code"
            v-model="customCode"
            type="text"
            placeholder="e.g., fr, de, es"
            class="form-input"
            @keyup.enter="addLanguage"
          />
        </div>

        <div class="form-group">
          <label for="lang-name">Name:</label>
          <input
            id="lang-name"
            v-model="customName"
            type="text"
            placeholder="e.g., Français"
            class="form-input"
            @keyup.enter="addLanguage"
          />
        </div>

        <!-- Form buttons -->
        <div class="form-buttons">
          <button @click="addLanguage" class="btn-primary">
            Add
          </button>
          <button @click="resetCustomForm" class="btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Main container */
.language-picker {
  position: relative;
  display: inline-block;
}

/* Language selector button */
.language-btn {
  padding: 8px 12px;
  background-color: var(--color-background-soft, #f9f9f9);
  border: 2px solid var(--color-border, #ddd);
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  color: var(--color-text, #333);
  white-space: nowrap;
}

.language-btn:hover {
  background-color: var(--color-background-mute, #f0f0f0);
  border-color: var(--color-primary, #42b983);
}

/* Dark mode */
:root.dark .language-btn {
  background-color: var(--color-background-soft, #2c2c2c);
  border-color: var(--color-border, #444);
  color: var(--color-text, #e0e0e0);
}

:root.dark .language-btn:hover {
  background-color: var(--color-background-mute, #3c3c3c);
  border-color: var(--color-primary, #42b983);
}

/* Dropdown menu */
.language-dropdown {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  min-width: 280px;
  background-color: var(--color-background, white);
  border: 2px solid var(--color-border, #ddd);
  border-radius: 12px;
  box-shadow: var(--shadow-lg, 0 12px 24px rgba(0, 0, 0, 0.15));
  z-index: 1000;
  overflow: hidden;
  max-height: 400px;
  overflow-y: auto;
}

:root.dark .language-dropdown {
  background-color: var(--color-background-soft, #2c2c2c);
  border-color: var(--color-border, #444);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.5);
}

/* Languages list */
.languages-list {
  display: flex;
  flex-direction: column;
  padding: 8px 0;
}

/* Language option */
.language-option {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: none;
  border: none;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--color-text, #333);
  text-align: left;
  font-size: 0.95rem;
}

.language-option:hover {
  background-color: var(--color-background-soft, #f9f9f9);
  padding-left: 20px;
}

.language-option.active {
  background-color: var(--color-primary, #42b983);
  color: white;
  font-weight: 600;
}

:root.dark .language-option {
  color: var(--color-text, #e0e0e0);
}

:root.dark .language-option:hover {
  background-color: var(--color-background-mute, #3c3c3c);
}

:root.dark .language-option.active {
  background-color: var(--color-primary, #42b983);
  color: white;
}

/* Flag emoji */
.flag {
  font-size: 1.3rem;
  min-width: 24px;
}

/* Language code */
.code {
  min-width: 50px;
  font-weight: 600;
  font-family: monospace;
  font-size: 0.9rem;
  color: var(--color-primary, #42b983);
}

/* Language name */
.name {
  flex: 1;
}

/* Check mark */
.check {
  margin-left: auto;
  font-weight: bold;
}

/* Dropdown divider */
.dropdown-divider {
  height: 1px;
  background-color: var(--color-border, #ddd);
  margin: 8px 0;
}

:root.dark .dropdown-divider {
  background-color: var(--color-border, #444);
}

/* Add language button */
.add-language-btn {
  width: 100%;
  padding: 12px 16px;
  background: none;
  border: none;
  border-top: 1px solid var(--color-border, #ddd);
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--color-primary, #42b983);
  font-weight: 500;
  text-align: left;
}

.add-language-btn:hover {
  background-color: var(--color-background-soft, #f9f9f9);
  padding-left: 20px;
}

:root.dark .add-language-btn {
  border-top-color: var(--color-border, #444);
  color: var(--color-primary, #42b983);
}

:root.dark .add-language-btn:hover {
  background-color: var(--color-background-mute, #3c3c3c);
}

/* Custom form */
.custom-form {
  padding: 15px;
  background-color: var(--color-background-soft, #f9f9f9);
  border-top: 1px solid var(--color-border, #ddd);
}

:root.dark .custom-form {
  background-color: var(--color-background-mute, #3c3c3c);
  border-top-color: var(--color-border, #444);
}

.custom-form h4 {
  margin: 0 0 12px 0;
  font-size: 0.95rem;
  color: var(--color-heading, #333);
}

:root.dark .custom-form h4 {
  color: var(--color-heading, #fff);
}

/* Error message */
.error-message {
  padding: 8px;
  margin-bottom: 12px;
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 6px;
  color: #c33;
  font-size: 0.85rem;
}

:root.dark .error-message {
  background-color: rgba(255, 0, 0, 0.15);
  border-color: rgba(255, 0, 0, 0.3);
  color: #ff6b6b;
}

/* Form group */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.form-group:last-of-type {
  margin-bottom: 0;
}

.form-group label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text, #333);
}

:root.dark .form-group label {
  color: var(--color-text, #e0e0e0);
}

/* Form input */
.form-input {
  padding: 8px 10px;
  border: 1px solid var(--color-border, #ddd);
  border-radius: 6px;
  font-size: 0.9rem;
  background-color: var(--color-background, white);
  color: var(--color-text, #333);
  transition: all 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary, #42b983);
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.1);
}

:root.dark .form-input {
  background-color: var(--color-background, #1e1e1e);
  border-color: var(--color-border, #444);
  color: var(--color-text, #e0e0e0);
}

:root.dark .form-input:focus {
  border-color: var(--color-primary, #42b983);
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.2);
}

/* Form buttons */
.form-buttons {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

.btn-primary,
.btn-secondary {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 0.9rem;
}

.btn-primary {
  background-color: var(--color-primary, #42b983);
  color: white;
}

.btn-primary:hover {
  transform: scale(1.02);
  opacity: 0.9;
}

.btn-secondary {
  background-color: var(--color-background-mute, #f0f0f0);
  border: 1px solid var(--color-border, #ddd);
  color: var(--color-text, #333);
}

.btn-secondary:hover {
  background-color: var(--color-background-soft, #f9f9f9);
}

:root.dark .btn-secondary {
  background-color: var(--color-background-mute, #3c3c3c);
  border-color: var(--color-border, #444);
  color: var(--color-text, #e0e0e0);
}

:root.dark .btn-secondary:hover {
  background-color: var(--color-background-soft, #2c2c2c);
}
</style>
