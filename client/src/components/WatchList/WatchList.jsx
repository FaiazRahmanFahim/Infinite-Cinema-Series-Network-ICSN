import React, { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FiBookmark,
    FiFilm,
    FiTv,
    FiSmile,
    FiAward,
    FiTrash2,
    FiPlay,
    FiStar,
    FiClock,
    FiCalendar,
    FiSearch,
    FiSliders,
    FiCheckCircle,
    FiEye,
    FiList,
    FiGrid,
    FiShare2,
    FiDownload,
    FiUpload,
    FiShuffle,
    FiX,
    FiPlus,
    FiArrowRight,
    FiZap,
    FiGlobe,
    FiCheck,
    FiAlertCircle,
    FiRefreshCw,
    FiChevronDown,
} from 'react-icons/fi'
import { useWatchlist } from '../../context/WatchlistContext'
import GenreIcon from '../ui/GenreIcon'
import RecentlyViewedRibbon from '../ui/RecentlyViewedRibbon'
import {
    pageVariants,
    sectionVariants,
    containerVariants,
    itemVariants,
    modalVariants,
    defaultViewport,
} from '../../animations/motionVariants'

const STATUS_CONFIG = {
    plan_to_watch: {
        label: 'Plan to Watch',
        color: 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30 hover:bg-blue-500/25',
        dotColor: 'bg-blue-500 dark:bg-blue-400',
    },
    watching: {
        label: 'Watching',
        color: 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30 hover:bg-amber-500/25',
        dotColor: 'bg-amber-500 dark:bg-amber-400',
    },
    completed: {
        label: 'Completed',
        color: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25',
        dotColor: 'bg-emerald-500 dark:bg-emerald-400',
    },
}

const STATUS_OPTIONS = [
    { value: 'plan_to_watch', label: 'Plan to Watch', dotColor: 'bg-blue-500 dark:bg-blue-400' },
    { value: 'watching', label: 'Currently Watching', dotColor: 'bg-amber-500 dark:bg-amber-400' },
    { value: 'completed', label: 'Completed', dotColor: 'bg-emerald-500 dark:bg-emerald-400' },
]

const WatchStatusDropdown = ({ status, onChange, align = 'top', className = '' }) => {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = React.useRef(null)
    const currentStatus = status || 'plan_to_watch'
    const currentConfig = STATUS_CONFIG[currentStatus] || STATUS_CONFIG.plan_to_watch

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false)
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
            document.addEventListener('touchstart', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('touchstart', handleClickOutside)
        }
    }, [isOpen])

    return (
        <div ref={dropdownRef} className={`relative ${className}`}>
            <button
                type="button"
                onClick={(e) => {
                    e.stopPropagation()
                    e.preventDefault()
                    setIsOpen((prev) => !prev)
                }}
                className={`flex w-full items-center justify-between gap-1.5 rounded-xl border px-2.5 py-1.5 text-[11px] font-bold backdrop-blur-md transition-all duration-200 cursor-pointer shadow-xs focus:outline-none focus:ring-1 focus:ring-primary/40 ${
                    isOpen ? 'ring-2 ring-primary/40' : ''
                } ${currentConfig.color}`}
                aria-haspopup="listbox"
                aria-expanded={isOpen}
                aria-label="Change watch status"
            >
                <div className="flex items-center gap-1.5 min-w-0">
                    <span className={`h-2 w-2 shrink-0 rounded-full ${currentConfig.dotColor}`} />
                    <span className="truncate">{currentConfig.label}</span>
                </div>
                <FiChevronDown
                    className={`h-3 w-3 shrink-0 opacity-70 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.ul
                        initial={{ opacity: 0, y: align === 'top' ? 6 : -6, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: align === 'top' ? 4 : -4, scale: 0.96 }}
                        transition={{ duration: 0.15, ease: 'easeOut' }}
                        className={`absolute ${
                            align === 'top' ? 'bottom-full mb-1.5' : 'top-full mt-1.5'
                        } left-0 right-0 z-50 min-w-[150px] overflow-hidden rounded-xl border border-base-300/90 bg-base-100/95 dark:bg-base-900/95 p-1 backdrop-blur-xl shadow-2xl space-y-0.5`}
                        role="listbox"
                    >
                        {STATUS_OPTIONS.map((opt) => {
                            const isSelected = currentStatus === opt.value
                            return (
                                <li key={opt.value}>
                                    <button
                                        type="button"
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            e.preventDefault()
                                            onChange(opt.value)
                                            setIsOpen(false)
                                        }}
                                        className={`flex w-full items-center justify-between gap-2 rounded-lg px-2.5 py-1.5 text-left text-[11px] font-semibold transition-colors ${
                                            isSelected
                                                ? 'bg-base-200/90 dark:bg-base-800 text-base-content font-bold'
                                                : 'text-base-content/80 hover:bg-base-200/60 dark:hover:bg-base-800/60 hover:text-base-content'
                                        }`}
                                        role="option"
                                        aria-selected={isSelected}
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className={`h-2 w-2 rounded-full ${opt.dotColor}`} />
                                            <span>{opt.label}</span>
                                        </div>
                                        {isSelected && <FiCheck className="h-3 w-3 text-primary shrink-0" />}
                                    </button>
                                </li>
                            )
                        })}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    )
}

const WatchList = () => {
    const navigate = useNavigate()
    const {
        watchlist,
        removeFromWatchlist,
        updateItemStatus,
        clearWatchlist,
        bulkRemove,
        bulkUpdateStatus,
        importWatchlist,
        addToWatchlist,
    } = useWatchlist()

    // View & Filter States
    const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
    const [searchQuery, setSearchQuery] = useState('')
    const [typeFilter, setTypeFilter] = useState('all') // 'all' | 'Movie' | 'Series' | 'Animation' | 'premium'
    const [statusFilter, setStatusFilter] = useState('all') // 'all' | 'plan_to_watch' | 'watching' | 'completed'
    const [genreFilter, setGenreFilter] = useState('all')
    const [sortBy, setSortBy] = useState('date_desc') // 'date_desc' | 'date_asc' | 'rating_desc' | 'year_desc' | 'title_asc'

    // Multi-Select Bulk State
    const [selectionMode, setSelectionMode] = useState(false)
    const [selectedIds, setSelectedIds] = useState(new Set())

    // Modals
    const [activeTrailerUrl, setActiveTrailerUrl] = useState(null)
    const [activeTrailerTitle, setActiveTrailerTitle] = useState('')
    const [rouletteModalOpen, setRouletteModalOpen] = useState(false)
    const [rouletteItem, setRouletteItem] = useState(null)
    const [isSpinning, setIsSpinning] = useState(false)
    const [clearConfirmOpen, setClearConfirmOpen] = useState(false)
    const [exportModalOpen, setExportModalOpen] = useState(false)
    const [copiedShare, setCopiedShare] = useState(false)

    // Recommended Discovery Titles for Empty State
    const [discoverItems, setDiscoverItems] = useState([])

    useEffect(() => {
        // Fetch recommendations for discovery
        Promise.all([
            fetch('/popularMovies.json').then((r) => r.json()),
            fetch('/popularSeries.json').then((r) => r.json()),
            fetch('/popularAnimation.json').then((r) => r.json()),
        ])
            .then(([movies, series, animation]) => {
                const combined = [...movies.slice(0, 4), ...series.slice(0, 4), ...animation.slice(0, 4)]
                setDiscoverItems(combined)
            })
            .catch(() => setDiscoverItems([]))
    }, [])

    // Extract all unique genres present in the user's watchlist
    const availableGenres = useMemo(() => {
        const set = new Set()
        watchlist.forEach((item) => {
            if (Array.isArray(item.genres)) {
                item.genres.forEach((g) => set.add(g))
            }
        })
        return Array.from(set).sort()
    }, [watchlist])

    // Calculate dynamic stats
    const stats = useMemo(() => {
        const total = watchlist.length
        const movies = watchlist.filter((i) => (i.type || '').toLowerCase() === 'movie').length
        const series = watchlist.filter((i) => (i.type || '').toLowerCase() === 'series').length
        const animation = watchlist.filter(
            (i) => (i.type || '').toLowerCase() === 'animation' || i.genres?.includes('Animation')
        ).length
        const completed = watchlist.filter((i) => i.status === 'completed').length
        const watching = watchlist.filter((i) => i.status === 'watching').length
        const planToWatch = watchlist.filter((i) => !i.status || i.status === 'plan_to_watch').length

        // Calculate average rating
        const ratedItems = watchlist.filter((i) => i.rating)
        const avgRating =
            ratedItems.length > 0
                ? (ratedItems.reduce((acc, i) => acc + Number(i.rating), 0) / ratedItems.length).toFixed(1)
                : '0.0'

        // Estimate total runtime (approximation)
        let totalMinutes = 0
        watchlist.forEach((i) => {
            if (typeof i.runtime === 'string') {
                const hourMatch = i.runtime.match(/(\d+)h/)
                const minMatch = i.runtime.match(/(\d+)m/)
                const epMatch = i.runtime.match(/(\d+)\s*Ep/)
                if (hourMatch) totalMinutes += parseInt(hourMatch[1], 10) * 60
                if (minMatch) totalMinutes += parseInt(minMatch[1], 10)
                if (epMatch) totalMinutes += parseInt(epMatch[1], 10) * 45 // avg 45 mins per episode
            }
        })
        const estHours = Math.floor(totalMinutes / 60)

        return {
            total,
            movies,
            series,
            animation,
            completed,
            watching,
            planToWatch,
            avgRating,
            estHours,
        }
    }, [watchlist])

    // Filter and Sort Items
    const filteredWatchlist = useMemo(() => {
        return watchlist
            .filter((item) => {
                // Search query match
                if (searchQuery.trim()) {
                    const q = searchQuery.toLowerCase()
                    const titleMatch = item.title?.toLowerCase().includes(q)
                    const directorMatch = item.director?.toLowerCase().includes(q)
                    const genreMatch = item.genres?.some((g) => g.toLowerCase().includes(q))
                    const castMatch = item.cast?.some((c) => c.toLowerCase().includes(q))
                    if (!titleMatch && !directorMatch && !genreMatch && !castMatch) return false
                }

                // Type filter
                if (typeFilter === 'Movie' && (item.type || '').toLowerCase() !== 'movie') return false
                if (typeFilter === 'Series' && (item.type || '').toLowerCase() !== 'series') return false
                if (
                    typeFilter === 'Animation' &&
                    (item.type || '').toLowerCase() !== 'animation' &&
                    !item.genres?.includes('Animation')
                )
                    return false
                if (typeFilter === 'premium' && !item.isPremium) return false

                // Status filter
                if (statusFilter !== 'all') {
                    const currentStatus = item.status || 'plan_to_watch'
                    if (currentStatus !== statusFilter) return false
                }

                // Genre filter
                if (genreFilter !== 'all') {
                    if (!item.genres?.includes(genreFilter)) return false
                }

                return true
            })
            .sort((a, b) => {
                if (sortBy === 'date_desc') {
                    return new Date(b.addedAt || 0) - new Date(a.addedAt || 0)
                }
                if (sortBy === 'date_asc') {
                    return new Date(a.addedAt || 0) - new Date(b.addedAt || 0)
                }
                if (sortBy === 'rating_desc') {
                    return (b.rating || 0) - (a.rating || 0)
                }
                if (sortBy === 'year_desc') {
                    return (b.year || 0) - (a.year || 0)
                }
                if (sortBy === 'title_asc') {
                    return (a.title || '').localeCompare(b.title || '')
                }
                return 0
            })
    }, [watchlist, searchQuery, typeFilter, statusFilter, genreFilter, sortBy])

    // Multi-select handlers
    const toggleSelectItem = (id) => {
        setSelectedIds((prev) => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }
            return next
        })
    }

    const handleSelectAll = () => {
        if (selectedIds.size === filteredWatchlist.length) {
            setSelectedIds(new Set())
        } else {
            setSelectedIds(new Set(filteredWatchlist.map((i) => i.id || i._id)))
        }
    }

    const handleBulkDelete = () => {
        bulkRemove(Array.from(selectedIds))
        setSelectedIds(new Set())
        setSelectionMode(false)
    }

    const handleBulkStatus = (status) => {
        bulkUpdateStatus(Array.from(selectedIds), status)
        setSelectedIds(new Set())
    }

    // Random Pick Roulette Trigger
    const handlePickRandom = () => {
        if (filteredWatchlist.length === 0) return
        setRouletteModalOpen(true)
        setIsSpinning(true)

        let counter = 0
        const totalSpins = 20
        const interval = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * filteredWatchlist.length)
            setRouletteItem(filteredWatchlist[randomIndex])
            counter++

            if (counter >= totalSpins) {
                clearInterval(interval)
                setIsSpinning(false)
            }
        }, 100)
    }

    // Export watchlist as JSON
    const handleExportJSON = () => {
        const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(watchlist, null, 2))
        const downloadAnchor = document.createElement('a')
        downloadAnchor.setAttribute('href', dataStr)
        downloadAnchor.setAttribute('download', `ICSN_Watchlist_${new Date().toISOString().slice(0, 10)}.json`)
        document.body.appendChild(downloadAnchor)
        downloadAnchor.click()
        downloadAnchor.remove()
    }

    // Copy formatted text summary to clipboard
    const handleCopySummary = () => {
        const text = watchlist
            .map(
                (item, index) =>
                    `${index + 1}. ${item.title} (${item.year}) - ${item.type || 'Media'} [★ ${item.rating || 'N/A'}] - Status: ${STATUS_CONFIG[item.status || 'plan_to_watch']?.label}`
            )
            .join('\n')
        navigator.clipboard.writeText(`🍿 My ICSN Watchlist (${watchlist.length} titles):\n\n` + text)
        setCopiedShare(true)
        setTimeout(() => setCopiedShare(false), 2500)
    }

    // Import JSON file
    const handleFileUpload = (e) => {
        const file = e.target.files?.[0]
        if (!file) return
        const reader = new FileReader()
        reader.onload = (event) => {
            try {
                const parsed = JSON.parse(event.target?.result)
                if (Array.isArray(parsed)) {
                    importWatchlist(parsed)
                    setExportModalOpen(false)
                } else {
                    alert('Invalid JSON structure. Expected an array of media objects.')
                }
            } catch (err) {
                alert('Failed to parse JSON file.')
            }
        }
        reader.readAsText(file)
    }

    const openTrailer = (url, title) => {
        if (!url) return
        setActiveTrailerUrl(url)
        setActiveTrailerTitle(title)
    }

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen bg-base-100 pb-24 text-base-content"
        >
            {/* Cinematic Hero Section */}
            <section className="relative overflow-hidden border-b border-base-300/80 bg-gradient-to-b from-base-200/90 via-base-100 to-base-100 pt-10 pb-8 sm:pt-14 sm:pb-12">
                {/* Ambient Glow Orbs */}
                <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
                <div className="pointer-events-none absolute top-10 right-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
                    {/* Header Row */}
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="space-y-1.5">
                            <div className="flex items-center gap-2.5">
                                <span className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-tr from-primary to-accent text-primary-content shadow-lg shadow-primary/25">
                                    <FiBookmark className="h-5 w-5 fill-current" />
                                </span>
                                <div>
                                    <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary">
                                        Personal Library
                                    </span>
                                    <h1 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-base-content">
                                        My Cinema Watchlist
                                    </h1>
                                </div>
                            </div>
                            <p className="text-xs sm:text-sm text-base-content/70 max-w-xl">
                                Curate, track, and organize your favorite blockbuster movies, binge-worthy series, and animations.
                            </p>
                        </div>

                        {/* Top Quick Actions */}
                        <div className="flex flex-wrap items-center gap-2">
                            {watchlist.length > 0 && (
                                <>
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        type="button"
                                        onClick={handlePickRandom}
                                        className="btn btn-primary btn-sm gap-2 font-bold shadow-md shadow-primary/20"
                                        title="Pick a random title to watch"
                                    >
                                        <FiShuffle className="h-4 w-4" />
                                        <span>Pick for Me</span>
                                    </motion.button>

                                    <button
                                        type="button"
                                        onClick={() => setSelectionMode((prev) => !prev)}
                                        className={`btn btn-sm gap-1.5 font-semibold ${selectionMode
                                            ? 'btn-accent text-accent-content'
                                            : 'btn-outline border-base-300 hover:bg-base-200'
                                            }`}
                                    >
                                        <FiCheckCircle className="h-4 w-4" />
                                        <span>{selectionMode ? 'Done' : 'Select'}</span>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setExportModalOpen(true)}
                                        className="btn btn-ghost btn-sm btn-square text-base-content/70 hover:text-base-content"
                                        title="Share & Export Watchlist"
                                        aria-label="Share and export watchlist"
                                    >
                                        <FiShare2 className="h-4 w-4" />
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setClearConfirmOpen(true)}
                                        className="btn btn-ghost btn-sm btn-square text-error/70 hover:bg-error/10 hover:text-error"
                                        title="Clear Watchlist"
                                        aria-label="Clear watchlist"
                                    >
                                        <FiTrash2 className="h-4 w-4" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Stats Metric Cards Bar */}
                    {watchlist.length > 0 && (
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6 pt-2">
                            <div className="rounded-2xl border border-base-300/80 bg-base-200/50 p-3.5 backdrop-blur-md">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/60">
                                    Total Titles
                                </span>
                                <p className="font-display text-xl font-extrabold text-base-content mt-0.5">
                                    {stats.total}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-base-300/80 bg-base-200/50 p-3.5 backdrop-blur-md">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/60 truncate block" title="Movies / Series / Animations">
                                    Movies / Series / Anime
                                </span>
                                <p className="font-display text-xl font-extrabold text-base-content mt-0.5">
                                    {stats.movies} <span className="text-xs font-normal text-base-content/50">/</span> {stats.series}{' '}
                                    <span className="text-xs font-normal text-base-content/50">/</span> {stats.animation}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-base-300/80 bg-base-200/50 p-3.5 backdrop-blur-md">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/60">
                                    Completed
                                </span>
                                <p className="font-display text-xl font-extrabold text-emerald-400 mt-0.5">
                                    {stats.completed}{' '}
                                    <span className="text-xs font-normal text-base-content/50">
                                        ({Math.round((stats.completed / (stats.total || 1)) * 100)}%)
                                    </span>
                                </p>
                            </div>

                            <div className="rounded-2xl border border-base-300/80 bg-base-200/50 p-3.5 backdrop-blur-md">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/60">
                                    In Progress
                                </span>
                                <p className="font-display text-xl font-extrabold text-amber-400 mt-0.5">
                                    {stats.watching}
                                </p>
                            </div>

                            <div className="rounded-2xl border border-base-300/80 bg-base-200/50 p-3.5 backdrop-blur-md">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/60">
                                    Avg Rating
                                </span>
                                <div className="flex items-center gap-1 mt-0.5 font-display text-xl font-extrabold text-amber-400">
                                    <FiStar className="h-4 w-4 fill-amber-400" />
                                    <span>{stats.avgRating}</span>
                                </div>
                            </div>

                            <div className="rounded-2xl border border-base-300/80 bg-base-200/50 p-3.5 backdrop-blur-md">
                                <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/60">
                                    Est. Watch Time
                                </span>
                                <p className="font-display text-xl font-extrabold text-primary mt-0.5">
                                    ~{stats.estHours} <span className="text-xs font-normal text-base-content/60">hrs</span>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {/* Main Content Area */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
                {watchlist.length > 0 ? (
                    <>
                        {/* Interactive Filter & Controls Toolbar */}
                        <div className="rounded-3xl border border-base-300/80 bg-base-200/40 p-4 sm:p-5 backdrop-blur-md shadow-xs space-y-4">
                            {/* Row 1: Search, Sort & View Mode */}
                            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                                {/* Search Bar */}
                                <div className="relative flex-1 max-w-md">
                                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 h-4 w-4" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search saved titles, cast, genre..."
                                        className="h-10 w-full rounded-xl border border-base-300 bg-base-100/80 pl-9 pr-9 text-xs font-medium focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                    {searchQuery && (
                                        <button
                                            type="button"
                                            onClick={() => setSearchQuery('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                                            aria-label="Clear search"
                                        >
                                            <FiX className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Controls: Sort & View Toggle */}
                                <div className="flex items-center gap-2.5 self-end sm:self-auto">
                                    {/* Sort Dropdown */}
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="select select-bordered select-sm rounded-xl text-xs bg-base-100 font-semibold border-base-300"
                                        aria-label="Sort watchlist"
                                    >
                                        <option value="date_desc">Recently Added</option>
                                        <option value="date_asc">Oldest Added</option>
                                        <option value="rating_desc">Highest Rated</option>
                                        <option value="year_desc">Release Year (Newest)</option>
                                        <option value="title_asc">Title (A - Z)</option>
                                    </select>

                                    {/* View Toggle */}
                                    <div className="join rounded-xl border border-base-300 bg-base-100 p-0.5">
                                        <button
                                            type="button"
                                            onClick={() => setViewMode('grid')}
                                            className={`btn btn-xs join-item border-0 font-bold ${viewMode === 'grid'
                                                ? 'bg-primary text-primary-content shadow-xs'
                                                : 'btn-ghost text-base-content/70'
                                                }`}
                                            title="Grid View"
                                            aria-label="Grid View"
                                        >
                                            <FiGrid className="h-3.5 w-3.5" />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setViewMode('list')}
                                            className={`btn btn-xs join-item border-0 font-bold ${viewMode === 'list'
                                                ? 'bg-primary text-primary-content shadow-xs'
                                                : 'btn-ghost text-base-content/70'
                                                }`}
                                            title="List View"
                                            aria-label="List View"
                                        >
                                            <FiList className="h-3.5 w-3.5" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Row 2: Type Tabs & Status Pills */}
                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-base-300/60 pt-3">
                                {/* Type Filters */}
                                <div className="flex flex-wrap items-center gap-1.5">
                                    {[
                                        { id: 'all', label: 'All Media', icon: FiFilm },
                                        { id: 'Movie', label: 'Movies', icon: FiFilm },
                                        { id: 'Series', label: 'Series', icon: FiTv },
                                        { id: 'Animation', label: 'Animation', icon: FiSmile },
                                        { id: 'premium', label: 'VIP Premium', icon: FiAward },
                                    ].map(({ id, label, icon: Icon }) => (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={() => setTypeFilter(id)}
                                            className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${typeFilter === id
                                                ? 'bg-primary text-primary-content shadow-sm shadow-primary/25'
                                                : 'bg-base-100/70 text-base-content/70 hover:bg-base-100 hover:text-base-content border border-base-300/70'
                                                }`}
                                        >
                                            <Icon className="h-3.5 w-3.5" />
                                            <span>{label}</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Status Filters */}
                                <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50 mr-1 hidden sm:inline">
                                        Status:
                                    </span>
                                    {[
                                        { id: 'all', label: 'All' },
                                        { id: 'plan_to_watch', label: 'Plan to Watch' },
                                        { id: 'watching', label: 'Watching' },
                                        { id: 'completed', label: 'Completed' },
                                    ].map(({ id, label }) => (
                                        <button
                                            key={id}
                                            type="button"
                                            onClick={() => setStatusFilter(id)}
                                            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${statusFilter === id
                                                ? 'bg-base-content text-base-100 font-bold shadow-xs'
                                                : 'text-base-content/60 hover:bg-base-300/60'
                                                }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Row 3: Genre Filter Chips (if any available) */}
                            {availableGenres.length > 0 && (
                                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                    <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/50 mr-1">
                                        Genres:
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() => setGenreFilter('all')}
                                        className={`rounded-md px-2 py-0.5 text-[11px] font-semibold transition ${genreFilter === 'all'
                                            ? 'bg-secondary text-secondary-content'
                                            : 'bg-base-100 text-base-content/70 hover:bg-base-300'
                                            }`}
                                    >
                                        All Genres
                                    </button>
                                    {availableGenres.map((genre) => (
                                        <button
                                            key={genre}
                                            type="button"
                                            onClick={() => setGenreFilter(genre)}
                                            className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-semibold transition ${genreFilter === genre
                                                ? 'bg-secondary text-secondary-content'
                                                : 'bg-base-100 text-base-content/70 hover:bg-base-300'
                                                }`}
                                        >
                                            <GenreIcon name={genre} className="h-3 w-3" />
                                            <span>{genre}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Bulk Action Bar when Selection Mode is Active */}
                        <AnimatePresence>
                            {selectionMode && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-accent/40 bg-accent/10 px-4 py-3 backdrop-blur-md"
                                >
                                    <div className="flex items-center gap-3">
                                        <button
                                            type="button"
                                            onClick={handleSelectAll}
                                            className="btn btn-xs btn-outline border-accent text-accent hover:bg-accent hover:text-accent-content font-bold"
                                        >
                                            {selectedIds.size === filteredWatchlist.length
                                                ? 'Deselect All'
                                                : 'Select All'}
                                        </button>
                                        <span className="text-xs font-bold text-accent">
                                            {selectedIds.size} of {filteredWatchlist.length} selected
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-[11px] font-bold text-base-content/60">Mark as:</span>
                                        <button
                                            type="button"
                                            disabled={selectedIds.size === 0}
                                            onClick={() => handleBulkStatus('plan_to_watch')}
                                            className="btn btn-xs btn-outline border-blue-500/40 text-blue-400 hover:bg-blue-500 hover:text-white"
                                        >
                                            Plan
                                        </button>
                                        <button
                                            type="button"
                                            disabled={selectedIds.size === 0}
                                            onClick={() => handleBulkStatus('watching')}
                                            className="btn btn-xs btn-outline border-amber-500/40 text-amber-400 hover:bg-amber-500 hover:text-white"
                                        >
                                            Watching
                                        </button>
                                        <button
                                            type="button"
                                            disabled={selectedIds.size === 0}
                                            onClick={() => handleBulkStatus('completed')}
                                            className="btn btn-xs btn-outline border-emerald-500/40 text-emerald-400 hover:bg-emerald-500 hover:text-white"
                                        >
                                            Completed
                                        </button>
                                        <button
                                            type="button"
                                            disabled={selectedIds.size === 0}
                                            onClick={handleBulkDelete}
                                            className="btn btn-xs btn-error text-error-content font-bold ml-2"
                                        >
                                            <FiTrash2 className="h-3.5 w-3.5" />
                                            <span>Delete ({selectedIds.size})</span>
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Watchlist Items Display (Grid vs List) */}
                        {filteredWatchlist.length > 0 ? (
                            viewMode === 'grid' ? (
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="show"
                                    className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6"
                                >
                                    {filteredWatchlist.map((item) => {
                                        const itemId = item.id || item._id
                                        const isSelected = selectedIds.has(itemId)
                                        const statusObj = STATUS_CONFIG[item.status || 'plan_to_watch']

                                        return (
                                            <motion.article
                                                key={itemId}
                                                variants={itemVariants}
                                                layout
                                                className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-base-200/60 backdrop-blur-sm shadow-xs transition-all duration-300 ${isSelected
                                                    ? 'border-accent ring-2 ring-accent shadow-lg shadow-accent/20'
                                                    : item.isPremium
                                                        ? 'border-amber-500/40 hover:border-amber-400'
                                                        : 'border-base-300/80 hover:border-primary/50'
                                                    }`}
                                            >
                                                {/* Card Media Poster */}
                                                <div className="relative aspect-[2/3] w-full overflow-hidden bg-base-300">
                                                    <img
                                                        src={item.poster}
                                                        alt={item.title}
                                                        loading="lazy"
                                                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
                                                        onError={(e) => {
                                                            e.currentTarget.src =
                                                                'https://placehold.co/600x900/111827/ffffff?text=ICSN+Cinema'
                                                        }}
                                                    />

                                                    {/* Vignette Overlay */}
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/20" />

                                                    {/* Top Bar Badges */}
                                                    <div className="absolute left-2.5 top-2.5 right-2.5 flex items-center justify-between">
                                                        {selectionMode ? (
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={() => toggleSelectItem(itemId)}
                                                                className="checkbox checkbox-accent checkbox-sm"
                                                            />
                                                        ) : (
                                                            <span className="rounded-md bg-black/60 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-md border border-white/10">
                                                                {item.type || 'Media'}
                                                            </span>
                                                        )}

                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation()
                                                                removeFromWatchlist(itemId)
                                                            }}
                                                            className="grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white/80 backdrop-blur-md transition hover:bg-error hover:text-white"
                                                            title="Remove from watchlist"
                                                            aria-label="Remove item"
                                                        >
                                                            <FiTrash2 className="h-3 w-3" />
                                                        </button>
                                                    </div>

                                                    {/* Center Play Trailer Button */}
                                                    {item.trailerUrl && (
                                                        <button
                                                            type="button"
                                                            onClick={() => openTrailer(item.trailerUrl, item.title)}
                                                            className="absolute left-1/2 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-primary-content opacity-0 shadow-lg shadow-primary/40 transition duration-300 group-hover:opacity-100"
                                                            title="Play Trailer"
                                                            aria-label="Play Trailer"
                                                        >
                                                            <FiPlay className="ml-0.5 h-4 w-4 fill-current" />
                                                        </button>
                                                    )}

                                                    {/* Bottom Rating & Year */}
                                                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-xs font-bold text-white">
                                                        <span className="rounded bg-black/60 px-1.5 py-0.5 text-[10px] backdrop-blur-xs">
                                                            {item.year}
                                                        </span>
                                                        <span className="flex items-center gap-1 rounded bg-black/80 px-1.5 py-0.5 text-amber-400 text-[10px] border border-amber-400/30">
                                                            <FiStar className="h-2.5 w-2.5 fill-amber-400" />
                                                            {item.rating ? Number(item.rating).toFixed(1) : 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Content & Quick Status Selector */}
                                                <div className="flex flex-1 flex-col justify-between p-3 space-y-2.5">
                                                    <div>
                                                        <Link
                                                            to={`/details/${itemId}`}
                                                            className="line-clamp-1 font-display text-xs sm:text-sm font-bold text-base-content hover:text-primary transition-colors"
                                                            title={item.title}
                                                        >
                                                            {item.title}
                                                        </Link>
                                                        {item.genres && item.genres.length > 0 && (
                                                            <p className="text-[10px] text-base-content/60 truncate mt-0.5">
                                                                {item.genres.slice(0, 2).join(', ')}
                                                            </p>
                                                        )}
                                                    </div>

                                                    {/* Status Dropdown Pill */}
                                                    <div className="pt-1">
                                                        <WatchStatusDropdown
                                                            status={item.status}
                                                            onChange={(val) => updateItemStatus(itemId, val)}
                                                            align="top"
                                                            className="w-full"
                                                        />
                                                    </div>
                                                </div>
                                            </motion.article>
                                        )
                                    })}
                                </motion.div>
                            ) : (
                                /* Compact Detailed List View */
                                <motion.div
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="show"
                                    className="rounded-3xl border border-base-300/80 bg-base-200/40 backdrop-blur-md"
                                >
                                    <div className="divide-y divide-base-300/60">
                                        {filteredWatchlist.map((item) => {
                                            const itemId = item.id || item._id
                                            const isSelected = selectedIds.has(itemId)
                                            const statusObj = STATUS_CONFIG[item.status || 'plan_to_watch']

                                            return (
                                                <motion.div
                                                    key={itemId}
                                                    variants={itemVariants}
                                                    layout
                                                    className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 transition-colors hover:bg-base-200/70 ${isSelected ? 'bg-accent/10' : ''
                                                        }`}
                                                >
                                                    <div className="flex items-center gap-3.5 min-w-0">
                                                        {selectionMode && (
                                                            <input
                                                                type="checkbox"
                                                                checked={isSelected}
                                                                onChange={() => toggleSelectItem(itemId)}
                                                                className="checkbox checkbox-accent checkbox-sm"
                                                            />
                                                        )}

                                                        {/* Thumbnail */}
                                                        <div className="relative h-16 w-11 shrink-0 overflow-hidden rounded-lg bg-base-300">
                                                            <img
                                                                src={item.poster}
                                                                alt={item.title}
                                                                className="h-full w-full object-cover"
                                                            />
                                                        </div>

                                                        {/* Info */}
                                                        <div className="min-w-0 space-y-1">
                                                            <div className="flex items-center gap-2">
                                                                <Link
                                                                    to={`/details/${itemId}`}
                                                                    className="font-display text-sm font-bold text-base-content hover:text-primary transition-colors truncate"
                                                                >
                                                                    {item.title}
                                                                </Link>
                                                                {item.isPremium && (
                                                                    <span className="rounded bg-amber-500/20 px-1.5 py-0.2 text-[9px] font-extrabold text-amber-400">
                                                                        VIP
                                                                    </span>
                                                                )}
                                                            </div>

                                                            <div className="flex flex-wrap items-center gap-2 text-[11px] text-base-content/60 font-medium">
                                                                <span>{item.type || 'Media'}</span>
                                                                <span>•</span>
                                                                <span>{item.year}</span>
                                                                {item.runtime && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <span>{item.runtime}</span>
                                                                    </>
                                                                )}
                                                                {item.genres && (
                                                                    <>
                                                                        <span>•</span>
                                                                        <span className="text-primary">
                                                                            {item.genres.slice(0, 2).join(', ')}
                                                                        </span>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Actions & Status Pill */}
                                                    <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-base-300/40">
                                                        <span className="flex items-center gap-1 font-bold text-xs text-amber-400">
                                                            <FiStar className="h-3.5 w-3.5 fill-amber-400" />
                                                            {item.rating ? Number(item.rating).toFixed(1) : 'N/A'}
                                                        </span>

                                                        <WatchStatusDropdown
                                                            status={item.status}
                                                            onChange={(val) => updateItemStatus(itemId, val)}
                                                            align="top"
                                                            className="w-36"
                                                        />

                                                        {item.trailerUrl && (
                                                            <button
                                                                type="button"
                                                                onClick={() => openTrailer(item.trailerUrl, item.title)}
                                                                className="btn btn-ghost btn-circle btn-xs text-base-content/70 hover:text-primary"
                                                                title="Play Trailer"
                                                                aria-label="Play Trailer"
                                                            >
                                                                <FiPlay className="h-3.5 w-3.5" />
                                                            </button>
                                                        )}

                                                        <Link
                                                            to={`/details/${itemId}`}
                                                            className="btn btn-ghost btn-circle btn-xs text-base-content/70 hover:text-base-content"
                                                            title="View Details"
                                                            aria-label="View Details"
                                                        >
                                                            <FiEye className="h-3.5 w-3.5" />
                                                        </Link>

                                                        <button
                                                            type="button"
                                                            onClick={() => removeFromWatchlist(itemId)}
                                                            className="btn btn-ghost btn-circle btn-xs text-error/70 hover:bg-error/10 hover:text-error"
                                                            title="Remove"
                                                            aria-label="Remove item"
                                                        >
                                                            <FiTrash2 className="h-3.5 w-3.5" />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )
                                        })}
                                    </div>
                                </motion.div>
                            )
                        ) : (
                            /* No search/filter match */
                            <div className="rounded-3xl border border-base-300/80 bg-base-200/30 p-12 text-center space-y-3">
                                <FiSearch className="mx-auto h-10 w-10 text-base-content/40" />
                                <h3 className="font-display text-lg font-bold text-base-content">
                                    No Matching Titles Found
                                </h3>
                                <p className="text-xs text-base-content/60 max-w-sm mx-auto">
                                    Try adjusting your search query, type tab, or active status filter.
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery('')
                                        setTypeFilter('all')
                                        setStatusFilter('all')
                                        setGenreFilter('all')
                                    }}
                                    className="btn btn-outline btn-sm font-bold gap-2 mt-2"
                                >
                                    <FiRefreshCw className="h-3.5 w-3.5" />
                                    <span>Reset Filters</span>
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    /* High-Production Empty State with Instant Curated Recommendations */
                    <div className="space-y-12">
                        <div className="mx-auto flex max-w-lg flex-col items-center justify-center rounded-3xl border border-base-300/80 bg-base-200/40 p-8 sm:p-12 text-center backdrop-blur-md shadow-xs space-y-4">
                            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-tr from-primary/20 to-accent/20 text-primary border border-primary/30 shadow-md">
                                <FiBookmark className="h-8 w-8 stroke-[2.2]" />
                            </div>
                            <div className="space-y-1">
                                <h2 className="font-display text-2xl font-bold tracking-tight text-base-content">
                                    Your Watchlist is Empty
                                </h2>
                                <p className="text-xs sm:text-sm text-base-content/70">
                                    Explore trending blockbusters, movies, and TV series, and tap the bookmark icon to save titles for later.
                                </p>
                            </div>

                            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                                <Link to="/browse" className="btn btn-primary btn-sm gap-2 font-bold shadow-md shadow-primary/20">
                                    <FiSliders className="h-4 w-4" />
                                    <span>Explore All Media</span>
                                </Link>
                                <Link to="/movies" className="btn btn-outline btn-sm font-semibold">
                                    Browse Movies
                                </Link>
                            </div>
                        </div>

                        {/* Quick Start Curated Discovery Carousel / Grid */}
                        {discoverItems.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="font-display text-lg font-bold text-base-content">
                                            Quick-Start Recommendations
                                        </h3>
                                        <p className="text-xs text-base-content/60">
                                            Click any title to instantly add it to your watchlist.
                                        </p>
                                    </div>
                                    <Link
                                        to="/trending"
                                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                    >
                                        <span>View Trending</span>
                                        <FiArrowRight className="h-3.5 w-3.5" />
                                    </Link>
                                </div>

                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                                    {discoverItems.map((item) => (
                                        <div
                                            key={item.id || item._id}
                                            className="group relative flex flex-col overflow-hidden rounded-2xl border border-base-300/80 bg-base-200/50 p-2 transition hover:border-primary/50 hover:shadow-lg"
                                        >
                                            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-base-300">
                                                <img
                                                    src={item.poster}
                                                    alt={item.title}
                                                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                                <span className="absolute bottom-2 left-2 rounded bg-black/60 px-1.5 py-0.5 text-[9px] font-bold text-white">
                                                    {item.year}
                                                </span>
                                            </div>
                                            <div className="pt-2 space-y-1">
                                                <p className="font-display text-xs font-bold truncate text-base-content">
                                                    {item.title}
                                                </p>
                                                <button
                                                    type="button"
                                                    onClick={() => addToWatchlist(item)}
                                                    className="btn btn-primary btn-xs w-full gap-1 font-bold shadow-xs"
                                                >
                                                    <FiPlus className="h-3 w-3" />
                                                    <span>Add Title</span>
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Recently Viewed Media Ribbon */}
            <RecentlyViewedRibbon maxDisplay={6} />

            {/* Random Roulette Picker Modal */}
            <AnimatePresence>
                {rouletteModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => !isSpinning && setRouletteModalOpen(false)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
                    >
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-md overflow-hidden rounded-3xl border border-primary/40 bg-base-100 p-6 shadow-2xl text-center space-y-5"
                        >
                            {!isSpinning && (
                                <button
                                    type="button"
                                    onClick={() => setRouletteModalOpen(false)}
                                    className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-base-200 text-base-content/70 hover:text-base-content"
                                    aria-label="Close modal"
                                >
                                    <FiX className="h-4 w-4" />
                                </button>
                            )}

                            <div className="space-y-1">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/30 px-3 py-1 text-[11px] font-extrabold uppercase text-primary">
                                    <FiShuffle className="h-3.5 w-3.5" />
                                    <span>Cinema Roulette</span>
                                </span>
                                <h3 className="font-display text-xl font-black text-base-content">
                                    {isSpinning ? 'Selecting What to Watch...' : 'Tonight’s Featured Pick!'}
                                </h3>
                            </div>

                            {rouletteItem && (
                                <div className="space-y-4">
                                    <div className="relative mx-auto aspect-[2/3] w-44 overflow-hidden rounded-2xl border-2 border-primary/50 shadow-2xl">
                                        <img
                                            src={rouletteItem.poster}
                                            alt={rouletteItem.title}
                                            className={`h-full w-full object-cover transition duration-300 ${isSpinning ? 'blur-xs scale-105' : 'scale-100'
                                                }`}
                                        />
                                        <div className="absolute top-2 right-2 rounded-md bg-black/80 px-2 py-0.5 text-xs font-bold text-amber-400">
                                            ★ {rouletteItem.rating || '8.5'}
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <h4 className="font-display text-lg font-bold text-base-content">
                                            {rouletteItem.title}
                                        </h4>
                                        <p className="text-xs text-base-content/60">
                                            {rouletteItem.type} • {rouletteItem.year} • {rouletteItem.runtime || '2h 10m'}
                                        </p>
                                        {rouletteItem.description && !isSpinning && (
                                            <p className="text-xs text-base-content/75 line-clamp-2 max-w-xs mx-auto pt-1">
                                                {rouletteItem.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {!isSpinning && rouletteItem && (
                                <div className="flex flex-col gap-2 pt-2">
                                    <Link
                                        to={`/details/${rouletteItem.id || rouletteItem._id}`}
                                        onClick={() => setRouletteModalOpen(false)}
                                        className="btn btn-primary btn-sm font-bold shadow-md shadow-primary/25"
                                    >
                                        <span>View Title Details</span>
                                        <FiArrowRight className="h-4 w-4" />
                                    </Link>

                                    {rouletteItem.trailerUrl && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setRouletteModalOpen(false)
                                                openTrailer(rouletteItem.trailerUrl, rouletteItem.title)
                                            }}
                                            className="btn btn-outline btn-sm font-semibold gap-2"
                                        >
                                            <FiPlay className="h-3.5 w-3.5 fill-current" />
                                            <span>Watch Official Trailer</span>
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={handlePickRandom}
                                        className="btn btn-ghost btn-xs text-base-content/60 hover:text-base-content"
                                    >
                                        Spin Again
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Clear All Confirmation Dialog */}
            <AnimatePresence>
                {clearConfirmOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setClearConfirmOpen(false)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
                    >
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-sm rounded-3xl border border-error/40 bg-base-100 p-6 shadow-2xl text-center space-y-4"
                        >
                            <div className="grid h-12 w-12 mx-auto place-items-center rounded-2xl bg-error/15 text-error">
                                <FiAlertCircle className="h-6 w-6" />
                            </div>
                            <div className="space-y-1">
                                <h3 className="font-display text-lg font-bold text-base-content">
                                    Clear Entire Watchlist?
                                </h3>
                                <p className="text-xs text-base-content/70">
                                    Are you sure you want to remove all {watchlist.length} saved titles? This action cannot be undone.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setClearConfirmOpen(false)}
                                    className="btn btn-outline btn-sm"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        clearWatchlist()
                                        setClearConfirmOpen(false)
                                    }}
                                    className="btn btn-error btn-sm text-error-content font-bold"
                                >
                                    Yes, Clear All
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Share / Export / Import Modal */}
            <AnimatePresence>
                {exportModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setExportModalOpen(false)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
                    >
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-md rounded-3xl border border-base-300 bg-base-100 p-6 shadow-2xl space-y-5"
                        >
                            <button
                                type="button"
                                onClick={() => setExportModalOpen(false)}
                                className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-base-200 text-base-content/70 hover:text-base-content"
                                aria-label="Close modal"
                            >
                                <FiX className="h-4 w-4" />
                            </button>

                            <div className="space-y-1">
                                <h3 className="font-display text-lg font-bold text-base-content">
                                    Share & Manage Watchlist
                                </h3>
                                <p className="text-xs text-base-content/70">
                                    Export your saved movie list or share your recommendations with friends.
                                </p>
                            </div>

                            <div className="space-y-2.5">
                                <button
                                    type="button"
                                    onClick={handleCopySummary}
                                    className="flex w-full items-center justify-between rounded-xl border border-base-300 bg-base-200/50 p-3.5 text-xs font-semibold hover:border-primary transition"
                                >
                                    <div className="flex items-center gap-3 text-left">
                                        <FiShare2 className="h-4 w-4 text-primary shrink-0" />
                                        <div>
                                            <p className="font-bold text-base-content">Copy Text Summary</p>
                                            <p className="text-[10px] text-base-content/60">
                                                Formatted list for Discord, WhatsApp, or notes
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-primary font-bold">
                                        {copiedShare ? 'Copied!' : 'Copy'}
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleExportJSON}
                                    className="flex w-full items-center justify-between rounded-xl border border-base-300 bg-base-200/50 p-3.5 text-xs font-semibold hover:border-primary transition"
                                >
                                    <div className="flex items-center gap-3 text-left">
                                        <FiDownload className="h-4 w-4 text-secondary shrink-0" />
                                        <div>
                                            <p className="font-bold text-base-content">Export as JSON</p>
                                            <p className="text-[10px] text-base-content/60">
                                                Save backup file of your entire library
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-secondary font-bold">Export</span>
                                </button>

                                <label className="flex w-full cursor-pointer items-center justify-between rounded-xl border border-base-300 bg-base-200/50 p-3.5 text-xs font-semibold hover:border-primary transition">
                                    <div className="flex items-center gap-3 text-left">
                                        <FiUpload className="h-4 w-4 text-accent shrink-0" />
                                        <div>
                                            <p className="font-bold text-base-content">Import JSON Watchlist</p>
                                            <p className="text-[10px] text-base-content/60">
                                                Merge external JSON list into your library
                                            </p>
                                        </div>
                                    </div>
                                    <span className="text-accent font-bold">Import</span>
                                    <input
                                        type="file"
                                        accept=".json"
                                        onChange={handleFileUpload}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Video Trailer Modal */}
            <AnimatePresence>
                {activeTrailerUrl && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setActiveTrailerUrl(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
                    >
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl"
                        >
                            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5 text-white">
                                <div className="flex items-center gap-2">
                                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary text-primary-content">
                                        <FiPlay className="h-3.5 w-3.5 fill-current" />
                                    </span>
                                    <span className="font-display text-sm font-bold truncate">
                                        {activeTrailerTitle} — Trailer Preview
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setActiveTrailerUrl(null)}
                                    className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition"
                                    aria-label="Close trailer"
                                >
                                    <FiX className="h-4 w-4" />
                                </button>
                            </div>

                            <div className="relative aspect-video w-full bg-black">
                                <iframe
                                    src={activeTrailerUrl}
                                    title={`${activeTrailerTitle} trailer`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className="h-full w-full border-0"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default WatchList
