import { defineStore } from 'pinia'

import { fetchSession, loginUser, logoutUser } from '../services/auth.js'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    mode: 'guest',
    bootstrapped: false,
  }),

  getters: {
    isAuthenticated: (state) => state.mode === 'authenticated' && !!state.user,
    isDemo: (state) => state.mode === 'demo',
  },

  actions: {
    async restoreSession() {
      try {
        const response = await fetchSession()
        this.user = response.user
        this.mode = 'authenticated'
      } catch (error) {
        this.user = null
        this.mode = 'guest'
        if (error.status && error.status !== 401) {
          throw error
        }
      } finally {
        this.bootstrapped = true
      }
    },

    async login(credentials) {
      const response = await loginUser(credentials)
      this.user = response.user
      this.mode = 'authenticated'
      this.bootstrapped = true
      return response.user
    },

    enableDemo(user) {
      this.user = user
      this.mode = 'demo'
      this.bootstrapped = true
    },

    async logout() {
      if (this.mode === 'authenticated') {
        await logoutUser()
      }

      this.user = null
      this.mode = 'guest'
      this.bootstrapped = true
    },
  },
})
