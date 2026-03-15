import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { isPlainObject } from 'es-toolkit/predicate'
import ky from 'ky'
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
        queryFn: async ({ queryKey }) => {
          const safeQueryKey = Array.isArray(queryKey) ? queryKey : [queryKey]
          const apiPath = safeQueryKey[0]
          const extraFetchOpts = isPlainObject(safeQueryKey.at(-1))
            ? safeQueryKey.at(-1)
            : { method: 'GET' }

          return ky(apiPath, {
            prefixUrl: '/api/',
            ...extraFetchOpts
          }).json()
        },
        refetchOnWindowFocus: false
      }
    }
  }
}
app.use(VueQueryPlugin, vueQueryPluginOptions)

// Mount App
app.mount('#app')
