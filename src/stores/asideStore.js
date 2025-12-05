import { create } from 'zustand'

export const useAsideStore = create((set, get) => ({
  aside: null,

  setAside: (data) => set({ aside: data }),
}))
