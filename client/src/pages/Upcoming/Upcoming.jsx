import { useState, useEffect, useMemo, useCallback } from 'react'
import { Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FiCalendar,
    FiClock,
    FiBell,
    FiCheck,
    FiPlay,
    FiStar,
    FiSearch,
    FiX,
    FiSliders,
    FiAward,
    FiZap,
    FiFilm,
    FiTv,
    FiSmile,
    FiEye,
    FiVolume2,
    FiShare2,
    FiChevronRight,
} from 'react-icons/fi'
import { useWatchlist } from '../../context/WatchlistContext'
import GenreIcon from '../../components/ui/GenreIcon'
import {
    pageVariants,
    containerVariants,
    itemVariants,
    modalVariants,
} from '../../animations/motionVariants'

// Helper to calculate exact countdown breakdown
const getTimeRemaining = (targetDateStr) => {
    const total = Date.parse(targetDateStr) - Date.now()
    if (total <= 0) {
        return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isReleased: true }
    }
    const seconds = Math.floor((total / 1000) % 60)
    const minutes = Math.floor((total / 1000 / 60) % 60)
    const hours = Math.floor((total / (1000 * 60 * 60)) % 24)
    const days = Math.floor(total / (1000 * 60 * 60 * 24))

    return { total, days, hours, minutes, seconds, isReleased: false }
}

const Upcoming = () => {
    const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist()

    const [premieres, setPremieres] = useState([])
    const [loading, setLoading] = useState(true)
    const [now, setNow] = useState(Date.now())

    // Filters
    const [selectedTimeline, setSelectedTimeline] = useState('all') // 'all' | '30days' | '2026' | '2027'
    const [selectedType, setSelectedType] = useState('all') // 'all' | 'Movie' | 'Series' | 'Animation'
    const [selectedFormat, setSelectedFormat] = useState('all') // 'all' | 'IMAX 70mm' | '4K HDR'
    const [searchQuery, setSearchQuery] = useState('')

    // Trailer modal state
    const [activeTrailer, setActiveTrailer] = useState(null)

    // Local hype tracking
    const [hypedMap, setHypedMap] = useState(() => {
        try {
            const saved = localStorage.getItem('icsn_hyped_premieres')
            return saved ? JSON.parse(saved) : {}
        } catch {
            return {}
        }
    })

    // Fetch upcoming premieres
    useEffect(() => {
        let isMounted = true
        fetch('/upcomingPremieres.json')
            .then((res) => {
                if (!res.ok) throw new Error('Failed to load upcoming premieres')
                return res.json()
            })
            .then((data) => {
                if (isMounted) {
                    setPremieres(data)
                    setLoading(false)
                }
            })
            .catch((err) => {
                console.error(err)
                if (isMounted) setLoading(false)
            })

        return () => {
            isMounted = false
        }
    }, [])

    // Real-time ticking interval for live countdowns
    useEffect(() => {
        const interval = setInterval(() => {
            setNow(Date.now())
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    // Handle Hype Vote
    const handleToggleHype = (id) => {
        setHypedMap((prev) => {
            const current = prev[id] || false
            const next = { ...prev, [id]: !current }
            try {
                localStorage.setItem('icsn_hyped_premieres', JSON.stringify(next))
            } catch (e) {
                console.error(e)
            }
            return next
        })
    }

    // Toggle reminder with Watchlist
    const handleToggleReminder = (item) => {
        const itemId = item.id || item._id
        if (isInWatchlist(itemId)) {
            removeFromWatchlist(itemId)
        } else {
            addToWatchlist(
                {
                    ...item,
                    id: itemId,
                    status: 'plan_to_watch',
                },
                'plan_to_watch'
            )
        }
    }

    // Spotlight premiere (Item with highest hype or nearest date)
    const spotlightItem = useMemo(() => {
        if (!premieres.length) return null
        return premieres[0]
    }, [premieres])

    const spotlightCountdown = useMemo(() => {
        if (!spotlightItem) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
        return getTimeRemaining(spotlightItem.releaseDate)
    }, [spotlightItem, now])

    // Filtered premieres list
    const filteredPremieres = useMemo(() => {
        return premieres.filter((item) => {
            // Timeline filter
            if (selectedTimeline === '30days') {
                const diffDays = (Date.parse(item.releaseDate) - now) / (1000 * 60 * 60 * 24)
                if (diffDays < 0 || diffDays > 60) return false
            } else if (selectedTimeline === '2026') {
                if (!item.releaseDate?.startsWith('2026')) return false
            } else if (selectedTimeline === '2027') {
                if (!item.releaseDate?.startsWith('2027')) return false
            }

            // Type filter
            if (selectedType !== 'all') {
                if ((item.type || '').toLowerCase() !== selectedType.toLowerCase()) return false
            }

            // Format filter
            if (selectedFormat !== 'all') {
                if (item.format !== selectedFormat) return false
            }

            // Search query
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim()
                const matchTitle = item.title?.toLowerCase().includes(q)
                const matchDirector = item.director?.toLowerCase().includes(q)
                const matchGenres = item.genres?.some((g) => g.toLowerCase().includes(q))
                const matchCast = item.cast?.some((c) => c.toLowerCase().includes(q))
                if (!matchTitle && !matchDirector && !matchGenres && !matchCast) return false
            }

            return true
        })
    }, [premieres, selectedTimeline, selectedType, selectedFormat, searchQuery, now])

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen bg-base-100 pb-24 text-base-content"
        >
            {/* HERO SPOTLIGHT COUNTDOWN BANNER */}
            {spotlightItem && (
                <section className="relative overflow-hidden border-b border-base-300 bg-gradient-to-b from-base-200/80 via-base-100 to-base-100 text-base-content min-h-[500px] sm:min-h-[540px] flex items-center">
                    {/* Background Backdrop with Gradient Overlays */}
                    <div className="absolute inset-0 z-0 overflow-hidden">
                        <img
                            src={spotlightItem.backdrop || spotlightItem.poster}
                            alt={spotlightItem.title}
                            className="h-full w-full object-cover object-center opacity-10 filter blur-xs scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-base-100/80 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-base-100 via-base-100/70 to-transparent" />
                    </div>

                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative z-10 w-full">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
                            {/* Left Col: Info & Countdown */}
                            <div className="lg:col-span-8 space-y-5 text-center lg:text-left">
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
                                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 border border-primary/30 px-3 py-1 text-xs font-black uppercase tracking-wider text-primary shadow-xs backdrop-blur-md">
                                        <FiCalendar className="h-3.5 w-3.5" />
                                        <span>#1 Most Anticipated Premiere</span>
                                    </span>
                                    {spotlightItem.isPremium && (
                                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/20 border border-amber-500/40 px-2.5 py-1 text-xs font-black uppercase text-amber-600">
                                            <FiZap className="h-3.5 w-3.5 fill-current" />
                                            <span>{spotlightItem.format || 'IMAX 70mm'}</span>
                                        </span>
                                    )}
                                </div>

                                <h1 className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-base-content leading-tight">
                                    {spotlightItem.title}
                                </h1>

                                <p className="text-xs sm:text-sm md:text-base text-base-content/75 max-w-2xl line-clamp-3 leading-relaxed mx-auto lg:mx-0">
                                    {spotlightItem.description}
                                </p>

                                {/* LIVE TICKING CLOCK GAUGE */}
                                <div className="pt-2">
                                    <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-primary mb-2.5">
                                        Official Release Countdown
                                    </p>
                                    <div className="grid grid-cols-4 gap-2 sm:gap-3.5 max-w-md mx-auto lg:mx-0">
                                        {[
                                            { label: 'Days', val: spotlightCountdown.days },
                                            { label: 'Hours', val: spotlightCountdown.hours },
                                            { label: 'Minutes', val: spotlightCountdown.minutes },
                                            { label: 'Seconds', val: spotlightCountdown.seconds },
                                        ].map(({ label, val }) => (
                                            <div
                                                key={label}
                                                className="flex flex-col items-center justify-center rounded-2xl border border-base-300 bg-base-200/90 p-2.5 sm:p-3.5 shadow-md backdrop-blur-md"
                                            >
                                                <span className="font-display text-2xl sm:text-3xl md:text-4xl font-black text-primary tabular-nums tracking-tight">
                                                    {String(val).padStart(2, '0')}
                                                </span>
                                                <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-base-content/70 mt-0.5">
                                                    {label}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-3">
                                    <button
                                        type="button"
                                        onClick={() => handleToggleReminder(spotlightItem)}
                                        className={`inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-bold transition-all shadow-md cursor-pointer ${
                                            isInWatchlist(spotlightItem.id)
                                                ? 'bg-emerald-500 text-black hover:bg-emerald-400 shadow-emerald-500/20'
                                                : 'bg-primary text-primary-content hover:bg-primary/90 shadow-primary/20'
                                        }`}
                                    >
                                        {isInWatchlist(spotlightItem.id) ? (
                                            <>
                                                <FiCheck className="h-4 w-4 stroke-[3]" />
                                                <span>Reminder Set in Watchlist</span>
                                            </>
                                        ) : (
                                            <>
                                                <FiBell className="h-4 w-4" />
                                                <span>Set Release Reminder</span>
                                            </>
                                        )}
                                    </button>

                                    {spotlightItem.trailerUrl && (
                                        <button
                                            type="button"
                                            onClick={() => setActiveTrailer(spotlightItem)}
                                            className="inline-flex items-center gap-2 rounded-xl border border-base-300 bg-base-200/80 hover:bg-base-300 px-5 py-3 text-xs font-bold text-base-content backdrop-blur-md transition-all cursor-pointer shadow-xs"
                                        >
                                            <FiPlay className="h-4 w-4 text-primary fill-primary" />
                                            <span>Watch Master Trailer</span>
                                        </button>
                                    )}

                                    <button
                                        type="button"
                                        onClick={() => handleToggleHype(spotlightItem.id)}
                                        className={`inline-flex items-center gap-1.5 rounded-xl border px-3.5 py-3 text-xs font-bold transition-all ${
                                            hypedMap[spotlightItem.id]
                                                ? 'border-orange-500/50 bg-orange-500/20 text-orange-600 font-extrabold'
                                                : 'border-base-300 bg-base-200/60 text-base-content/80 hover:bg-base-200'
                                        }`}
                                        title="Vote Hype"
                                    >
                                        <span>🔥</span>
                                        <span>
                                            {(spotlightItem.hypeCount || 0) + (hypedMap[spotlightItem.id] ? 1 : 0)} Hyped
                                        </span>
                                    </button>
                                </div>
                            </div>

                            {/* Right Col: Poster Card preview */}
                            <div className="lg:col-span-4 hidden lg:flex justify-center">
                                <motion.div
                                    whileHover={{ scale: 1.03, rotate: 1 }}
                                    className="relative w-64 rounded-3xl overflow-hidden border-2 border-base-300/80 dark:border-white/20 shadow-xl dark:shadow-2xl shadow-primary/10 bg-base-200 dark:bg-base-900 group cursor-pointer"
                                    onClick={() => setActiveTrailer(spotlightItem)}
                                >
                                    <img
                                        src={spotlightItem.poster}
                                        alt={spotlightItem.title}
                                        className="h-96 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-85" />
                                    <div className="absolute bottom-4 left-4 right-4 text-left">
                                        <span className="rounded bg-amber-500 px-2 py-0.5 text-[9px] font-black text-black uppercase">
                                            {spotlightItem.screeningType || 'Theatrical Premiere'}
                                        </span>
                                        <p className="font-display text-sm font-bold text-white mt-1 line-clamp-1">
                                            {spotlightItem.title}
                                        </p>
                                        <p className="text-[11px] text-gray-200">
                                            Directed by {spotlightItem.director}
                                        </p>
                                    </div>
                                    <span className="absolute top-3 right-3 grid h-10 w-10 place-items-center rounded-full bg-primary text-primary-content shadow-lg group-hover:scale-110 transition-transform">
                                        <FiPlay className="h-4 w-4 fill-current ml-0.5" />
                                    </span>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>
            )}

            {/* FILTER & SEARCH TOOLBAR */}
            <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-base-300/80 pb-6">
                    <div>
                        <h2 className="font-display text-2xl font-extrabold tracking-tight text-base-content flex items-center gap-2.5">
                            <FiCalendar className="h-6 w-6 text-primary" />
                            <span>Upcoming Premiere Schedule</span>
                        </h2>
                        <p className="text-xs text-base-content/60 mt-1">
                            Live release timelines, countdown clocks, and instant watchlist reminders.
                        </p>
                    </div>

                    {/* Search Input */}
                    <div className="relative w-full md:w-72">
                        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/40" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search upcoming titles, cast..."
                            className="h-10 w-full rounded-2xl border border-base-300/80 bg-base-200/50 pl-9 pr-8 text-xs font-semibold focus:border-primary focus:outline-none"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                            >
                                <FiX className="h-3.5 w-3.5" />
                            </button>
                        )}
                    </div>
                </div>

                {/* Filter Pills Row */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Timeline Filter */}
                    <div className="flex items-center gap-1 rounded-2xl bg-base-200/60 p-1 border border-base-300/80">
                        {[
                            { id: 'all', label: 'All Dates' },
                            { id: '30days', label: 'Next 60 Days' },
                            { id: '2026', label: 'Late 2026' },
                            { id: '2027', label: '2027 Lineup' },
                        ].map(({ id, label }) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setSelectedTimeline(id)}
                                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                                    selectedTimeline === id
                                        ? 'bg-primary text-primary-content shadow-xs'
                                        : 'text-base-content/70 hover:text-base-content'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    {/* Media Type Filter */}
                    <div className="flex items-center gap-1 rounded-2xl bg-base-200/60 p-1 border border-base-300/80">
                        {[
                            { id: 'all', label: 'All Types' },
                            { id: 'Movie', label: 'Movies', icon: FiFilm },
                            { id: 'Series', label: 'Series', icon: FiTv },
                            { id: 'Animation', label: 'Anime', icon: FiSmile },
                        ].map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setSelectedType(id)}
                                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                                    selectedType === id
                                        ? 'bg-secondary text-secondary-content shadow-xs'
                                        : 'text-base-content/70 hover:text-base-content'
                                }`}
                            >
                                {Icon && <Icon className="h-3 w-3" />}
                                <span>{label}</span>
                            </button>
                        ))}
                    </div>

                    {/* VIP Format Filter */}
                    <div className="flex items-center gap-1 rounded-2xl bg-base-200/60 p-1 border border-base-300/80">
                        {[
                            { id: 'all', label: 'All Formats' },
                            { id: 'IMAX 70mm', label: 'IMAX 70mm' },
                            { id: '4K HDR', label: '4K HDR' },
                        ].map(({ id, label }) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setSelectedFormat(id)}
                                className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                                    selectedFormat === id
                                        ? 'bg-amber-500 text-black shadow-xs font-black'
                                        : 'text-base-content/70 hover:text-base-content'
                                }`}
                            >
                                {label}
                            </button>
                        ))}
                    </div>

                    <span className="text-xs text-base-content/50 font-semibold ml-auto">
                        Showing {filteredPremieres.length} titles
                    </span>
                </div>

                {/* PREMIERE CARDS GRID */}
                {filteredPremieres.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-base-300 p-12 text-center space-y-3">
                        <span className="grid h-12 w-12 mx-auto place-items-center rounded-2xl bg-base-200 text-base-content/60">
                            <FiCalendar className="h-6 w-6" />
                        </span>
                        <h4 className="font-display text-base font-bold text-base-content">
                            No upcoming premieres match your filter
                        </h4>
                        <p className="text-xs text-base-content/60 max-w-sm mx-auto">
                            Try resetting your timeline or format filters to see all anticipated theatrical releases.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedTimeline('all')
                                setSelectedType('all')
                                setSelectedFormat('all')
                                setSearchQuery('')
                            }}
                            className="btn btn-primary btn-sm rounded-xl font-bold"
                        >
                            Reset All Filters
                        </button>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    >
                        {filteredPremieres.map((item) => {
                            const itemId = item.id || item._id
                            const countdown = getTimeRemaining(item.releaseDate)
                            const isReminded = isInWatchlist(itemId)
                            const isHyped = hypedMap[itemId] || false
                            const releaseDateObj = new Date(item.releaseDate)
                            const formattedDate = releaseDateObj.toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                            })

                            return (
                                <motion.div
                                    key={itemId}
                                    variants={itemVariants}
                                    className="group relative flex flex-col justify-between rounded-3xl border border-base-300/80 bg-base-200/40 p-4 backdrop-blur-md transition-all hover:border-primary/50 hover:shadow-xl hover:-translate-y-1"
                                >
                                    {/* Card Top: Poster & Live Countdown Badge */}
                                    <div className="space-y-3">
                                        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-base-300">
                                            <img
                                                src={item.backdrop || item.poster}
                                                alt={item.title}
                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                                            {/* Top Badges */}
                                            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                                                <span className="rounded-lg bg-black/70 px-2 py-0.5 text-[10px] font-black uppercase text-amber-400 backdrop-blur-md">
                                                    {item.format || item.type}
                                                </span>
                                                <span className="rounded-lg bg-primary/90 px-2 py-0.5 text-[10px] font-black text-primary-content shadow-xs">
                                                    {item.year}
                                                </span>
                                            </div>

                                            {/* Bottom Live Countdown Ribbon */}
                                            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white">
                                                <div className="flex items-center gap-1.5 rounded-lg bg-black/80 px-2 py-1 text-[11px] font-bold backdrop-blur-md">
                                                    <FiClock className="h-3 w-3 text-primary animate-pulse" />
                                                    <span>
                                                        T-minus {countdown.days}d {countdown.hours}h {countdown.minutes}m
                                                    </span>
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-300">
                                                    {formattedDate}
                                                </span>
                                            </div>

                                            {/* Hover Trailer Play Overlay */}
                                            {item.trailerUrl && (
                                                <button
                                                    type="button"
                                                    onClick={() => setActiveTrailer(item)}
                                                    className="absolute inset-0 grid place-items-center opacity-0 group-hover:opacity-100 bg-black/40 backdrop-blur-2xs transition-opacity cursor-pointer"
                                                    aria-label="Play Trailer"
                                                >
                                                    <span className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-content shadow-xl scale-90 group-hover:scale-100 transition-transform">
                                                        <FiPlay className="h-5 w-5 fill-current ml-0.5" />
                                                    </span>
                                                </button>
                                            )}
                                        </div>

                                        {/* Card Metadata */}
                                        <div className="space-y-1.5 pt-1">
                                            <div className="flex items-start justify-between gap-2">
                                                <h3 className="font-display text-lg font-bold text-base-content group-hover:text-primary transition-colors line-clamp-1">
                                                    {item.title}
                                                </h3>
                                                <button
                                                    type="button"
                                                    onClick={() => handleToggleHype(itemId)}
                                                    className={`inline-flex items-center gap-1 rounded-lg px-2 py-0.5 text-[10px] font-bold transition ${
                                                        isHyped
                                                            ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                                                            : 'bg-base-300/80 text-base-content/70 hover:bg-base-300'
                                                    }`}
                                                    title="Hype Score"
                                                >
                                                    <span>🔥</span>
                                                    <span>{(item.hypeCount || 0) + (isHyped ? 1 : 0)}</span>
                                                </button>
                                            </div>

                                            <p className="text-xs text-base-content/70 line-clamp-2 leading-relaxed">
                                                {item.description}
                                            </p>

                                            <div className="flex flex-wrap items-center gap-1.5 pt-1">
                                                {item.genres?.slice(0, 3).map((genre) => (
                                                    <span
                                                        key={genre}
                                                        className="inline-flex items-center gap-1 rounded-md bg-base-300/60 px-1.5 py-0.5 text-[10px] font-semibold text-base-content/80"
                                                    >
                                                        <GenreIcon name={genre} className="h-2.5 w-2.5 text-primary" />
                                                        <span>{genre}</span>
                                                    </span>
                                                ))}
                                                <span className="text-[10px] text-base-content/50 ml-auto">
                                                    Dir. {item.director}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Card Actions */}
                                    <div className="grid grid-cols-2 gap-2 pt-4 mt-2 border-t border-base-300/60">
                                        <button
                                            type="button"
                                            onClick={() => handleToggleReminder(item)}
                                            className={`inline-flex items-center justify-center gap-1.5 rounded-xl py-2 text-xs font-bold transition-all cursor-pointer ${
                                                isReminded
                                                    ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25'
                                                    : 'bg-primary text-primary-content hover:bg-primary/90 shadow-sm'
                                            }`}
                                        >
                                            {isReminded ? (
                                                <>
                                                    <FiCheck className="h-3.5 w-3.5 stroke-[3]" />
                                                    <span>Reminder Set</span>
                                                </>
                                            ) : (
                                                <>
                                                    <FiBell className="h-3.5 w-3.5" />
                                                    <span>Remind Me</span>
                                                </>
                                            )}
                                        </button>

                                        {item.trailerUrl ? (
                                            <button
                                                type="button"
                                                onClick={() => setActiveTrailer(item)}
                                                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-base-300/80 bg-base-200/80 py-2 text-xs font-bold text-base-content hover:bg-base-200 transition-all cursor-pointer"
                                            >
                                                <FiPlay className="h-3.5 w-3.5 text-primary" />
                                                <span>Trailer</span>
                                            </button>
                                        ) : (
                                            <Link
                                                to={`/details/${itemId}`}
                                                className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-base-300/80 bg-base-200/80 py-2 text-xs font-bold text-base-content hover:bg-base-200 transition-all"
                                            >
                                                <span>Details</span>
                                            </Link>
                                        )}
                                    </div>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                )}
            </section>

            {/* TRAILER PREVIEW MODAL */}
            <AnimatePresence>
                {activeTrailer && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setActiveTrailer(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
                    >
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-base-300/80 bg-base-950 p-4 sm:p-6 shadow-2xl space-y-4 text-white"
                        >
                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                <div>
                                    <span className="rounded bg-primary/20 px-2 py-0.5 text-[9px] font-black uppercase text-primary tracking-wider">
                                        Official Master Trailer
                                    </span>
                                    <h3 className="font-display text-lg sm:text-xl font-bold text-white mt-1">
                                        {activeTrailer.title}
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setActiveTrailer(null)}
                                    className="btn btn-ghost btn-circle btn-sm text-gray-400 hover:text-white"
                                >
                                    <FiX className="h-5 w-5" />
                                </button>
                            </div>

                            {/* Embedded Trailer Video */}
                            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-2xl bg-black shadow-inner">
                                <iframe
                                    src={activeTrailer.trailerUrl}
                                    title={activeTrailer.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                    className="h-full w-full border-0"
                                />
                            </div>

                            {/* Trailer Details & Specs Footer */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-2 text-xs">
                                <div className="space-y-1">
                                    <p className="font-semibold text-gray-300">
                                        Premiering {new Date(activeTrailer.releaseDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </p>
                                    <p className="text-[11px] text-gray-400">
                                        {activeTrailer.distributor} • {activeTrailer.screeningType || 'Theatrical Premiere'}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => handleToggleReminder(activeTrailer)}
                                    className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 font-bold transition-all cursor-pointer ${
                                        isInWatchlist(activeTrailer.id)
                                            ? 'bg-emerald-500 text-black'
                                            : 'bg-primary text-primary-content'
                                    }`}
                                >
                                    {isInWatchlist(activeTrailer.id) ? (
                                        <>
                                            <FiCheck className="h-3.5 w-3.5 stroke-[3]" />
                                            <span>Reminder Set in Watchlist</span>
                                        </>
                                    ) : (
                                        <>
                                            <FiBell className="h-3.5 w-3.5" />
                                            <span>Set Release Reminder</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default Upcoming
