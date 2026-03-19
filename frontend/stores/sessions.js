import { defineStore } from 'pinia'
import { v4 as uuid } from 'uuid'

export const useSessionsStore = defineStore('sessions', {
  state: () => ({
    currentId: 'untitled',
    all: [
      {
        id: 'untitled',
        name: 'Untitled',
        docs: []
      }
    ],
    leftDocId: '',
    rightDocId: ''
  }),
  getters: {
    current(state) {
      return state.all.find((s) => s.id === state.currentId)
    },
    leftDoc(state) {
      return this.current.docs?.find((d) => d.id === state.leftDocId)
    },
    rightDoc(state) {
      return this.current.docs?.find((d) => d.id === state.rightDocId)
    }
  },
  actions: {
    addDocument(name, contents) {
      const docId = uuid()

      this.current.docs.push({
        id: docId,
        name,
        contents
      })

      if (!this.leftDocId) {
        this.leftDocId = docId
      } else if (!this.rightDocId) {
        this.rightDocId = docId
      }
    }
  }
})
