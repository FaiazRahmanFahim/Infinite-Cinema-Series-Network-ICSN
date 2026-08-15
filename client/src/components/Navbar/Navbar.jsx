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
    FiGrid,
    FiChevronDown,
    FiCheck,
    FiStar,
} from 'react-icons/fi'
import { NavLink, Link, useLocation, useSearchParams, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import ThemeToggle from '../ui/ThemeToggle'
import GenreIcon from '../ui/GenreIcon'

const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [searchFocused, setSearchFocused] = useState(false)
    const [genresOpen, setGenresOpen] = useState(false)
    const [genres, setGenres] = useState([])
    const [allMedia, setAllMedia] = useState([])
    const genresRef = useRef(null)
    const searchRef = useRef(null)
    const mobileSearchRef = useRef(null)
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

    // Fetch genres data and all media for quick search
    useEffect(() => {
        fetch('/genres.json')
            .then((res) => res.json())
            .then(setGenres)
            .catch(() => setGenres([]))

        Promise.all([
            fetch('/popularMovies.json').then((r) => r.json()),
            fetch('/popularSeries.json').then((r) => r.json()),
        ])
            .then(([movies, series]) => {
                setAllMedia([...movies, ...series])
            })
            .catch(() => setAllMedia([]))
    }, [])

    // Automatically close dropdowns on route change
    useEffect(() => {
        setGenresOpen(false)
        setMobileMenuOpen(false)
        setSearchFocused(false)
    }, [location.pathname, location.search])

    // Close dropdown on outside click
    useEffect(() => {
        function handleClickOutside(e) {
            if (genresRef.current && !genresRef.current.contains(e.target)) {
                setGenresOpen(false)
            }
            if (
                searchRef.current && !searchRef.current.contains(e.target) &&
                mobileSearchRef.current && !mobileSearchRef.current.contains(e.target)
            ) {
                setSearchFocused(false)
            }
        }
        function handleKeyDown(e) {
            if (e.key === 'Escape') {
                setGenresOpen(false)
                setSearchFocused(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('keydown', handleKeyDown)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [])

    const navLinks = [
        { path: '/', label: 'Home', icon: FiHome, color: 'text-primary' },
        { path: '/movies', label: 'Movies', icon: FiFilm, color: 'text-primary' },
        { path: '/series', label: 'Series', icon: FiTv, color: 'text-secondary' },
        { path: '/trending', label: 'Trending', icon: FiTrendingUp, color: 'text-accent' },
    ]

    // Determine current target base path for genre filtering
    const getGenrePath = (genreName) => {
        const basePath = ['/movies', '/series', '/trending'].includes(location.pathname)
            ? location.pathname
            : '/'
        const params = new URLSearchParams(searchParams)
        params.set('genre', genreName)
        return `${basePath}?${params.toString()}`
    }

    // Handle search submission
    const handleSearchSubmit = (e) => {
        if (e) e.preventDefault()
        const query = searchValue.trim()
        setSearchFocused(false)
        setMobileMenuOpen(false)

        const currentPath = location.pathname
        const targetPath = ['/movies', '/series', '/trending', '/'].includes(currentPath)
            ? currentPath
            : '/movies'

        const params = new URLSearchParams()
        if (currentGenreFilter) {
            params.set('genre', currentGenreFilter)
        }
        if (query) {
            params.set('search', query)
        }

        navigate(`${targetPath}${params.toString() ? `?${params.toString()}` : ''}`)
    }

    // Handle search input change (and live URL sync if desired)
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
                  item.cast?.some((c) => c.toLowerCase().includes(q))
              )
          }).slice(0, 5)
        : []

    const currentScopeLabel =
        location.pathname === '/movies'
            ? 'Movies'
            : location.pathname === '/series'
            ? 'Series'
            : location.pathname === '/trending'
            ? 'Trending'
            : 'All Content'

    return (
        <header className="sticky top-0 z-50 border-b border-base-300/60 bg-base-100/85 backdrop-blur-xl transition-all duration-300">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                {/* Brand Logo */}
                <div className="flex items-center gap-6 lg:gap-8">
                    <Link
                        to="/"
                        className="group flex items-center gap-3"
                        aria-label="ICSN home"
                    >
                        <motion.span
                            whileHover={{ scale: 1.08, rotate: 3 }}
                            whileTap={{ scale: 0.95 }}
                            className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-tr from-primary via-secondary to-accent text-primary-content shadow-md shadow-primary/25"
                        >
                            <FiFilm className="h-5 w-5" />
                        </motion.span>

                        <div className="leading-tight">
                            <p className="font-display text-xl font-extrabold tracking-tight bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                                ICSN
                            </p>
                            <p className="hidden text-[9px] font-bold uppercase tracking-[0.25em] text-base-content/50 sm:block">
                                Infinite Cinema
                            </p>
                        </div>
                    </Link>

                    {/* Desktop Navigation Links */}
                    <nav className="hidden items-center gap-1.5 md:flex">
                        {navLinks.map(({ path, label, icon: Icon, color }) => (
                            <NavLink
                                key={path}
                                to={path}
                                end={path === '/'}
                                className={({ isActive }) =>
                                    `relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200 ${
                                        isActive
                                            ? 'bg-primary/10 text-primary font-bold shadow-xs'
                                            : 'text-base-content/70 hover:bg-base-200/80 hover:text-base-content'
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <Icon className={`h-4 w-4 ${isActive ? color : 'opacity-70'}`} />
                                        <span>{label}</span>
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeNavIndicator"
                                                className="absolute inset-0 rounded-xl border border-primary/20 bg-primary/5 -z-10"
                                                transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                            />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}

                        {/* Enhanced Genres Mega Dropdown */}
                        <div className="relative" ref={genresRef}>
                            <button
                                type="button"
                                onClick={() => setGenresOpen((prev) => !prev)}
                                className={`relative flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all duration-200 ${
                                    currentGenreFilter || genresOpen
                                        ? 'bg-primary/10 text-primary font-bold shadow-xs'
                                        : 'text-base-content/70 hover:bg-base-200/80 hover:text-base-content'
                                }`}
                                aria-haspopup="true"
                                aria-expanded={genresOpen}
                                aria-label="Browse genres menu"
                            >
                                <FiGrid className={`h-4 w-4 ${currentGenreFilter || genresOpen ? 'text-primary' : 'opacity-70'}`} />
                                <span>{currentGenreFilter ? `Genre: ${currentGenreFilter}` : 'Genres'}</span>
                                <motion.span
                                    animate={{ rotate: genresOpen ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <FiChevronDown className="h-3.5 w-3.5" />
                                </motion.span>
                            </button>

                            {/* Dropdown Menu Overlay */}
                            <AnimatePresence>
                                {genresOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.98 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 8, scale: 0.98 }}
                                        transition={{ duration: 0.2, ease: 'easeOut' }}
                                        className="absolute left-0 top-full mt-3 w-[480px] rounded-2xl border border-base-300/80 bg-base-100/95 p-3.5 shadow-2xl backdrop-blur-2xl z-50"
                                        role="menu"
                                    >
                                        <div className="mb-2.5 flex items-center justify-between border-b border-base-300/50 px-2 pb-2">
                                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-base-content/60">
                                                <FiGrid className="h-3.5 w-3.5 text-primary" />
                                                <span>Filter {currentScopeLabel} By Genre</span>
                                            </div>
                                            {currentGenreFilter && (
                                                <Link
                                                    to={location.pathname}
                                                    onClick={() => setGenresOpen(false)}
                                                    className="text-[11px] font-bold text-error hover:underline"
                                                >
                                                    Clear filter
                                                </Link>
                                            )}
                                        </div>

                                        {/* 3-Column Genre Grid */}
                                        <div className="grid grid-cols-3 gap-1.5">
                                            {genres.map((genre) => {
                                                const isActive = currentGenreFilter?.toLowerCase() === genre.name.toLowerCase()
                                                return (
                                                    <Link
                                                        key={genre.id}
                                                        to={getGenrePath(genre.name)}
                                                        onClick={() => setGenresOpen(false)}
                                                        role="menuitem"
                                                        className={`group flex items-center gap-2.5 rounded-xl p-2 transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 ${
                                                            isActive
                                                                ? 'bg-primary/15 border border-primary/40 text-primary'
                                                                : 'hover:bg-base-200/90'
                                                        }`}
                                                    >
                                                        <span
                                                            className={`grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${genre.color} text-white shadow-xs transition-transform duration-200 group-hover:scale-110`}
                                                        >
                                                            <GenreIcon
                                                                iconName={genre.iconName}
                                                                name={genre.name}
                                                                className="h-3.5 w-3.5"
                                                            />
                                                        </span>
                                                        <div className="min-w-0 flex-1 leading-tight">
                                                            <div className="flex items-center justify-between gap-1">
                                                                <p className="truncate text-xs font-semibold text-base-content/85 group-hover:text-primary transition-colors">
                                                                    {genre.name}
                                                                </p>
                                                                {isActive && <FiCheck className="h-3 w-3 text-primary stroke-[3]" />}
                                                            </div>
                                                            <p className="text-[10px] text-base-content/50">
                                                                {genre.count} titles
                                                            </p>
                                                        </div>
                                                    </Link>
                                                )
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </nav>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    {/* Desktop Interactive Search Bar */}
                    <div className="relative hidden sm:block" ref={searchRef}>
                        <form onSubmit={handleSearchSubmit} className="relative">
                            <FiSearch
                                className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors ${
                                    searchFocused ? 'text-primary' : 'text-base-content/40'
                                }`}
                            />
                            <input
                                type="text"
                                value={searchValue}
                                onChange={handleSearchChange}
                                placeholder="Search movies & series..."
                                onFocus={() => setSearchFocused(true)}
                                className="h-9 w-48 rounded-full border border-base-300/80 bg-base-200/50 pl-9 pr-8 text-xs font-medium text-base-content placeholder-base-content/40 transition-all duration-300 focus:w-72 focus:border-primary/60 focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            {searchValue && (
                                <button
                                    type="button"
                                    onClick={handleClearSearch}
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                                    aria-label="Clear search"
                                >
                                    <FiX className="h-3.5 w-3.5" />
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
                                    className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-base-300/80 bg-base-100/98 p-2.5 shadow-2xl backdrop-blur-2xl z-50 space-y-1.5"
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
                                                    <p className="truncate text-xs font-bold text-base-content group-hover:text-primary transition-colors">
                                                        {item.title}
                                                    </p>
                                                    <div className="flex items-center gap-2 text-[10px] text-base-content/60 pt-0.5">
                                                        <span className="font-semibold">{item.year}</span>
                                                        <span>•</span>
                                                        <span className="rounded bg-primary/10 px-1 py-0.2 text-primary font-bold">
                                                            {item.type || 'Movie'}
                                                        </span>
                                                        {item.rating && (
                                                            <span className="flex items-center gap-0.5 text-amber-500 font-bold">
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

                    {/* Mobile Hamburger Toggle */}
                    <button
                        type="button"
                        onClick={() => setMobileMenuOpen((prev) => !prev)}
                        className="btn btn-ghost btn-circle btn-sm md:hidden text-base-content"
                        aria-label="Toggle menu"
                    >
                        {mobileMenuOpen ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
                    </button>
                </div>
            </div>

            {/* Mobile Drawer Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden border-t border-base-300/60 bg-base-100/95 backdrop-blur-xl md:hidden"
                    >
                        <div className="space-y-2 px-4 py-4 max-h-[80vh] overflow-y-auto">
                            {/* Mobile Search */}
                            <div className="relative w-full" ref={mobileSearchRef}>
                                <form onSubmit={handleSearchSubmit} className="relative">
                                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/40" />
                                    <input
                                        type="text"
                                        value={searchValue}
                                        onChange={handleSearchChange}
                                        placeholder="Search movies & series..."
                                        className="h-10 w-full rounded-xl border border-base-300 bg-base-200/50 pl-9 pr-9 text-xs font-medium focus:border-primary focus:outline-none"
                                    />
                                    {searchValue && (
                                        <button
                                            type="button"
                                            onClick={handleClearSearch}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                                            aria-label="Clear mobile search"
                                        >
                                            <FiX className="h-4 w-4" />
                                        </button>
                                    )}
                                </form>

                                {/* Mobile Search Quick Suggestions */}
                                {searchValue.trim().length > 0 && (
                                    <div className="mt-2 rounded-xl border border-base-300/60 bg-base-200/50 p-2 space-y-1">
                                        {searchSuggestions.slice(0, 3).map((item) => (
                                            <Link
                                                key={item.id}
                                                to={`/details/${item.id}`}
                                                onClick={() => setMobileMenuOpen(false)}
                                                className="flex items-center gap-2.5 rounded-lg p-1.5 hover:bg-base-100"
                                            >
                                                <img
                                                    src={item.poster}
                                                    alt={item.title}
                                                    className="h-9 w-7 rounded object-cover"
                                                />
                                                <div className="min-w-0 flex-1 text-xs">
                                                    <p className="font-bold truncate text-base-content">{item.title}</p>
                                                    <p className="text-[10px] text-base-content/50">{item.type} • {item.year}</p>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {navLinks.map(({ path, label, icon: Icon, color }) => (
                                <NavLink
                                    key={path}
                                    to={path}
                                    end={path === '/'}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={({ isActive }) =>
                                        `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all ${
                                            isActive
                                                ? 'bg-primary/10 text-primary font-bold'
                                                : 'text-base-content/80 hover:bg-base-200'
                                        }`
                                    }
                                >
                                    <Icon className={`h-5 w-5 ${color}`} />
                                    <span>{label}</span>
                                </NavLink>
                            ))}

                            {/* Mobile Genres Accordion */}
                            <div className="rounded-xl border border-base-300/50 bg-base-200/30 overflow-hidden">
                                <button
                                    type="button"
                                    onClick={() => setGenresOpen((prev) => !prev)}
                                    className="flex w-full items-center justify-between px-4 py-3 text-sm font-semibold text-base-content/80 hover:bg-base-200 transition-all"
                                    aria-expanded={genresOpen}
                                >
                                    <div className="flex items-center gap-3">
                                        <FiGrid className="h-5 w-5 text-primary" />
                                        <span>Filter {currentScopeLabel} By Genre</span>
                                    </div>
                                    <motion.span
                                        animate={{ rotate: genresOpen ? 180 : 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <FiChevronDown className="h-4 w-4" />
                                    </motion.span>
                                </button>

                                <AnimatePresence>
                                    {genresOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.2 }}
                                            className="border-t border-base-300/50 px-2.5 py-3"
                                        >
                                            <div className="grid grid-cols-2 gap-2">
                                                {genres.map((genre) => {
                                                    const isActive = currentGenreFilter?.toLowerCase() === genre.name.toLowerCase()
                                                    return (
                                                        <Link
                                                            key={genre.id}
                                                            to={getGenrePath(genre.name)}
                                                            onClick={() => {
                                                                setGenresOpen(false)
                                                                setMobileMenuOpen(false)
                                                            }}
                                                            className={`flex items-center gap-2 rounded-xl p-2.5 text-xs font-semibold transition-all ${
                                                                isActive
                                                                    ? 'bg-primary text-primary-content font-bold'
                                                                    : 'bg-base-100 text-base-content/80 hover:bg-primary/10 hover:text-primary'
                                                            }`}
                                                        >
                                                            <span
                                                                className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${genre.color} text-white shadow-xs`}
                                                            >
                                                                <GenreIcon
                                                                    iconName={genre.iconName}
                                                                    name={genre.name}
                                                                    className="h-3.5 w-3.5"
                                                                />
                                                            </span>
                                                            <span className="truncate">{genre.name}</span>
                                                        </Link>
                                                    )
                                                })}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    )
}

export default Navbar