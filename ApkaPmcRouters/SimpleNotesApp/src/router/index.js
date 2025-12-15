/**
 * router/index.js - Vue Router configuration
 * 
 * Purpose:
 * - Define application routes
 * - Configure navigation between pages
 * - Handle route guards and meta information
 * 
 * Routes:
 * - / : Home page with notes list
 * - /note/new : Create new note
 * - /note/:id : Edit existing note
 * 
 * Features:
 * - HTML5 History mode
 * - Dynamic route parameters
 * - Route meta information
 * - Navigation guards (optional)
 */

import { createRouter, createWebHistory } from 'vue-router'
import NotesHome from '../pages/NotesHome.vue'
import NoteEditor from '../pages/NoteEditor.vue'

/**
 * Application routes configuration
 */
const routes = [
  {
    path: '/',
    name: 'home',
    component: NotesHome,
    meta: {
      title: 'Notes Home',
      description: 'View all your notes'
    }
  },
  {
    path: '/note/new',
    name: 'note-new',
    component: NoteEditor,
    meta: {
      title: 'New Note',
      description: 'Create a new note'
    }
  },
  {
    path: '/note/:id',
    name: 'note-edit',
    component: NoteEditor,
    meta: {
      title: 'Edit Note',
      description: 'Edit an existing note'
    }
  },
  {
    // Catch-all route for 404 Not Found
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/'
  }
]

/**
 * Create router instance
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // Scroll behavior configuration
  scrollBehavior(to, from, savedPosition) {
    // If savedPosition exists (browser back/forward), use it
    if (savedPosition) {
      return savedPosition
    }
    // Otherwise scroll to top
    return { top: 0, behavior: 'smooth' }
  }
})

/**
 * Global navigation guard - Before each route
 * Can be used for authentication, logging, etc.
 */
router.beforeEach((to, from, next) => {
  // Update document title based on route meta
  if (to.meta.title) {
    document.title = `${to.meta.title} | Notes App`
  } else {
    document.title = 'Notes App'
  }
  
  // Continue navigation
  next()
})

/**
 * Global navigation guard - After each route
 * Can be used for analytics, logging, etc.
 */
router.afterEach((to, from) => {
  // Log navigation for debugging
  console.log(`Navigated from ${from.path} to ${to.path}`)
})

export default router
