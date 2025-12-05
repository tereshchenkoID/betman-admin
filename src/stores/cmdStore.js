import { create } from 'zustand'

export const useCmdStore = create((set, get) => ({
  cmd: null,

  setCmd: (data) => set({ cmd: data }),
}))
