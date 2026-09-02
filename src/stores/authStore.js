import { create } from 'zustand'
import { getData } from 'src/helpers/api'

export const useAuthStore = create((set, get) => ({
  auth: {},

  isAuth: () => !!get().auth?.id,

  setAuth: async (value) => {
    if (value) {
      set({ auth: value })
      return value
    }

    const data = await getData('authSession/')

    set({ auth: data })
    return data
  },

  updateAuth: (data) => {
    const current = get().auth
    set({ auth: { ...current, ...data } })
  },

  deleteAuth: async () => {
    set({ auth: null })
    sessionStorage.removeItem('authToken')

    await getData('logout/')
    window.location.href = '/'
  },
}))
