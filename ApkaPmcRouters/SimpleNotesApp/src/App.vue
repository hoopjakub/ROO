<!-- 
  App.vue - Root application component
  
  Purpose:
  - Main app container and layout
  - Router view for navigation
  - Global styles and theme management
  - Dark mode toggle integration
  
  Features:
  - Responsive layout
  - Dark mode support with toggle button
  - Router navigation
  - Global app state management
-->

<script setup>
import { RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useDark } from './composables/useDark'

// Dark mode management - initialize on mount
const { isDark, toggleDark } = useDark()

onMounted(() => {
  // Ensure theme is applied on mount
  const saved = localStorage.getItem('noteapp-theme')
  if (saved) {
    const { setDark } = useDark()
    setDark(saved === 'dark')
  }
})
</script>

<template>
  <div id="app" :class="{ dark: isDark }">
    <!-- Header with app branding and dark mode toggle -->
    <header class="app-header-main">
      <div class="header-content">
        <div class="app-branding">
          <h1 class="app-title">Notes App</h1>
          <p class="app-subtitle">Capture your thoughts</p>
        </div>
        
        <!-- Dark mode toggle button -->
        <button 
          @click="toggleDark" 
          class="dark-mode-toggle"
          :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
        >
          <span class="toggle-icon">{{ isDark ? '☀' : '☾' }}</span>
        </button>
      </div>
    </header>

    <!-- Main content area with router view -->
    <main class="app-main">
      <RouterView />
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <p>
        Built with care using Vue 3 | 
        <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue.js Docs</a>
      </p>
    </footer>
  </div>
</template>

<style>
/* Global CSS Variables for theming */
:root {
  /* Light mode colors - with subtle primary undertone */
  --color-background: #fafbf9;
  --color-background-soft: #f5f8f6;
  --color-background-mute: #eef3f0;
  --color-border: #d9e8df;
  --color-text: #333333;
  --color-text-mute: #666666;
  --color-heading: #1a1a1a;
  --color-primary: #42b983;
  --color-primary-dark: #369970;
  --color-primary-light: #52c997;
  --color-secondary: #4a90e2;
  --color-success: #27ae60;
  --color-warning: #f39c12;
  --color-danger: #e74c3c;
  --color-info: #3498db;
  
  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  
  /* Border radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 16px;
  
  /* Shadows with subtle primary tint */
  --shadow-sm: 0 2px 4px rgba(66, 185, 131, 0.08);
  --shadow-md: 0 4px 8px rgba(66, 185, 131, 0.1);
  --shadow-lg: 0 8px 16px rgba(66, 185, 131, 0.12);
  --shadow-xl: 0 12px 32px rgba(66, 185, 131, 0.15);
  
  /* Transitions */
  --transition-fast: 0.15s ease;
  --transition-normal: 0.3s ease;
  --transition-slow: 0.5s ease;
  
  /* Font size base */
  --font-size-base: 16px;
}

/* Dark mode colors - with subtle primary undertone */
:root.dark {
  --color-background: #0f1410;
  --color-background-soft: #161d1a;
  --color-background-mute: #1f2924;
  --color-border: #2a3a31;
  --color-text: #e0e0e0;
  --color-text-mute: #888888;
  --color-heading: #ffffff;
  --color-secondary: #5ba3f5;
  --color-success: #2ecc71;
  --color-warning: #f1c40f;
  --color-danger: #e74c3c;
  --color-info: #3498db;
  --shadow-sm: 0 2px 4px rgba(66, 185, 131, 0.15);
  --shadow-md: 0 4px 8px rgba(66, 185, 131, 0.2);
  --shadow-lg: 0 8px 16px rgba(66, 185, 131, 0.25);
  --shadow-xl: 0 12px 32px rgba(66, 185, 131, 0.3);
}

/* Global reset and base styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 
    'Helvetica Neue', sans-serif;
  line-height: 1.6;
  color: var(--color-text);
  background-color: var(--color-background);
  transition: background-color var(--transition-normal), color var(--transition-normal);
  font-size: var(--font-size-base);
}

html {
  color-scheme: light;
}

html.dark {
  color-scheme: dark;
}

/* App container */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background);
  transition: background-color var(--transition-normal);
}

/* Main header */
.app-header-main {
  background-color: var(--color-background-soft);
  border-bottom: 2px solid var(--color-border);
  padding: var(--spacing-md) var(--spacing-lg);
  box-shadow: var(--shadow-sm);
  position: sticky;
  top: 0;
  z-index: 100;
  transition: all var(--transition-normal);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.app-branding {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.app-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0;
}

.app-subtitle {
  font-size: 0.9rem;
  color: var(--color-text-mute);
  margin: 0;
}

/* Dark mode toggle button */
.dark-mode-toggle {
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--color-background-mute);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  cursor: pointer;
  transition: all var(--transition-normal);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text);
}

.dark-mode-toggle:hover {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  transform: scale(1.1) rotate(15deg);
}

/* Main content area */
.app-main {
  flex: 1;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  padding: var(--spacing-lg);
}

/* Footer */
.app-footer {
  background-color: var(--color-background-soft);
  border-top: 1px solid var(--color-border);
  padding: var(--spacing-lg);
  text-align: center;
  color: var(--color-text-mute);
  font-size: 0.9rem;
}

.app-footer a {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 600;
  transition: color var(--transition-fast);
}

.app-footer a:hover {
  color: var(--color-primary-dark);
  text-decoration: underline;
}

/* Responsive design */
@media (max-width: 768px) {
  .app-title {
    font-size: 1.4rem;
  }
  
  .app-subtitle {
    font-size: 0.8rem;
  }
  
  .app-main {
    padding: var(--spacing-md);
  }
}

/* Utility classes */
.text-center {
  text-align: center;
}

/* Global input styling with primary undertone */
input[type="text"],
input[type="email"],
input[type="password"],
input[type="number"],
input[type="search"],
textarea,
select {
  background-color: var(--color-background-soft);
  border: 2px solid var(--color-border);
  color: var(--color-text);
  border-radius: var(--radius-md);
  padding: var(--spacing-md);
  font-family: inherit;
  font-size: 1rem;
  transition: all var(--transition-normal);
}

input[type="text"]:focus,
input[type="email"]:focus,
input[type="password"]:focus,
input[type="number"]:focus,
input[type="search"]:focus,
textarea:focus,
select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.15);
}

:root.dark input[type="text"]:focus,
:root.dark input[type="email"]:focus,
:root.dark input[type="password"]:focus,
:root.dark input[type="number"]:focus,
:root.dark input[type="search"]:focus,
:root.dark textarea:focus,
:root.dark select:focus {
  box-shadow: 0 0 0 3px rgba(66, 185, 131, 0.25);
}

/* Global button styling */
button {
  font-family: inherit;
  cursor: pointer;
  transition: all var(--transition-normal);
}

button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.mt-1 { margin-top: var(--spacing-sm); }
.mt-2 { margin-top: var(--spacing-md); }
.mt-3 { margin-top: var(--spacing-lg); }

.mb-1 { margin-bottom: var(--spacing-sm); }
.mb-2 { margin-bottom: var(--spacing-md); }
.mb-3 { margin-bottom: var(--spacing-lg); }

/* Scrollbar styling with primary undertone */
::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}

::-webkit-scrollbar-track {
  background: var(--color-background-soft);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, var(--color-border) 0%, var(--color-primary) 100%);
  border-radius: var(--radius-sm);
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, var(--color-text-mute) 0%, var(--color-primary-light) 100%);
}
</style>

