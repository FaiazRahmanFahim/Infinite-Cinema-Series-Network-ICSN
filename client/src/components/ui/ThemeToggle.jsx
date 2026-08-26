import { FiMoon, FiSun } from 'react-icons/fi'
import { useTheme } from '../../context/ThemeContext'

function ThemeToggle() {
    const { isDark, toggleTheme } = useTheme()

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="btn btn-ghost btn-circle btn-sm text-base-content/80 hover:text-primary"
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            title={isDark ? 'Light mode' : 'Dark mode'}
        >
            {isDark ? (
                <FiSun className="h-4 w-4" />
            ) : (
                <FiMoon className="h-4 w-4" />
            )}
        </button>
    )
}

export default ThemeToggle