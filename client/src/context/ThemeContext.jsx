import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const ThemeContext = createContext(null)

const STORAGE_KEY = 'icsn-theme'

function getInitialTheme() {
    try {
        const savedTheme = localStorage.getItem(STORAGE_KEY)

        if (savedTheme === 'light' || savedTheme === 'dark') {
            return savedTheme
        }
    } catch {
        // Ignore localStorage errors.
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
}

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(getInitialTheme)

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)

        try {
            localStorage.setItem(STORAGE_KEY, theme)
        } catch {
            // Ignore localStorage errors.
        }
    }, [theme])

    useEffect(() => {
        const mediaQuery = window.matchMedia(
            '(prefers-color-scheme: dark)',
        )

        const handleSystemThemeChange = (event) => {
            try {
                const savedTheme = localStorage.getItem(STORAGE_KEY)

                if (!savedTheme) {
                    setTheme(event.matches ? 'dark' : 'light')
                }
            } catch {
                setTheme(event.matches ? 'dark' : 'light')
            }
        }

        mediaQuery.addEventListener('change', handleSystemThemeChange)

        return () => {
            mediaQuery.removeEventListener('change', handleSystemThemeChange)
        }
    }, [])

    const toggleTheme = () => {
        setTheme((currentTheme) =>
            currentTheme === 'dark' ? 'light' : 'dark',
        )
    }

    const value = useMemo(
        () => ({
            theme,
            setTheme,
            toggleTheme,
            isDark: theme === 'dark',
        }),
        [theme],
    )

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)

    if (!context) {
        throw new Error('useTheme must be used inside ThemeProvider')
    }

    return context
}