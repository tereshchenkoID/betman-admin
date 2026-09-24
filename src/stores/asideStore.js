import { create } from 'zustand'

export const useAsideStore = create((set) => ({
  aside: null,

  setAside: (data) => set({ aside: data }),
}))
