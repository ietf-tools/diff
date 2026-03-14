import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import EditorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import App from './App.vue'

self.MonacoEnvironment = {
  getWorker() {
    return new EditorWorker()
  }
}

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
const app = createApp(App)

app.use(pinia)
app.use(VueQueryPlugin)
app.mount('#app')
