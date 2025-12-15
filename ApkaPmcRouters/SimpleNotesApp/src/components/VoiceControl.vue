<!-- 
  VoiceControl.vue - Voice input for hands-free note taking
  
  Purpose:
  - Enable voice-to-text input using Web Speech API
  - Record user speech and convert to text
  - Support multiple languages
  - Provide visual feedback during recording
  
  Features:
  - Start/stop recording button
  - Real-time transcription display
  - Language selection
  - Visual recording indicator
  - Error handling for unsupported browsers
-->

<script setup>
import { ref, onMounted } from 'vue'

// Emits transcribed text to parent
const emit = defineEmits(['result'])

// State management
const isRecording = ref(false)
const isSupported = ref(false)
const transcript = ref('')
const interimTranscript = ref('')

// Speech recognition instance
let recognition = null

/**
 * Initialize speech recognition
 */
onMounted(() => {
  // Check if browser supports Web Speech API
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  
  if (SpeechRecognition) {
    isSupported.value = true
    
    // Create recognition instance
    recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US' // Default language
    
    // Handle results
    recognition.onresult = (event) => {
      let interim = ''
      let final = ''
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript
        
        if (event.results[i].isFinal) {
          final += transcriptPart + ' '
        } else {
          interim += transcriptPart
        }
      }
      
      // Update transcripts
      transcript.value += final
      interimTranscript.value = interim
      
      // Emit final transcript to parent
      if (final) {
        emit('result', final.trim())
      }
    }
    
    // Handle errors
    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error)
      stopRecording()
    }
    
    // Handle end
    recognition.onend = () => {
      if (isRecording.value) {
        // Restart if still recording
        recognition.start()
      }
    }
  }
})

/**
 * Start recording
 */
const startRecording = () => {
  if (!isSupported.value || !recognition) return
  
  try {
    transcript.value = ''
    interimTranscript.value = ''
    recognition.start()
    isRecording.value = true
  } catch (error) {
    console.error('Failed to start recording:', error)
  }
}

/**
 * Stop recording
 */
const stopRecording = () => {
  if (!recognition) return
  
  try {
    recognition.stop()
    isRecording.value = false
    interimTranscript.value = ''
  } catch (error) {
    console.error('Failed to stop recording:', error)
  }
}

/**
 * Toggle recording
 */
const toggleRecording = () => {
  if (isRecording.value) {
    stopRecording()
  } else {
    startRecording()
  }
}
</script>

<template>
  <div class="voice-control">
    <!-- Not supported message -->
    <div v-if="!isSupported" class="not-supported" title="Voice input not supported">
      <span>🎤</span>
      <span class="tooltip">Voice input not supported in this browser</span>
    </div>

    <!-- Voice control button -->
    <div v-else class="voice-button-wrapper">
      <button
        @click="toggleRecording"
        class="voice-button"
        :class="{ recording: isRecording }"
        :title="isRecording ? 'Stop recording' : 'Start voice input'"
      >
        <IonMic size="large" />
        <span v-if="isRecording" class="recording-indicator"></span>
      </button>

      <!-- Live transcript display -->
      <div v-if="isRecording" class="transcript-display">
        <div class="transcript-header">
          <span>Listening...</span>
          <button @click="stopRecording" class="stop-btn">
            <IonStop size="small" style="margin-right: 4px;" />
            Stop
          </button>
        </div>
        
        <!-- Interim (real-time) transcript -->
        <div v-if="interimTranscript" class="interim-transcript">
          {{ interimTranscript }}
        </div>
        
        <!-- Final transcript -->
        <div v-if="transcript" class="final-transcript">
          {{ transcript }}
        </div>
        
        <!-- Empty state -->
        <div v-if="!transcript && !interimTranscript" class="waiting">
          Speak now...
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Main container */
.voice-control {
  display: inline-flex;
  align-items: center;
  position: relative;
}

/* Not supported state */
.not-supported {
  position: relative;
  padding: 8px 12px;
  background-color: var(--color-background-mute, #f0f0f0);
  border-radius: 6px;
  opacity: 0.5;
  cursor: not-allowed;
}

.not-supported:hover .tooltip {
  display: block;
}

.tooltip {
  display: none;
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: 5px;
  padding: 8px 12px;
  background-color: #333;
  color: white;
  border-radius: 6px;
  font-size: 0.8rem;
  white-space: nowrap;
  z-index: 1000;
}

/* Voice button wrapper */
.voice-button-wrapper {
  position: relative;
}

/* Voice button */
.voice-button {
  position: relative;
  padding: 10px 15px;
  background-color: var(--color-background-soft, #f9f9f9);
  border: 2px solid var(--color-border, #ddd);
  border-radius: 50px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 5px;
}

.voice-button:hover {
  background-color: var(--color-primary, #42b983);
  border-color: var(--color-primary, #42b983);
  color: white;
  transform: scale(1.05);
}

/* Recording state */
.voice-button.recording {
  background-color: #ef4444;
  border-color: #ef4444;
  color: white;
  animation: pulse-button 1.5s ease-in-out infinite;
}

@keyframes pulse-button {
  0%, 100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.7); }
  50% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
}

/* Recording indicator */
.recording-indicator {
  width: 8px;
  height: 8px;
  background-color: white;
  border-radius: 50%;
  animation: blink 1s ease-in-out infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

/* Transcript display */
.transcript-display {
  position: absolute;
  top: calc(100% + 10px);
  left: 0;
  min-width: 300px;
  max-width: 400px;
  background-color: var(--color-background, white);
  border: 2px solid var(--color-border, #ddd);
  border-radius: 12px;
  padding: 15px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

/* Transcript header */
.transcript-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--color-border, #e0e0e0);
  font-weight: 600;
}

.stop-btn {
  padding: 4px 12px;
  background-color: #ef4444;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  cursor: pointer;
  font-weight: 600;
}

.stop-btn:hover {
  background-color: #dc2626;
}

/* Interim transcript (real-time) */
.interim-transcript {
  padding: 10px;
  background-color: rgba(66, 185, 131, 0.1);
  border-radius: 6px;
  margin-bottom: 10px;
  color: var(--color-text-mute, #666);
  font-style: italic;
  min-height: 40px;
}

/* Final transcript */
.final-transcript {
  padding: 10px;
  background-color: var(--color-background-soft, #f9f9f9);
  border-radius: 6px;
  color: var(--color-text, #333);
  font-weight: 500;
  line-height: 1.5;
}

/* Waiting state */
.waiting {
  padding: 20px;
  text-align: center;
  color: var(--color-text-mute, #999);
  font-style: italic;
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .voice-button {
    background-color: #2c2c2c;
    border-color: #444;
  }
  
  .transcript-display {
    background-color: #2c2c2c;
    border-color: #444;
  }
  
  .interim-transcript {
    background-color: rgba(66, 185, 131, 0.2);
    color: #ccc;
  }
  
  .final-transcript {
    background-color: #1e1e1e;
    color: #fff;
  }
}
</style>
