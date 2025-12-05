import { create } from 'zustand'

export const useToastifyStore = create((set) => ({
  toastify: null,

  setToastify: (data) => {
    set({ toastify: data })
  },

  clearToastify: () => {
    set({ toastify: null })
  },
}))
