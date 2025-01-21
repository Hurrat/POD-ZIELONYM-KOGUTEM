// main.js
import { createApp } from 'vue'
import App from './App.vue'
import './assets/main.css'

// Splide (karuzela)
import '@splidejs/splide/dist/css/splide.min.css'

// FontAwesome
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
app.mount('#app')
