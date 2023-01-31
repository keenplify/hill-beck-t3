import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'dark' | 'light'

interface ThemeStore {
    theme: Theme
    setTheme: (theme: Theme) => void
}

export const useThemeStore = create(
    persist<ThemeStore>(
        (set) => ({
            theme: 'light',
            setTheme: (theme: Theme) => {
                set((state) => ({
                    ...state,
                    theme,
                }))
            }
        }), {
        name: 'hb-theme',
    }
    )
)