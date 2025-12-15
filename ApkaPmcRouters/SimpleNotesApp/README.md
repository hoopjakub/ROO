# 📝 Simple Notes App

A modern, feature-rich notes application built with Vue 3, showcasing various Web APIs and modern browser capabilities.

## ✨ Features

### Core Functionality
- ✅ **Create, Edit, Delete Notes** - Full CRUD operations
- 💾 **LocalStorage Persistence** - Auto-save all notes
- 🔍 **Search & Filter** - Find notes quickly
- ⌨️ **Keyboard Shortcuts** - Boost productivity

### Modern Web APIs
- 🎤 **Voice Input** - Dictate notes using Web Speech API
- 🔊 **Text-to-Speech** - Read notes aloud
- 🔋 **Battery Status** - Monitor device battery
- 📡 **Online/Offline Detection** - Network status tracking
- 📊 **FPS Monitor** - Real-time performance monitoring
- 😴 **Idle Detection** - Auto-save on inactivity
- 🔔 **Push Notifications** - Desktop notifications (optional)

### User Experience
- 🌙 **Dark Mode** - Toggle between light/dark themes
- 🎨 **Style Customizer** - Customize colors and fonts
- 🌍 **Language Selector** - Multi-language support ready
- 📱 **Responsive Design** - Works on all devices
- ⚡ **Fast Performance** - Optimized Vue 3 Composition API

## 📂 Project Structure

```
├── src/
│   ├── App.vue                          # Root component with layout
│   ├── main.js                          # Application entry point
│   ├── router/
│   │   └── index.js                     # Vue Router configuration
│   ├── composables/
│   │   ├── useNotesApp.js              # Notes CRUD operations
│   │   ├── useNoteShortcuts.js         # Keyboard shortcuts
│   │   ├── useNotificationManager.js   # Push notifications
│   │   ├── useDeviceStatus.js          # Battery, network, FPS
│   │   └── useDark.js                  # Dark mode management
│   ├── pages/
│   │   ├── NotesHome.vue               # Notes list page
│   │   └── NoteEditor.vue              # Note creation/editing page
│   └── components/
│       ├── NoteCard.vue                # Individual note card
│       ├── NotesList.vue               # Notes grid/list
│       ├── StyleCustomizer.vue         # Theme customizer
│       ├── BatteryIndicator.vue        # Battery status display
│       ├── IdleModal.vue               # Idle detection modal
│       ├── OfflineIndicator.vue        # Network status
│       ├── FpsMonitor.vue              # Performance monitor
│       ├── VoiceControl.vue            # Voice input
│       ├── LanguageSelector.vue        # Language switcher
│       └── SpeechReader.vue            # Text-to-speech
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Install dependencies:**
   ```sh
   npm install
   ```

2. **Run development server:**
   ```sh
   npm run dev
   ```

3. **Open browser:**
   Navigate to `http://localhost:5173`

### Build for Production

```sh
npm run build
```

The built files will be in the `dist/` directory.

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+S` / `Cmd+S` | Save note |
| `Ctrl+N` / `Cmd+N` | New note |
| `Ctrl+F` / `Cmd+F` | Focus search |
| `Escape` | Cancel/close |
| `Ctrl+Shift+D` | Toggle dark mode |

## 🎨 Customization

### Theme Colors
Use the Style Customizer (🎨 button) to:
- Choose from preset themes
- Pick custom colors
- Adjust font sizes
- All preferences saved to localStorage

### Dark Mode
- Toggle with moon/sun icon in header
- Supports system preference detection
- Persistent across sessions

## 🔧 Technology Stack

- **Vue 3** - Progressive JavaScript framework
- **Vue Router** - Official routing solution
- **Vite** - Next-generation frontend tooling
- **Composition API** - Modern Vue development pattern
- **Web APIs:**
  - Web Speech API (voice input & text-to-speech)
  - Battery Status API
  - Network Information API
  - Notification API
  - Idle Detection API
  - Performance API

## 📝 Code Documentation

Every file includes detailed comments explaining:
- **Purpose** - What the file does
- **Features** - Key functionality
- **Usage** - How to use/import
- **Props/Parameters** - Input specifications
- **Events/Returns** - Output specifications

## 🌐 Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Core Notes | ✅ | ✅ | ✅ | ✅ |
| Voice Input | ✅ | ❌ | ✅ | ✅ |
| Battery API | ✅ | ❌ | ❌ | ✅ |
| Notifications | ✅ | ✅ | ✅ | ✅ |

## 🎯 Learning Objectives

This project demonstrates:
1. **Vue 3 Composition API** - Modern reactive patterns
2. **Component Architecture** - Reusable, maintainable code
3. **State Management** - Composables for shared state
4. **Routing** - SPA navigation with Vue Router
5. **Web APIs** - Browser capabilities integration
6. **LocalStorage** - Client-side data persistence
7. **Responsive Design** - Mobile-first approach
8. **Dark Mode** - Theme switching implementation
9. **Accessibility** - Keyboard navigation, ARIA labels
10. **Performance** - Optimization techniques

## 🤝 Contributing

This is an educational project. Feel free to:
- Fork and experiment
- Add new features
- Improve existing code
- Report issues

## 📄 License

MIT License - feel free to use for learning and personal projects.

## 🙏 Acknowledgments

Built with love using:
- [Vue.js](https://vuejs.org/)
- [Vite](https://vitejs.dev/)
- [MDN Web Docs](https://developer.mozilla.org/) for Web API references

---

**Made with ❤️ for learning Vue 3 and modern web development**
