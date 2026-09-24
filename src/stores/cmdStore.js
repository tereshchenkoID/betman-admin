import { create } from 'zustand'

export const useCmdStore = create((set) => ({
  cmd: null,

  setCmd: (data) => set({ cmd: data }),
}))
