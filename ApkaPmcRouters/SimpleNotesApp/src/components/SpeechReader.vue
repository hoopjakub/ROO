<!-- 
  SpeechReader.vue - Text-to-speech component for reading notes aloud
  
  Purpose:
  - Convert text to speech using Web Speech API
  - Read note content aloud for accessibility
  - Control playback (play, pause, stop)
  - Adjust speech rate and voice
  
  Features:
  - Play/pause/stop controls
  - Voice selection dropdown
  - Speech rate adjustment
  - Visual playback indicator
  - Progress tracking
  
  Props:
  - text: String to read aloud
-->

<script setup>
import { ref, onMounted, watch } from 'vue'

// Props definition
const props = defineProps({
  // Text content to read aloud
  text: {
    type: String,
    required: true,
    default: ''
  }
})

// State management
const isSupported = ref(false)
const isPlaying = ref(false)
const isPaused = ref(false)
const voices = ref([])
const selectedVoice = ref(null)
const speechRate = ref(1.0)

// Speech synthesis instance
let utterance = null

/**
 * Initialize speech synthesis
 */
onMounted(() => {
  // Check if browser supports Web Speech API
  if ('speechSynthesis' in window) {
    isSupported.value = true
    
    // Load available voices
    loadVoices()
    
    // Some browsers load voices asynchronously
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }
  }
})

/**
 * Load available voices
 */
const loadVoices = () => {
  voices.value = window.speechSynthesis.getVoices()
  
  // Select default English voice
  if (voices.value.length > 0 && !selectedVoice.value) {
    const englishVoice = voices.value.find(voice => voice.lang.startsWith('en'))
    selectedVoice.value = englishVoice || voices.value[0]
  }
}

/**
 * Start reading text
 */
const startReading = () => {
  if (!isSupported.value || !props.text) return
  
  // Stop any ongoing speech
  window.speechSynthesis.cancel()
  
  // Create new utterance
  utterance = new SpeechSynthesisUtterance(props.text)
  utterance.voice = selectedVoice.value
  utterance.rate = speechRate.value
  
  // Event handlers
  utterance.onstart = () => {
    isPlaying.value = true
    isPaused.value = false
  }
  
  utterance.onend = () => {
    isPlaying.value = false
    isPaused.value = false
  }
  
  utterance.onerror = (event) => {
    console.error('Speech synthesis error:', event)
    stopReading()
  }
  
  // Start speaking
  window.speechSynthesis.speak(utterance)
}

/**
 * Pause reading
 */
const pauseReading = () => {
  if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
    window.speechSynthesis.pause()
    isPaused.value = true
  }
}

/**
 * Resume reading
 */
const resumeReading = () => {
  if (window.speechSynthesis.paused) {
    window.speechSynthesis.resume()
    isPaused.value = false
  }
}

/**
 * Stop reading
 */
const stopReading = () => {
  window.speechSynthesis.cancel()
  isPlaying.value = false
  isPaused.value = false
}

/**
 * Toggle play/pause
 */
const togglePlayback = () => {
  if (!isPlaying.value) {
    startReading()
  } else if (isPaused.value) {
    resumeReading()
  } else {
    pauseReading()
  }
}

// Watch for text changes and stop reading
watch(() => props.text, () => {
  if (isPlaying.value) {
    stopReading()
  }
})
</script>

<template>
  <div class="speech-reader">
    <!-- Not supported message -->
    <div v-if="!isSupported" class="not-supported" title="Text-to-speech not supported">
      <span>Speech not supported</span>
    </div>

    <!-- Speech controls -->
    <div v-else class="speech-controls">
      <!-- Play/Pause button -->
      <button
        @click="togglePlayback"
        class="control-button"
        :class="{ playing: isPlaying }"
        :title="isPlaying ? (isPaused ? 'Resume' : 'Pause') : 'Read aloud'"
        :disabled="!text"
      >
        <span v-if="!isPlaying">Read</span>
        <span v-else-if="isPaused">Resume</span>
        <span v-else>Pause</span>
      </button>

      <!-- Stop button (shown only when playing) -->
      <button
        v-if="isPlaying"
        @click="stopReading"
        class="control-button stop"
        title="Stop reading"
      >
        Stop
      </button>

      <!-- Settings panel (shown on hover) -->
      <div class="settings-panel">
        <!-- Voice selection -->
        <div class="setting-group">
          <label for="voice-select">Voice:</label>
          <select
            id="voice-select"
            v-model="selectedVoice"
            class="voice-select"
          >
            <option
              v-for="voice in voices"
              :key="voice.name"
              :value="voice"
            >
              {{ voice.name }} ({{ voice.lang }})
            </option>
          </select>
        </div>

        <!-- Speech rate -->
        <div class="setting-group">
          <label for="rate-slider">Speed: {{ speechRate.toFixed(1) }}x</label>
          <input
            id="rate-slider"
            v-model.number="speechRate"
            type="range"
            min="0.5"
            max="2.0"
            step="0.1"
            class="rate-slider"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Main container */
.speech-reader {
  display: inline-flex;
  align-items: center;
  position: relative;
}

/* Not supported state */
.not-supported {
  padding: 8px 12px;
  background-color: var(--color-background-mute, #f0f0f0);
  border-radius: 6px;
  opacity: 0.5;
  cursor: not-allowed;
}

/* Speech controls */
.speech-controls {
  display: flex;
  align-items: center;
  gap: 5px;
  position: relative;
}

/* Control buttons */
.control-button {
  padding: 8px 12px;
  background-color: var(--color-background-soft, #f9f9f9);
  border: 2px solid var(--color-border, #ddd);
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.control-button:hover:not(:disabled) {
  background-color: var(--color-primary, #42b983);
  border-color: var(--color-primary, #42b983);
  transform: scale(1.05);
}

.control-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.control-button.playing {
  background-color: var(--color-primary, #42b983);
  border-color: var(--color-primary, #42b983);
  color: white;
  animation: pulse-playing 2s ease-in-out infinite;
}

@keyframes pulse-playing {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

.control-button.stop {
  background-color: #ef4444;
  border-color: #ef4444;
  color: white;
}

.control-button.stop:hover {
  background-color: #dc2626;
  border-color: #dc2626;
}

/* Settings panel */
.settings-panel {
  display: none;
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  min-width: 280px;
  background-color: var(--color-background, white);
  border: 2px solid var(--color-border, #ddd);
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.speech-controls:hover .settings-panel {
  display: block;
}

/* Setting groups */
.setting-group {
  margin-bottom: 15px;
}

.setting-group:last-child {
  margin-bottom: 0;
}

.setting-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--color-text, #333);
}

/* Voice select dropdown */
.voice-select {
  width: 100%;
  padding: 8px 10px;
  border: 1px solid var(--color-border, #ddd);
  border-radius: 6px;
  font-size: 0.9rem;
  background-color: var(--color-background-soft, #f9f9f9);
  cursor: pointer;
}

.voice-select:focus {
  outline: none;
  border-color: var(--color-primary, #42b983);
}

/* Rate slider */
.rate-slider {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--color-background-mute, #e0e0e0);
  outline: none;
  cursor: pointer;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .not-supported {
    background-color: var(--color-background-mute, #3c3c3c);
    color: var(--color-text, #e0e0e0);
  }
  
  .control-button {
    background-color: var(--color-background-soft, #2c2c2c);
    border-color: var(--color-border, #444);
    color: var(--color-text, #e0e0e0);
  }
  
  .control-button:hover:not(:disabled) {
    background-color: var(--color-primary, #42b983);
    border-color: var(--color-primary, #42b983);
    color: white;
  }
  
  .settings-panel {
    background-color: var(--color-background-soft, #2c2c2c);
    border-color: var(--color-border, #444);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
  }
  
  .setting-group label {
    color: var(--color-text, #e0e0e0);
  }
  
  .voice-select {
    background-color: var(--color-background-mute, #1e1e1e);
    border-color: var(--color-border, #444);
    color: var(--color-text, #e0e0e0);
  }
  
  .voice-select:focus {
    border-color: var(--color-primary, #42b983);
  }
  
  .rate-slider {
    background: var(--color-background-mute, #444);
  }
}

/* Root dark mode selector */
:root.dark .not-supported {
  background-color: var(--color-background-mute, #3c3c3c);
  color: var(--color-text, #e0e0e0);
}

:root.dark .control-button {
  background-color: var(--color-background-soft, #2c2c2c);
  border-color: var(--color-border, #444);
  color: var(--color-text, #e0e0e0);
}

:root.dark .control-button:hover:not(:disabled) {
  background-color: var(--color-primary, #42b983);
  border-color: var(--color-primary, #42b983);
  color: white;
}

:root.dark .settings-panel {
  background-color: var(--color-background-soft, #2c2c2c);
  border-color: var(--color-border, #444);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}

:root.dark .setting-group label {
  color: var(--color-text, #e0e0e0);
}

:root.dark .voice-select {
  background-color: var(--color-background-mute, #1e1e1e);
  border-color: var(--color-border, #444);
  color: var(--color-text, #e0e0e0);
}

:root.dark .voice-select:focus {
  border-color: var(--color-primary, #42b983);
}

:root.dark .rate-slider {
  background: var(--color-background-mute, #444);
}
</style>
