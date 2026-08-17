import { useState, useEffect } from 'react'
import {
    FiFilter,
    FiX,
    FiSearch,
    FiSliders,
    FiCalendar,
    FiGlobe,
    FiMessageSquare,
    FiTrendingUp,
    FiStar,
    FiFilm,
    FiCheck,
    FiRotateCcw,
    FiChevronDown,
} from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import GenreIcon from './GenreIcon'

const AVAILABLE_TYPES = [
    { label: 'All Types', value: '' },
    { label: 'Movies', value: 'Movie' },
    { label: 'Series', value: 'Series' },
    { label: 'Animation', value: 'Animation' },
]

const AVAILABLE_COUNTRIES = [
    { label: 'All Countries', value: '' },
    { label: 'United States', value: 'United States' },
    { label: 'Japan', value: 'Japan' },
    { label: 'South Korea', value: 'South Korea' },
    { label: 'United Kingdom', value: 'United Kingdom' },
    { label: 'Germany', value: 'Germany' },
]

const AVAILABLE_LANGUAGES = [
    { label: 'All Languages', value: '' },
    { label: 'English', value: 'English' },
    { label: 'Japanese', value: 'Japanese' },
    { label: 'Korean', value: 'Korean' },
    { label: 'German', value: 'German' },
]

const AVAILABLE_YEARS = [
    { label: 'All Years', value: '' },
    { label: '2026', value: '2026' },
    { label: '2025', value: '2025' },
    { label: '2024', value: '2024' },
    { label: '2023', value: '2023' },
    { label: '2022', value: '2022' },
    { label: '2021', value: '2021' },
    { label: '2020', value: '2020' },
    { label: '2010s', value: '2010s' },
    { label: '2000s', value: '2000s' },
    { label: 'Classic (<2000)', value: 'classic' },
]

const SORT_OPTIONS = [
    { label: '🔥 Popularity', value: 'popularity', desc: 'Most popular first' },
    { label: '✨ Latest', value: 'latest', desc: 'Newest release year' },
    { label: '⭐ IMDb Rating', value: 'rating', desc: 'Highest rated first' },
    { label: '⏳ Oldest', value: 'oldest', desc: 'Oldest release year' },
    { label: '🔤 Title (A-Z)', value: 'title', desc: 'Alphabetical order' },
]

const ALL_GENRES = [
    'Action',
    'Adventure',
    'Animation',
    'Comedy',
    'Crime',
    'Drama',
    'Fantasy',
    'History',
    'Horror',
    'Mystery',
    'Romance',
    'Sci-Fi',
    'Thriller',
]

const MediaFilterBar = ({
    filters = {},
    onFilterChange,
    onResetFilters,
    totalCount = 0,
    showTypeFilter = true,
    compact = false,
}) => {
    const [isExpanded, setIsExpanded] = useState(true)

    const currentType = filters.type || ''
    const currentCountry = filters.country || ''
    const currentLanguage = filters.language || ''
    const currentYear = filters.year || ''
    const currentSort = filters.sort || 'popularity'
    const currentSearch = filters.search || ''

    const [searchTerm, setSearchTerm] = useState(currentSearch)

    useEffect(() => {
        setSearchTerm(currentSearch)
    }, [currentSearch])

    // Parse active genres array from filters.genres or filters.genre
    const activeGenres = Array.isArray(filters.genres)
        ? filters.genres
        : filters.genres
            ? filters.genres.split(',').filter(Boolean)
            : filters.genre
                ? [filters.genre]
                : []

    // Count active filters (excluding default sort)
    const activeFilterCount =
        (showTypeFilter && currentType ? 1 : 0) +
        (currentCountry ? 1 : 0) +
        (currentLanguage ? 1 : 0) +
        (currentYear ? 1 : 0) +
        (currentSearch ? 1 : 0) +
        (currentSort && currentSort !== 'popularity' ? 1 : 0) +
        activeGenres.length

    const handleSelectChange = (key, value) => {
        onFilterChange?.({
            ...filters,
            [key]: value,
        })
    }

    const handleGenreToggle = (genre) => {
        let newGenres = [...activeGenres]
        const exists = newGenres.some(
            (g) => g.toLowerCase() === genre.toLowerCase()
        )

        if (exists) {
            newGenres = newGenres.filter(
                (g) => g.toLowerCase() !== genre.toLowerCase()
            )
        } else {
            newGenres.push(genre)
        }

        onFilterChange?.({
            ...filters,
            genre: newGenres.length === 1 ? newGenres[0] : '',
            genres: newGenres,
        })
    }

    const handleClearSingleFilter = (key, valueToRemove = null) => {
        if (key === 'genres' && valueToRemove) {
            const updated = activeGenres.filter(
                (g) => g.toLowerCase() !== valueToRemove.toLowerCase()
            )
            onFilterChange?.({
                ...filters,
                genre: updated.length === 1 ? updated[0] : '',
                genres: updated,
            })
            return
        }

        const updated = { ...filters }
        delete updated[key]
        if (key === 'genre') delete updated.genres
        if (key === 'genres') delete updated.genre
        onFilterChange?.(updated)
    }

    return (
        <div className="w-full space-y-4 rounded-3xl border border-base-300/80 bg-base-200/40 p-4 sm:p-5 backdrop-blur-xl shadow-lg transition-all duration-300">
            {/* Top Bar: Search, Quick Stats, Expand/Collapse Toggle */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-base-300/60 pb-3.5">
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={() => setIsExpanded((prev) => !prev)}
                        className="inline-flex items-center gap-2 rounded-2xl bg-primary/10 px-3.5 py-2 text-xs font-bold text-primary hover:bg-primary/20 transition-colors shadow-xs"
                    >
                        <FiSliders className="h-4 w-4" />
                        <span>Filter & Sort</span>
                        {activeFilterCount > 0 && (
                            <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] font-black text-primary-content">
                                {activeFilterCount}
                            </span>
                        )}
                        <motion.span
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <FiChevronDown className="h-3.5 w-3.5 ml-0.5" />
                        </motion.span>
                    </button>
                    {/* 
                    <div className="text-xs text-base-content/70 font-semibold">
                        <span className="text-primary font-bold">{totalCount}</span> {totalCount === 1 ? 'title found' : 'titles found'}
                    </div> */}
                </div>

                {/* Right controls: Search Input & Reset */}
                <div className="flex items-center gap-2 flex-1 sm:justify-end">
                    <div className="relative flex-1 sm:max-w-xs">
                        <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-base-content/40 h-3.5 w-3.5" />
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => {
                                const val = e.target.value
                                setSearchTerm(val)
                                handleSelectChange('search', val)
                            }}
                            placeholder="Filter by keyword..."
                            className="h-9 w-full rounded-xl border border-base-300 bg-base-100/80 pl-8.5 pr-8 text-xs font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                        />
                        {searchTerm && (
                            <button
                                type="button"
                                onClick={() => {
                                    setSearchTerm('')
                                    handleSelectChange('search', '')
                                }}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                            >
                                <FiX className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>

                    {activeFilterCount > 0 && (
                        <button
                            type="button"
                            onClick={onResetFilters}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-error/30 bg-error/10 px-3 py-2 text-xs font-bold text-error hover:bg-error hover:text-error-content transition-all shrink-0"
                            title="Reset all filters"
                        >
                            <FiRotateCcw className="h-3.5 w-3.5" />
                            <span className="hidden sm:inline">Reset</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Collapsible Main Controls */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="space-y-4 pt-1"
                    >
                        {/* 5 Dropdown Filters Grid: Type, Country, Language, Year, Sort */}
                        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
                            {/* 1. Type */}
                            {showTypeFilter && (
                                <div className="space-y-1">
                                    <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-base-content/60">
                                        <FiFilm className="h-3 w-3 text-primary" />
                                        <span>Type</span>
                                    </label>
                                    <select
                                        value={currentType}
                                        onChange={(e) => handleSelectChange('type', e.target.value)}
                                        className="h-9 w-full rounded-xl border border-base-300 bg-base-100 px-2.5 text-xs font-semibold text-base-content focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                                    >
                                        {AVAILABLE_TYPES.map((t) => (
                                            <option key={t.value} value={t.value}>
                                                {t.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            {/* 2. Country */}
                            <div className="space-y-1">
                                <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-base-content/60">
                                    <FiGlobe className="h-3 w-3 text-secondary" />
                                    <span>Country</span>
                                </label>
                                <select
                                    value={currentCountry}
                                    onChange={(e) => handleSelectChange('country', e.target.value)}
                                    className="h-9 w-full rounded-xl border border-base-300 bg-base-100 px-2.5 text-xs font-semibold text-base-content focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                                >
                                    {AVAILABLE_COUNTRIES.map((c) => (
                                        <option key={c.value} value={c.value}>
                                            {c.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* 3. Language */}
                            <div className="space-y-1">
                                <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-base-content/60">
                                    <FiMessageSquare className="h-3 w-3 text-accent" />
                                    <span>Language</span>
                                </label>
                                <select
                                    value={currentLanguage}
                                    onChange={(e) => handleSelectChange('language', e.target.value)}
                                    className="h-9 w-full rounded-xl border border-base-300 bg-base-100 px-2.5 text-xs font-semibold text-base-content focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                                >
                                    {AVAILABLE_LANGUAGES.map((l) => (
                                        <option key={l.value} value={l.value}>
                                            {l.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* 4. Year */}
                            <div className="space-y-1">
                                <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-base-content/60">
                                    <FiCalendar className="h-3 w-3 text-warning" />
                                    <span>Release Year</span>
                                </label>
                                <select
                                    value={currentYear}
                                    onChange={(e) => handleSelectChange('year', e.target.value)}
                                    className="h-9 w-full rounded-xl border border-base-300 bg-base-100 px-2.5 text-xs font-semibold text-base-content focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                                >
                                    {AVAILABLE_YEARS.map((y) => (
                                        <option key={y.value} value={y.value}>
                                            {y.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* 5. Sort By (Latest, Popularity, IMDb Rating) */}
                            <div className="space-y-1 col-span-2 sm:col-span-1">
                                <label className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-base-content/60">
                                    <FiTrendingUp className="h-3 w-3 text-info" />
                                    <span>Sort By</span>
                                </label>
                                <select
                                    value={currentSort}
                                    onChange={(e) => handleSelectChange('sort', e.target.value)}
                                    className="h-9 w-full rounded-xl border border-base-300 bg-base-100 px-2.5 text-xs font-semibold text-base-content focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                                >
                                    {SORT_OPTIONS.map((s) => (
                                        <option key={s.value} value={s.value}>
                                            {s.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Genres Multi-Select Chips Bar */}
                        <div className="space-y-2 pt-1 border-t border-base-300/50">
                            <div className="flex items-center justify-between">
                                <span className="text-[11px] font-bold uppercase tracking-wider text-base-content/60 flex items-center gap-1.5">
                                    <GenreIcon name="All" className="h-3 w-3 text-primary" />
                                    <span>Filter by Genres ({activeGenres.length} selected)</span>
                                </span>
                                {activeGenres.length > 0 && (
                                    <button
                                        type="button"
                                        onClick={() => handleClearSingleFilter('genres')}
                                        className="text-[11px] font-bold text-error hover:underline"
                                    >
                                        Clear Genres
                                    </button>
                                )}
                            </div>

                            <div className="flex flex-wrap gap-1.5">
                                {ALL_GENRES.map((genre) => {
                                    const isSelected = activeGenres.some(
                                        (g) => g.toLowerCase() === genre.toLowerCase()
                                    )
                                    return (
                                        <button
                                            key={genre}
                                            type="button"
                                            onClick={() => handleGenreToggle(genre)}
                                            className={`inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-semibold transition-all duration-200 ${isSelected
                                                    ? 'bg-primary text-primary-content font-bold shadow-md shadow-primary/20 scale-102'
                                                    : 'bg-base-100/90 text-base-content/75 border border-base-300/70 hover:bg-base-200 hover:text-base-content'
                                                }`}
                                        >
                                            <GenreIcon
                                                name={genre}
                                                className={`h-3 w-3 ${isSelected ? 'text-primary-content' : 'text-primary'}`}
                                            />
                                            <span>{genre}</span>
                                            {isSelected && <FiCheck className="h-3 w-3 stroke-[3]" />}
                                        </button>
                                    )
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Active Filters Row with Quick Remove Badges */}
            {activeFilterCount > 0 && (
                <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-base-300/50">
                    <span className="text-[11px] font-bold text-base-content/50 uppercase tracking-wider mr-1">
                        Active:
                    </span>

                    {showTypeFilter && currentType && (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-primary/15 border border-primary/30 px-2 py-0.5 text-xs font-semibold text-primary">
                            Type: {currentType}
                            <button
                                type="button"
                                onClick={() => handleClearSingleFilter('type')}
                                className="hover:text-error ml-0.5"
                                aria-label="Remove type filter"
                            >
                                <FiX className="h-3 w-3" />
                            </button>
                        </span>
                    )}

                    {currentCountry && (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-secondary/15 border border-secondary/30 px-2 py-0.5 text-xs font-semibold text-secondary">
                            Country: {currentCountry}
                            <button
                                type="button"
                                onClick={() => handleClearSingleFilter('country')}
                                className="hover:text-error ml-0.5"
                                aria-label="Remove country filter"
                            >
                                <FiX className="h-3 w-3" />
                            </button>
                        </span>
                    )}

                    {currentLanguage && (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-accent/15 border border-accent/30 px-2 py-0.5 text-xs font-semibold text-accent">
                            Lang: {currentLanguage}
                            <button
                                type="button"
                                onClick={() => handleClearSingleFilter('language')}
                                className="hover:text-error ml-0.5"
                                aria-label="Remove language filter"
                            >
                                <FiX className="h-3 w-3" />
                            </button>
                        </span>
                    )}

                    {currentYear && (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-warning/15 border border-warning/30 px-2 py-0.5 text-xs font-semibold text-warning">
                            Year: {currentYear}
                            <button
                                type="button"
                                onClick={() => handleClearSingleFilter('year')}
                                className="hover:text-error ml-0.5"
                                aria-label="Remove year filter"
                            >
                                <FiX className="h-3 w-3" />
                            </button>
                        </span>
                    )}

                    {currentSort && currentSort !== 'popularity' && (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-info/15 border border-info/30 px-2 py-0.5 text-xs font-semibold text-info">
                            Sort: {SORT_OPTIONS.find((s) => s.value === currentSort)?.label || currentSort}
                            <button
                                type="button"
                                onClick={() => handleSelectChange('sort', 'popularity')}
                                className="hover:text-error ml-0.5"
                                aria-label="Reset sort to default"
                            >
                                <FiX className="h-3 w-3" />
                            </button>
                        </span>
                    )}

                    {currentSearch && (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-base-300 px-2 py-0.5 text-xs font-semibold text-base-content">
                            &ldquo;{currentSearch}&rdquo;
                            <button
                                type="button"
                                onClick={() => handleClearSingleFilter('search')}
                                className="hover:text-error ml-0.5"
                                aria-label="Remove search keyword"
                            >
                                <FiX className="h-3 w-3" />
                            </button>
                        </span>
                    )}

                    {activeGenres.map((g) => (
                        <span
                            key={g}
                            className="inline-flex items-center gap-1 rounded-lg bg-primary/20 border border-primary/40 px-2 py-0.5 text-xs font-bold text-primary"
                        >
                            {g}
                            <button
                                type="button"
                                onClick={() => handleClearSingleFilter('genres', g)}
                                className="hover:text-error ml-0.5"
                                aria-label={`Remove genre ${g}`}
                            >
                                <FiX className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </div>
    )
}

export default MediaFilterBar
