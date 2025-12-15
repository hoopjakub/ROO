/**
 * main.js - Application entry point
 * 
 * Purpose:
 * - Initialize Vue application
 * - Register plugins (router, ionicons, etc.)
 * - Mount app to DOM
 * - Configure global settings
 * 
 * Features:
 * - Vue Router integration
 * - Global error handling
 * - Performance monitoring (optional)
 * - Service worker registration (optional)
 */

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Create Vue application instance
const app = createApp(App)

// Use Vue Router for navigation
app.use(router)

// Global error handler for debugging
app.config.errorHandler = (err, instance, info) => {
  console.error('Global error:', err)
  console.error('Component:', instance)
  console.error('Error info:', info)
}

// Global warning handler (development only)
if (import.meta.env.DEV) {
  app.config.warnHandler = (msg, instance, trace) => {
    console.warn('Warning:', msg)
    console.warn('Trace:', trace)
  }
}

// Performance monitoring (optional)
if (import.meta.env.DEV) {
  app.config.performance = true
}

// Mount app to DOM
app.mount('#app')

// Log app initialization
console.log('📝 Notes App initialized')
console.log('🎨 Theme: Check localStorage for saved preferences')
console.log('📱 PWA: Service worker support coming soon')

// Register service worker (optional - for PWA support)
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('Service Worker registered:', registration)
      })
      .catch((error) => {
        console.log('Service Worker registration failed:', error)
      })
  })
}
