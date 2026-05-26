import { defineStore } from 'pinia'
import { computed } from 'vue'
import { v4 as uuid } from 'uuid'
import { useStorage } from '@vueuse/core'
import localforage from 'localforage'

localforage.config({
  name: 'diff'
})

export const docsData = localforage

export const useSessionsStore = defineStore('sessions', () => {
  // STATE
  const currentId = useStorage('sessionsCurrentId', 'untitled')
  const all = useStorage('sessionsAll', [
    {
      id: 'untitled',
      name: 'Untitled',
      docs: [],
      kind: 'personal'
    },
    {
      id: 'draft-ietf-detnet-controller-plane-framework',
      name: 'draft-ietf-detnet-controller-plane-framework',
      docs: [],
      kind: 'github'
    }
  ])
  const leftDocId = useStorage('sessionsLeftDocId', '')
  const rightDocId = useStorage('sessionsRightDocId', '')

  // GETTERS
  const current = computed(() => all.value.find((s) => s.id === currentId.value))
  const leftDoc = computed(() => current.value.find((d) => d.id === leftDocId.value))
  const rightDoc = computed(() => current.value.find((d) => d.id === rightDocId.value))

  // ACTIONS
  async function addDocument(name, contents, subtitle = '') {
    const docId = uuid()

    await localforage.setItem(docId, contents)

    current.value.docs.push({
      id: docId,
      name,
      subtitle
    })

    if (!leftDocId.value) {
      leftDocId.value = docId
    } else if (!rightDocId.value) {
      rightDocId.value = docId
    }
  }

  return {
    currentId,
    all,
    leftDocId,
    rightDocId,
    current,
    leftDoc,
    rightDoc,
    addDocument
  }
})
