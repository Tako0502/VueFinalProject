// main.js - Application Entry Point
// This file initializes the Vue application with all required plugins
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './assets/main.css'

// Create the Vue application instance
const app = createApp(App)

// [REQ 6] Install Pinia for state management
app.use(createPinia())

// [REQ 5] Install Vue Router for navigation
app.use(router)

// Mount the application to the DOM
app.mount('#app')
