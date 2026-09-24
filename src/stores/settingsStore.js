import { create } from 'zustand'

import { getData } from 'src/helpers/api'

export const useSettingsStore = create((set) => ({
  settings: {},

  setSettings: async (value) => {
    if (value) {
      set({ settings: value })
      return value
    }

    const data = await getData('settings/')
    set({ settings: data })
    return data
  }
}))
