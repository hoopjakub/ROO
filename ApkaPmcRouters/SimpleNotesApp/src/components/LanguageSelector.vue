<!-- 
  LanguageSelector.vue - Component for selecting app language
  
  Purpose:
  - Allow users to switch app language/locale
  - Support internationalization (i18n)
  - Save language preference to localStorage
  - Provide dropdown with available languages
  
  Features:
  - Language dropdown selector
  - Flag emojis for visual identification
  - Persistent language preference
  - Easy to extend with new languages
-->

<script setup>
import { ref, onMounted, watch } from 'vue'

// Current selected language
const selectedLanguage = ref('en')
const isOpen = ref(false)

// Available languages
const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'sk', name: 'Slovenčina', flag: '🇸🇰' },
  { code: 'cs', name: 'Čeština', flag: '🇨🇿' }
]

/**
 * Load language preference from localStorage
 */
const loadLanguagePreference = () => {
  const saved = localStorage.getItem('noteapp-language')
  if (saved) {
    selectedLanguage.value = saved
  } else {
    // Try to detect browser language
    const browserLang = navigator.language.split('-')[0]
    const supported = languages.find(lang => lang.code === browserLang)
    if (supported) {
      selectedLanguage.value = browserLang
    }
  }
}

/**
 * Save language preference to localStorage
 */
const saveLanguagePreference = () => {
  localStorage.setItem('noteapp-language', selectedLanguage.value)
}

/**
 * Change language
 * @param {string} langCode - Language code to switch to
 */
const changeLanguage = (langCode) => {
  selectedLanguage.value = langCode
  isOpen.value = false
  
  // TODO: Integrate with vue-i18n or similar
  // i18n.global.locale.value = langCode
}

/**
 * Get current language object
 */
const getCurrentLanguage = () => {
  return languages.find(lang => lang.code === selectedLanguage.value) || languages[0]
}

/**
 * Toggle dropdown
 */
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

/**
 * Close dropdown when clicking outside
 */
const closeDropdown = () => {
  isOpen.value = false
}

// Watch for language changes
watch(selectedLanguage, () => {
  saveLanguagePreference()
})

// Load preference on mount
onMounted(() => {
  loadLanguagePreference()
  
  // Close dropdown when clicking outside
  document.addEventListener('click', (e) => {
    const selector = document.querySelector('.language-selector')
    if (selector && !selector.contains(e.target)) {
      isOpen.value = false
    }
  })
})
</script>

<template>
  <div class="language-selector">
    <!-- Language dropdown -->
    <div class="language-dropdown">
      <!-- Current language display -->
      <button @click="toggleDropdown" class="language-button">
        <span class="flag">{{ getCurrentLanguage().flag }}</span>
        <span class="language-name">{{ getCurrentLanguage().code.toUpperCase() }}</span>
        <IonChevronDown class="arrow" :class="{ open: isOpen }" />
      </button>

      <!-- Dropdown menu - stays open until clicked outside -->
      <div v-show="isOpen" class="dropdown-menu">
        <button
          v-for="lang in languages"
          :key="lang.code"
          @click="changeLanguage(lang.code)"
          class="language-option"
          :class="{ active: selectedLanguage === lang.code }"
        >
          <span class="flag">{{ lang.flag }}</span>
          <span class="name">{{ lang.name }}</span>
          <span v-if="selectedLanguage === lang.code" class="check">✓</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Main container */
.language-selector {
  display: inline-flex;
  align-items: center;
  position: relative;
}

/* Language dropdown wrapper */
.language-dropdown {
  position: relative;
}

/* Language button */
.language-button {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background-color: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  color: var(--color-text);
}

.language-button:hover {
  background-color: var(--color-background-mute);
  border-color: var(--color-primary);
}

.language-button .flag {
  font-size: 1.2rem;
}

.language-button .arrow {
  font-size: 0.9rem;
  color: var(--color-text-mute);
  transition: transform 0.3s;
}

.language-button .arrow.open {
  transform: rotate(180deg);
}

/* Dropdown menu */
.dropdown-menu {
  position: absolute;
  top: calc(100% + 5px);
  right: 0;
  min-width: 180px;
  background-color: var(--color-background);
  border: 2px solid var(--color-border);
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 1001;
}

/* Language option */
.language-option {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 15px;
  background: none;
  border: none;
  text-align: left;
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
  color: var(--color-text);
}

.language-option:hover {
  background-color: var(--color-background-soft);
}

.language-option.active {
  background-color: rgba(66, 185, 131, 0.1);
  font-weight: 600;
}

.language-option .flag {
  font-size: 1.3rem;
}

.language-option .name {
  flex: 1;
  font-size: 0.95rem;
}

.language-option .check {
  color: var(--color-primary);
  font-weight: bold;
}

/* Divider between options */
.language-option:not(:last-child) {
  border-bottom: 1px solid var(--color-border);
}
</style>
