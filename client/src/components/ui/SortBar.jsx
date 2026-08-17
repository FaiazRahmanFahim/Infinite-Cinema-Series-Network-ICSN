import { useState, useEffect } from 'react'
import { FiTrendingUp, FiSearch, FiX } from 'react-icons/fi'

const SORT_OPTIONS = [
    { label: '🔥 Popularity', value: 'popularity' },
    { label: '✨ Latest', value: 'latest' },
    { label: '⭐ IMDb Rating', value: 'rating' },
    { label: '⏳ Oldest', value: 'oldest' },
    { label: '🔤 Title (A-Z)', value: 'title' },
]

const SortBar = ({
    searchQuery = '',
    onSearchChange,
    currentSort = 'popularity',
    onSortChange,
    totalCount = 0,
    activeGenre = '',
    onClearGenre,
    placeholder = 'Search titles, cast, director...',
}) => {
    const [inputValue, setInputValue] = useState(searchQuery)

    // Sync input value when external searchQuery changes
    useEffect(() => {
        setInputValue(searchQuery)
    }, [searchQuery])

    const handleInputChange = (e) => {
        const value = e.target.value
        setInputValue(value)
        onSearchChange?.(value)
    }

    const handleClear = () => {
        setInputValue('')
        onSearchChange?.('')
    }

    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-base-300/70 bg-base-200/40 p-3 sm:px-4 backdrop-blur-md shadow-xs">
            {/* Left: Total count & active genre indicator */}
            <div className="flex flex-wrap items-center gap-2">
                {/* <span className="text-xs font-semibold text-base-content/70">
                    <span className="font-bold text-primary">{totalCount}</span> Items Found
                </span> */}

                {activeGenre && (
                    <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/15 border border-primary/30 px-2.5 py-1 text-xs font-bold text-primary">
                        <span>Genre: {activeGenre}</span>
                        {onClearGenre && (
                            <button
                                type="button"
                                onClick={onClearGenre}
                                className="hover:text-error ml-0.5"
                                aria-label="Clear genre filter"
                            >
                                <FiX className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </span>
                )}
            </div>

            {/* Right: Individual Search + Sort By Dropdown */}
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-end">
                {/* Individual Search input with full space support */}
                <div className="relative flex-1 sm:w-56 sm:flex-none">
                    <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 h-3.5 w-3.5" />
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder={placeholder}
                        className="h-8.5 w-full rounded-xl border border-base-300 bg-base-100 pl-8.5 pr-7 text-xs font-medium text-base-content placeholder-base-content/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                    {inputValue && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                            aria-label="Clear search"
                        >
                            <FiX className="h-3.5 w-3.5" />
                        </button>
                    )}
                </div>

                {/* Sort By Dropdown */}
                <div className="flex items-center gap-1.5 shrink-0">
                    <label className="flex items-center gap-1 text-xs font-bold text-base-content/60 uppercase tracking-wider">
                        <FiTrendingUp className="h-3.5 w-3.5 text-primary" />
                        <span className="hidden md:inline">Sort:</span>
                    </label>
                    <select
                        value={currentSort}
                        onChange={(e) => onSortChange?.(e.target.value)}
                        className="h-8.5 rounded-xl border border-base-300 bg-base-100 px-3 text-xs font-semibold text-base-content focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                        aria-label="Sort content"
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    )
}

export default SortBar
