import { useState, useEffect, useRef } from 'react'
import {
    FiFilm,
    FiSearch,
    FiTv,
    FiTrendingUp,
    FiHome,
    FiMenu,
    FiX,
    FiBookmark,
    FiStar,
    FiSmile,
    FiSliders,
    FiAward,
    FiUser,
} from 'react-icons/fi'
import { NavLink, Link, useLocation, useSearchParams, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeToggle from '../ui/ThemeToggle'
import { SMOOTH_EASE, slideDownVariants } from '../../animations/motionVariants'

const Navbar = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [searchFocused, setSearchFocused] = useState(false)
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
    const [allMedia, setAllMedia] = useState([])
    const searchRef = useRef(null)
    const mobileSearchRef = useRef(null)
    const sidebarSearchRef = useRef(null)
    const location = useLocation()
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()

    const urlSearchQuery = searchParams.get('search') || ''
    const currentGenreFilter = searchParams.get('genre')
    const [searchValue, setSearchValue] = useState(urlSearchQuery)

    // Sync input value with URL search param
    useEffect(() => {
        setSearchValue(urlSearchQuery)
    }, [urlSearchQuery])

    // Fetch media data for quick search
    useEffect(() => {
        Promise.all([
            fetch('/popularMovies.json').then((r) => r.json()),
            fetch('/popularSeries.json').then((r) => r.json()),
            fetch('/popularAnimation.json').then((r) => r.json()),
        ])
            .then(([movies, series, animations]) => {
                // Deduplicate items
                const map = new Map()
                for (const item of [...movies, ...series, ...animations]) {
                    if (!map.has(item.id)) map.set(item.id, item)
                }
                setAllMedia(Array.from(map.values()))
            })
            .catch(() => setAllMedia([]))
    }, [])

    // Automatically close dropdowns & sidebar on route change
    useEffect(() => {
        setSidebarOpen(false)
        setSearchFocused(false)
        setMobileSearchOpen(false)
    }, [location.pathname, location.search])

    // Close search dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e) {
            if (
                searchRef.current && !searchRef.current.contains(e.target) &&
                mobileSearchRef.current && !mobileSearchRef.current.contains(e.target) &&
                sidebarSearchRef.current && !sidebarSearchRef.current.contains(e.target)
            ) {
                setSearchFocused(false)
            }
        }
        function handleKeyDown(e) {
            if (e.key === 'Escape') {
                setSidebarOpen(false)
                setSearchFocused(false)
                setMobileSearchOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    // Prevent body scroll when sidebar is open
    useEffect(() => {
        if (sidebarOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = ''
        }
        return () => {
            document.body.style.overflow = ''
        }
    }, [sidebarOpen])

    const navLinks = [
        { path: '/', label: 'Home', icon: FiHome, color: 'text-primary' },
        { path: '/movies', label: 'Movies', icon: FiFilm, color: 'text-primary' },
        { path: '/series', label: 'Series', icon: FiTv, color: 'text-secondary' },
        { path: '/animation', label: 'Animation', icon: FiSmile, color: 'text-warning' },
        { path: '/trending', label: 'Trending', icon: FiTrendingUp, color: 'text-accent' },
        { path: '/premium', label: 'Premium', icon: FiAward, color: 'text-amber-400', isVip: true },
        { path: '/browse', label: 'Explore', icon: FiSliders, color: 'text-primary' },
    ]

    // Handle search submission
    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault()
        const query = searchValue.trim()
        setSearchFocused(false)
        setSidebarOpen(false)
        setMobileSearchOpen(false)

        const currentPath = location.pathname
        const targetPath = ['/browse', '/explore', '/movies', '/series', '/animation', '/trending', '/premium'].includes(currentPath)
            ? currentPath
            : '/browse'

        const params = new URLSearchParams()
        if (currentGenreFilter) {
            params.set('genre', currentGenreFilter)
        }
        if (query) {
            params.set('search', query)
        }

        navigate(`${targetPath}${params.toString() ? `?${params.toString()}` : ''}`)
    }

    // Handle search input change
    const handleSearchChange = (e) => {
        const value = e.target.value
        setSearchValue(value)

        // If user clears the input box completely, remove the search param
        if (value.trim() === '' && urlSearchQuery) {
            const params = new URLSearchParams(searchParams)
            params.delete('search')
            setSearchParams(params)
        }
    }

    // Clear search button
    const handleClearSearch = () => {
        setSearchValue('')
        setSearchFocused(false)
        if (urlSearchQuery) {
            const params = new URLSearchParams(searchParams)
            params.delete('search')
            setSearchParams(params)
        }
    }

    // Quick search preview matches (limit 5)
    const searchSuggestions = searchValue.trim().length > 0
        ? allMedia.filter((item) => {
            const q = searchValue.toLowerCase().trim()
            return (
                item.title?.toLowerCase().includes(q) ||
                item.genres?.some((g) => g.toLowerCase().includes(q)) ||
                item.director?.toLowerCase().includes(q) ||
                item.cast?.some((c) => c.toLowerCase().includes(q)) ||
                item.premiumTier?.toLowerCase().includes(q)
            )
        }).slice(0, 5)
        : []

    return (
        <header className="sticky top-0 z-40 border-b border-base-300/60 bg-base-100/90 backdrop-blur-xl transition-all duration-300">
            <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-3 sm:px-5 lg:px-6">
                {/* Brand Logo & Desktop Nav */}
                <div className="flex items-center gap-2.5 md:gap-4 xl:gap-6">
                    <Link
                        to="/"
                        className="group flex items-center gap-2 sm:gap-2.5"
                        aria-label="ICSN home"
                    >
                        <motion.span
                            whileHover={{ scale: 1.08, rotate: 3 }}
                            whileTap={{ scale: 0.95 }}
                            className="grid h-8 w-8 sm:h-8.5 sm:w-8.5 place-items-center rounded-xl bg-gradient-to-tr from-primary via-secondary to-accent text-primary-content shadow-sm shadow-primary/25"
                        >
                            <FiFilm className="h-4 w-4" />
                        </motion.span>

                        <div className="leading-tight">
                            <p className="font-display text-base sm:text-lg font-extrabold tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                                ICSN
                            </p>
                            <p className="hidden text-[7.5px] sm:text-[8px] font-bold uppercase tracking-[0.2em] text-base-content/50 sm:block">
                                Infinite Cinema
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links (Visible on lg: 1024px+) */}
                    <nav className="hidden items-center gap-0.5 xl:gap-1 lg:flex">
                        {navLinks.map(({ path, label, icon: Icon, color, isVip }) => (
                            <NavLink
                                key={path}
                                to={path}
                                end={path === '/'}
                                className={({ isActive }) =>
                                    `flex items-center gap-1.5 rounded-lg px-2 xl:px-2.5 py-1 text-xs xl:text-[13px] font-semibold transition-colors duration-150 ${
                                        isActive
                                            ? isVip
                                                ? 'bg-amber-500/20 text-amber-400 font-bold border border-amber-500/40 shadow-xs'
                                                : 'bg-primary/10 text-primary font-bold shadow-xs border border-primary/20'
                                            : isVip
                                            ? 'text-amber-400/90 hover:bg-amber-500/10 hover:text-amber-300'
                                            : 'text-base-content/70 hover:bg-base-200/80 hover:text-base-content'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon className={`h-3.5 w-3.5 ${isActive ? color : isVip ? 'text-amber-400' : 'opacity-70'}`} />
                                        <span>{label}</span>
                                        {isVip && (
                                            <span className="ml-0.5 rounded bg-gradient-to-r from-amber-500 to-orange-500 px-1 py-0.1 text-[7.5px] xl:text-[8px] font-extrabold text-black uppercase tracking-wider">
                                                VIP
                                            </span>
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-1 sm:gap-1.5">
                    {/* Interactive Search Bar (Desktop & Tablet sm: 640px+) */}
                    <div className="relative hidden sm:block" ref={searchRef}>
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <FiSearch
                                className={`absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 transition-colors ${
                                    searchFocused ? 'text-primary' : 'text-base-content/40'
                                }`}
                            />
                            <input
                                type="text"
                                value={searchValue}
                                onChange={handleSearchChange}
                                placeholder="Search..."
                                onFocus={() => setSearchFocused(true)}
                                className="h-7.5 w-24 md:w-32 lg:w-28 xl:w-36 rounded-full border border-base-300/80 bg-base-200/50 pl-7 pr-6 text-xs font-medium text-base-content placeholder-base-content/40 transition-all duration-300 focus:w-36 md:focus:w-48 focus:border-primary/60 focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            {searchValue && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                                    aria-label="Clear search"
                                >
                                    <FiX className="h-3 w-3" />
                                </button>
                            )}
                        </form>

                        {/* Live Search Quick Results Dropdown */}
                        <AnimatePresence>
                            {searchFocused && searchValue.trim().length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                                    transition={{ duration: 0.15 }}
                                    className="absolute right-0 top-full mt-2 w-80 sm:w-96 rounded-2xl border border-base-300/80 bg-base-100/98 p-2.5 shadow-2xl backdrop-blur-2xl z-50 space-y-1.5"
                                >
                                    <div className="px-2 py-1 text-[11px] font-bold uppercase tracking-wider text-base-content/50 border-b border-base-300/40 flex items-center justify-between">
                                        <span>Quick Results</span>
                                        <span>{searchSuggestions.length} found</span>
                                    </div>

                                    {searchSuggestions.length === 0 ? (
                                        <div className="px-3 py-4 text-center text-xs text-base-content/60">
                                            No titles found for &ldquo;{searchValue}&rdquo;
                                        </div>
                                    ) : (
                                        searchSuggestions.map((item) => (
                                            <Link
                                                key={item.id}
                                                to={`/details/${item.id}`}
                                                onClick={() => setSearchFocused(false)}
                                                className="flex items-center gap-2.5 rounded-xl p-2 hover:bg-base-200/90 transition-all group"
                                            >
                                                <img
                                                    src={item.poster}
                                                    alt={item.title}
                                                    className="h-11 w-8 rounded-lg object-cover bg-base-300 shrink-0"
                                                />
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-1.5">
                                                        <p className="truncate text-xs font-bold text-base-content group-hover:text-primary transition-colors">
                                                            {item.title}
                                                        </p>
                                                        {item.isPremium && (
                                                            <span className="rounded bg-amber-500/20 px-1 py-0.1 text-[8px] font-extrabold text-amber-400">
                                                                VIP
                                                            </span>
                                                        )}
                                                    </div>
                                                    <div className="flex items-center gap-2 text-[10px] text-base-content/60 pt-0.5">
                                                        <span className="font-semibold">{item.year}</span>
                                                        <span>•</span>
                                                        <span className="rounded bg-primary/10 px-1 py-0.2 text-primary font-bold">
                                                            {item.type || 'Movie'}
                                                        </span>
                                                        {item.rating && (
                                                            <span className="flex items-center gap-0.5 text-amber-600 dark:text-amber-400 font-bold">
                                                                <FiStar className="h-2.5 w-2.5 fill-current" />
                                                                {item.rating}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </Link>
                                        ))
                                    )}

                                    <button
                                        type="button"
                                        onClick={handleSearchSubmit}
                                        className="w-full text-center py-2 text-xs font-bold text-primary hover:bg-primary/10 rounded-xl transition-colors border-t border-base-300/40"
                                    >
                                        View all results for &ldquo;{searchValue}&rdquo; &rarr;
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Mobile Quick Search Button (Screen < 640px) */}
                    <button
                        type="button"
                        onClick={() => setMobileSearchOpen((prev) => !prev)}
                        className="btn btn-ghost btn-circle btn-sm sm:hidden text-base-content/80 hover:text-primary"
                        aria-label="Toggle mobile search"
                    >
                        <FiSearch className="h-4 w-4" />
                    </button>

                    {/* Bookmark Counter Icon */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        className="btn btn-ghost btn-circle btn-sm text-base-content/80 hover:text-primary"
                        title="Watchlist"
                        aria-label="View Watchlist"
                    >
                        <FiBookmark className="h-4 w-4" />
                    </motion.button>

                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* User / Login Button with Text and Icon */}
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-primary to-accent px-2.5 py-1 text-xs font-bold text-primary-content shadow-xs shadow-primary/20 hover:shadow-primary/40 hover:opacity-95 transition-all"
                        title="Sign In / Account"
                        aria-label="Sign In"
                    >
                        <FiUser className="h-3.5 w-3.5" />
                        <span>Login</span>
                    </Link>

                    {/* Hamburger Button (Visible on Mobile & Tablet: lg:hidden) */}
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className="btn btn-ghost btn-circle btn-sm lg:hidden text-base-content hover:bg-base-200"
                        aria-label="Open sidebar navigation"
                        title="Menu"
                    >
                        <FiMenu className="h-5 w-5" />
                    </button>
                </div>
            </div>

            {/* Mobile Search Expandable Bar (Screen < 640px) */}
            <AnimatePresence>
                {mobileSearchOpen && (
                    <motion.div
                        variants={slideDownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        ref={mobileSearchRef}
                        className="border-t border-base-300/60 bg-base-100/98 px-4 py-3 sm:hidden shadow-lg backdrop-blur-xl"
                    >
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 h-4 w-4" />
                            <input
                                type="text"
                                autoFocus
                                value={searchValue}
                                onChange={handleSearchChange}
                                placeholder="Search movies, series, cast..."
                                className="h-10 w-full rounded-xl border border-base-300 bg-base-200/70 pl-9 pr-9 text-xs font-medium focus:border-primary focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                            />
                            {searchValue && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                                    aria-label="Clear search"
                                >
                                    <FiX className="h-4 w-4" />
                                </button>
                            )}
                        </form>

                        {/* Mobile Live Suggestions Dropdown */}
                        {searchValue.trim().length > 0 && (
                            <div className="mt-2 rounded-xl border border-base-300/60 bg-base-200/70 p-2 space-y-1">
                                {searchSuggestions.slice(0, 4).map((item) => (
                                    <Link
                                        key={item.id}
                                        to={`/details/${item.id}`}
                                        onClick={() => setMobileSearchOpen(false)}
                                        className="flex items-center gap-2.5 rounded-lg p-1.5 hover:bg-base-100 transition-colors"
                                    >
                                        <img
                                            src={item.poster}
                                            alt={item.title}
                                            className="h-9 w-7 rounded object-cover shrink-0"
                                        />
                                        <div className="min-w-0 flex-1 text-xs">
                                            <p className="font-bold truncate text-base-content">{item.title}</p>
                                            <p className="text-[10px] text-base-content/50">{item.type} • {item.year}</p>
                                        </div>
                                    </Link>
                                ))}
                                <button
                                    type="button"
                                    onClick={handleSearchSubmit}
                                    className="w-full text-center py-1.5 text-[11px] font-bold text-primary hover:underline block"
                                >
                                    View all results &rarr;
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Slide-out Offcanvas Sidebar Drawer (For Mobile & Tablet mode) */}
            <AnimatePresence>
                {sidebarOpen && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        {/* Backdrop Blur Overlay */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            onClick={() => setSidebarOpen(false)}
                            className="fixed inset-0 bg-black/65 backdrop-blur-sm"
                            aria-hidden="true"
                        />

                        {/* Slide-Out Sidebar Panel */}
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
                            className="fixed right-0 top-0 bottom-0 flex h-full w-[85vw] max-w-sm flex-col justify-between overflow-y-auto border-l border-base-300/80 bg-base-100/98 p-5 shadow-2xl backdrop-blur-2xl"
                            role="dialog"
                            aria-label="Sidebar navigation"
                        >
                            <div className="space-y-4">
                                {/* Sidebar Top Header */}
                                <div className="flex items-center justify-between border-b border-base-300/60 pb-3">
                                    <Link
                                        to="/"
                                        onClick={() => setSidebarOpen(false)}
                                        className="flex items-center gap-2.5"
                                    >
                                        <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-tr from-primary via-secondary to-accent text-primary-content shadow-md shadow-primary/25">
                                            <FiFilm className="h-4 w-4" />
                                        </span>
                                        <div>
                                            <p className="font-display text-lg font-extrabold tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                                                ICSN
                                            </p>
                                            <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-base-content/50">
                                                Infinite Cinema
                                            </p>
                                        </div>
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={() => setSidebarOpen(false)}
                                        className="btn btn-ghost btn-circle btn-sm text-base-content/70 hover:text-base-content"
                                        aria-label="Close sidebar"
                                    >
                                        <FiX className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Sidebar Search Bar */}
                                <div className="relative w-full" ref={sidebarSearchRef}>
                                    <form onSubmit={handleSearchSubmit} className="relative">
                                        <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40 h-4 w-4" />
                                        <input
                                            type="text"
                                            value={searchValue}
                                            onChange={handleSearchChange}
                                            placeholder="Search movies, series, cast..."
                                            className="h-10 w-full rounded-xl border border-base-300 bg-base-200/60 pl-9 pr-9 text-xs font-medium focus:border-primary focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                        {searchValue && (
                                            <button
                                                type="button"
                                                onClick={handleClearSearch}
                                                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                                                aria-label="Clear search"
                                            >
                                                <FiX className="h-4 w-4" />
                                            </button>
                                        )}
                                    </form>

                                    {/* Sidebar Live Search Suggestions */}
                                    {searchValue.trim().length > 0 && (
                                        <div className="mt-2 rounded-xl border border-base-300/60 bg-base-200/60 p-2 space-y-1">
                                            {searchSuggestions.slice(0, 3).map((item) => (
                                                <Link
                                                    key={item.id}
                                                    to={`/details/${item.id}`}
                                                    onClick={() => setSidebarOpen(false)}
                                                    className="flex items-center gap-2.5 rounded-lg p-1.5 hover:bg-base-100 transition-colors"
                                                >
                                                    <img
                                                        src={item.poster}
                                                        alt={item.title}
                                                        className="h-9 w-7 rounded object-cover shrink-0"
                                                    />
                                                    <div className="min-w-0 flex-1 text-xs">
                                                        <p className="font-bold truncate text-base-content">{item.title}</p>
                                                        <p className="text-[10px] text-base-content/50">{item.type} • {item.year}</p>
                                                    </div>
                                                </Link>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={handleSearchSubmit}
                                                className="w-full text-center py-1.5 text-[11px] font-bold text-primary hover:underline block"
                                            >
                                                View all results &rarr;
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Sidebar Nav Links */}
                                <div className="space-y-1">
                                    <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-base-content/40">
                                        Navigation
                                    </p>
                                    {navLinks.map(({ path, label, icon: Icon, color, isVip }) => (
                                        <NavLink
                                            key={path}
                                            to={path}
                                            end={path === '/'}
                                            onClick={() => setSidebarOpen(false)}
                                            className={({ isActive }) =>
                                                `flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all ${
                                                    isActive
                                                        ? isVip
                                                            ? 'bg-amber-500 text-black font-extrabold shadow-md shadow-amber-500/20'
                                                            : 'bg-primary text-primary-content font-bold shadow-md shadow-primary/20'
                                                        : isVip
                                                        ? 'text-amber-400 hover:bg-amber-500/10'
                                                        : 'text-base-content/80 hover:bg-base-200 hover:text-base-content'
                                                }`
                                            }
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    <div className="flex items-center gap-3">
                                                        <Icon className={`h-4 w-4 ${isActive ? (isVip ? 'text-black' : 'text-primary-content') : color}`} />
                                                        <span>{label}</span>
                                                    </div>
                                                    {isVip && (
                                                        <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider ${
                                                            isActive ? 'bg-black/30 text-black' : 'bg-amber-500/20 text-amber-400'
                                                        }`}>
                                                            VIP
                                                        </span>
                                                    )}
                                                    {path === '/browse' && (
                                                        <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider ${
                                                            isActive ? 'bg-primary-content/20 text-primary-content' : 'bg-primary/10 text-primary'
                                                        }`}>
                                                            Filters
                                                        </span>
                                                    )}
                                                </>
                                            )}
                                        </NavLink>
                                    ))}
                                </div>
                            </div>

                            {/* Sidebar Footer */}
                            <div className="border-t border-base-300/60 pt-4 space-y-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <Link
                                        to="/login"
                                        onClick={() => setSidebarOpen(false)}
                                        className="flex items-center justify-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 py-2.5 text-xs font-bold text-primary hover:bg-primary/20 transition-all text-center"
                                    >
                                        <FiUser className="h-3.5 w-3.5" />
                                        <span>Sign In</span>
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={() => setSidebarOpen(false)}
                                        className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-accent py-2.5 text-xs font-bold text-primary-content shadow-sm hover:opacity-95 transition-all text-center"
                                    >
                                        <span>Register</span>
                                    </Link>
                                </div>

                                <div className="flex items-center justify-between text-xs text-base-content/70 pt-1">
                                    <span className="font-semibold">Appearance</span>
                                    <ThemeToggle />
                                </div>

                                <div className="rounded-xl bg-base-200/50 p-2.5 text-center">
                                    <p className="text-[11px] font-bold text-base-content/70">
                                        Infinite Cinema Series Network
                                    </p>
                                    <p className="text-[9px] text-base-content/40">
                                        &copy; 2026 ICSN. All rights reserved.
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </header>
    )
}

export default Navbar