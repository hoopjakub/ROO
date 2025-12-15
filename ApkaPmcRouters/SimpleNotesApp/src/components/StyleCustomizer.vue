<!-- 
  StyleCustomizer.vue - Component for customizing app styles
  
  Purpose:
  - Allow users to customize app appearance
  - Change theme colors, fonts, spacing
  - Save preferences to localStorage
  - Provide preset themes (e.g., classic, modern, minimal)
  
  Features:
  - Color picker for primary color
  - Font size adjustment
  - Theme presets dropdown
  - Reset to default button
-->

<script setup>
import { ref, watch, onMounted } from 'vue'

// State for style customization
const isOpen = ref(false)
const primaryColor = ref('#42b983')
const fontSize = ref(16)
const theme = ref('default')

// Available theme presets
const themes = [
  { name: 'Default', value: 'default', color: '#42b983' },
  { name: 'Ocean', value: 'ocean', color: '#0077be' },
  { name: 'Sunset', value: 'sunset', color: '#ff6b6b' },
  { name: 'Forest', value: 'forest', color: '#2d8659' },
  { name: 'Purple', value: 'purple', color: '#7c3aed' }
]

/**
 * Apply theme to CSS variables
 */
const applyTheme = () => {
  const root = document.documentElement
  root.style.setProperty('--color-primary', primaryColor.value)
  root.style.setProperty('--color-primary-dark', adjustBrightness(primaryColor.value, -20))
  root.style.setProperty('--font-size-base', `${fontSize.value}px`)
  
  // Apply font size to body
  document.body.style.fontSize = `${fontSize.value}px`
}

/**
 * Adjust color brightness
 */
const adjustBrightness = (color, percent) => {
  const num = parseInt(color.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = Math.max(0, Math.min(255, (num >> 16) + amt))
  const G = Math.max(0, Math.min(255, (num >> 8 & 0x00FF) + amt))
  const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt))
  return '#' + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)
}

/**
 * Load saved preferences from localStorage
 */
const loadPreferences = () => {
  const saved = localStorage.getItem('noteapp-style-preferences')
  if (saved) {
    const prefs = JSON.parse(saved)
    primaryColor.value = prefs.primaryColor || '#42b983'
    fontSize.value = prefs.fontSize || 16
    theme.value = prefs.theme || 'default'
    applyTheme()
  }
}

/**
 * Save preferences to localStorage
 */
const savePreferences = () => {
  const prefs = {
    primaryColor: primaryColor.value,
    fontSize: fontSize.value,
    theme: theme.value
  }
  localStorage.setItem('noteapp-style-preferences', JSON.stringify(prefs))
}

/**
 * Change theme preset
 */
const changeTheme = (themeName) => {
  theme.value = themeName
  const selectedTheme = themes.find(t => t.value === themeName)
  if (selectedTheme) {
    primaryColor.value = selectedTheme.color
  }
}

/**
 * Reset to default styles
 */
const resetStyles = () => {
  primaryColor.value = '#42b983'
  fontSize.value = 16
  theme.value = 'default'
  applyTheme()
  savePreferences()
}

/**
 * Toggle customizer panel
 */
const toggleCustomizer = () => {
  isOpen.value = !isOpen.value
}

// Watch for changes and apply/save
watch([primaryColor, fontSize], () => {
  applyTheme()
  savePreferences()
})

// Load preferences on mount
onMounted(() => {
  loadPreferences()
})
</script>

<template>
  <div class="style-customizer">
    <!-- Toggle button -->
    <button @click="toggleCustomizer" class="customizer-toggle" title="Customize Styles">
      <IonColorPalette size="large" />
    </button>

    <!-- Customizer panel -->
    <div v-if="isOpen" class="customizer-panel">
      <div class="panel-header">
        <h3>Customize Styles</h3>
        <button @click="toggleCustomizer" class="close-btn">
          <IonClose size="large" />
        </button>
      </div>

      <div class="panel-content">
        <!-- Theme presets -->
        <div class="control-group">
          <label>Theme Preset</label>
          <div class="theme-buttons">
            <button
              v-for="t in themes"
              :key="t.value"
              @click="changeTheme(t.value)"
              :class="['theme-btn', { active: theme === t.value }]"
              :style="{ backgroundColor: t.color }"
              :title="t.name"
            >
              {{ t.name }}
            </button>
          </div>
        </div>

        <!-- Primary color picker -->
        <div class="control-group">
          <label for="primary-color">Primary Color</label>
          <div class="color-input-wrapper">
            <input
              id="primary-color"
              v-model="primaryColor"
              type="color"
              class="color-input"
            />
            <span class="color-value">{{ primaryColor }}</span>
          </div>
        </div>

        <!-- Font size slider -->
        <div class="control-group">
          <label for="font-size">Font Size: {{ fontSize }}px</label>
          <input
            id="font-size"
            v-model.number="fontSize"
            type="range"
            min="12"
            max="20"
            step="1"
            class="slider"
          />
          <div class="font-size-preview">
            Preview: This text changes size
          </div>
        </div>

        <!-- Reset button -->
        <button @click="resetStyles" class="reset-btn">
          Reset to Default
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Toggle button */
.customizer-toggle {
  padding: 8px 12px;
  background-color: var(--color-background-mute);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text);
}

.customizer-toggle:hover {
  background-color: var(--color-primary);
  color: white;
  transform: scale(1.1);
}

/* Customizer panel */
.customizer-panel {
  position: fixed;
  top: 50%;
  right: 20px;
  transform: translateY(-50%);
  width: 320px;
  background-color: var(--color-background);
  border: 2px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 80vh;
  overflow-y: auto;
}

/* Panel header */
.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 2px solid var(--color-border);
}

.panel-header h3 {
  margin: 0;
  font-size: 1.1rem;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-mute);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}

.close-btn:hover {
  color: var(--color-text);
}

/* Panel content */
.panel-content {
  padding: 20px;
}

/* Control groups */
.control-group {
  margin-bottom: 20px;
}

.control-group label {
  display: block;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--color-text);
}

/* Theme buttons */
.theme-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.theme-btn {
  flex: 1;
  min-width: 80px;
  padding: 8px 12px;
  border: 2px solid transparent;
  border-radius: 6px;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.theme-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.theme-btn.active {
  border-color: white;
  box-shadow: 0 0 0 2px currentColor;
}

/* Color input */
.color-input-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}

.color-input {
  width: 60px;
  height: 40px;
  border: 2px solid var(--color-border);
  border-radius: 6px;
  cursor: pointer;
}

.color-value {
  font-family: monospace;
  font-size: 0.9rem;
  color: var(--color-text-mute);
}

/* Slider */
.slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--color-background-mute);
  outline: none;
  cursor: pointer;
  -webkit-appearance: none;
  appearance: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.slider::-moz-range-thumb {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--color-primary);
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* Font size preview */
.font-size-preview {
  margin-top: 8px;
  padding: 10px;
  background-color: var(--color-background-soft);
  border-radius: 6px;
  font-size: var(--font-size-base);
  color: var(--color-text-mute);
  text-align: center;
}

/* Reset button */
.reset-btn {
  width: 100%;
  padding: 10px;
  background-color: var(--color-background-mute);
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  color: var(--color-text);
}

.reset-btn:hover {
  background-color: var(--color-border);
}

/* Scrollbar for panel */
.customizer-panel::-webkit-scrollbar {
  width: 6px;
}

.customizer-panel::-webkit-scrollbar-track {
  background: var(--color-background-soft);
}

.customizer-panel::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
}

.customizer-panel::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-mute);
}
</style>
