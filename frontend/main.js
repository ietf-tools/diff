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

const app = createApp(App)

// Setup Pinia
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
app.use(pinia)

// Setup Vue Query
const vueQueryPluginOptions = {
  queryClientConfig: {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false
      }
    }
  }
}
app.use(VueQueryPlugin, vueQueryPluginOptions)

// Mount App
app.mount('#app')
