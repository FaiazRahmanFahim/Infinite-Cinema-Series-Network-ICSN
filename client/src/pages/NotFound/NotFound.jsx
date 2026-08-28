import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import {
    FiFilm,
    FiSearch,
    FiHome,
    FiTv,
    FiSmile,
    FiAward,
    FiBookmark,
    FiArrowLeft,
    FiStar,
    FiCompass,
} from 'react-icons/fi'
import { pageVariants, containerVariants, itemVariants } from '../../animations/motionVariants'

const NotFound = () => {
    const navigate = useNavigate()
    const [searchQuery, setSearchQuery] = useState('')
    const [recommended, setRecommended] = useState([])

    useEffect(() => {
        // Fetch top trending / popular items to keep user engaged
        Promise.all([
            fetch('/popularMovies.json').then((r) => r.json()),
            fetch('/popularSeries.json').then((r) => r.json()),
            fetch('/popularAnimation.json').then((r) => r.json()),
        ])
            .then(([movies, series, anim]) => {
                const picks = [
                    movies[0],
                    series[0],
                    anim[0],
                    movies[1] || series[1],
                ].filter(Boolean)
                setRecommended(picks)
            })
            .catch(() => setRecommended([]))
    }, [])

    const handleSearchSubmit = (e) => {
        e.preventDefault()
        if (searchQuery.trim()) {
            navigate(`/browse?search=${encodeURIComponent(searchQuery.trim())}`)
        }
    }

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden px-4 py-16 sm:px-6 lg:px-8 text-base-content"
        >
            {/* Ambient Cinematic Glow Orbs */}
            <div className="pointer-events-none absolute -top-24 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/15 blur-3xl" />
            <div className="pointer-events-none absolute bottom-10 right-10 h-80 w-80 rounded-full bg-accent/10 blur-3xl" />
            <div className="pointer-events-none absolute top-1/3 left-10 h-72 w-72 rounded-full bg-secondary/10 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-3xl text-center space-y-8">
                {/* 404 Cinema Reel Badge */}
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 backdrop-blur-md shadow-sm"
                >
                    <FiFilm className="h-4 w-4 text-primary animate-pulse" />
                    <span className="text-xs font-black uppercase tracking-widest text-primary">
                        Lost Reel // Error 404
                    </span>
                </motion.div>

                {/* Big Glowing 404 Headline */}
                <div className="space-y-3">
                    <h1 className="font-display text-7xl sm:text-9xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-accent to-secondary select-none drop-shadow-sm">
                        404
                    </h1>
                    <h2 className="font-display text-2xl sm:text-4xl font-extrabold tracking-tight text-base-content">
                        Cut! Scene Missing in the Archive
                    </h2>
                    <p className="mx-auto max-w-lg text-sm sm:text-base text-base-content/70">
                        The premiere you are looking for may have been edited out, renamed, or lost in cinema space. Let’s get you back in the director’s chair.
                    </p>
                </div>

                {/* Direct Search Bar on 404 */}
                <motion.form
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                    onSubmit={handleSearchSubmit}
                    className="mx-auto max-w-md"
                >
                    <div className="relative flex items-center">
                        <FiSearch className="absolute left-4 h-4 w-4 text-base-content/40" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search titles, directors, cast..."
                            className="h-12 w-full rounded-2xl border border-base-300 bg-base-200/60 pl-11 pr-24 text-sm font-medium backdrop-blur-md transition-all focus:border-primary focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-inner"
                        />
                        <button
                            type="submit"
                            className="absolute right-1.5 h-9 rounded-xl bg-primary px-4 text-xs font-bold text-primary-content hover:bg-primary/90 transition-colors shadow-xs"
                        >
                            Search
                        </button>
                    </div>
                </motion.form>

                {/* Primary Action Buttons */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.4 }}
                    className="flex flex-wrap items-center justify-center gap-3 pt-2"
                >
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="btn btn-outline btn-sm gap-2 rounded-xl font-bold border-base-300 hover:bg-base-200"
                    >
                        <FiArrowLeft className="h-4 w-4" />
                        <span>Go Back</span>
                    </button>

                    <Link
                        to="/"
                        className="btn btn-primary btn-sm gap-2 rounded-xl font-bold shadow-md shadow-primary/20"
                    >
                        <FiHome className="h-4 w-4" />
                        <span>Home Premiere</span>
                    </Link>

                    <Link
                        to="/browse"
                        className="btn btn-secondary btn-sm gap-2 rounded-xl font-bold text-secondary-content shadow-md shadow-secondary/20"
                    >
                        <FiCompass className="h-4 w-4" />
                        <span>Explore Catalog</span>
                    </Link>

                    <Link
                        to="/watchlist"
                        className="btn btn-ghost btn-sm gap-2 rounded-xl font-semibold text-base-content/80 hover:bg-base-200"
                    >
                        <FiBookmark className="h-4 w-4 text-accent" />
                        <span>Watchlist</span>
                    </Link>
                </motion.div>

                {/* Quick Genre & Category Navigation Pills */}
                <div className="pt-4 border-t border-base-300/60 max-w-xl mx-auto space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider text-base-content/50">
                        Or jump directly into a hub:
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        {[
                            { label: 'Movies', path: '/movies', icon: FiFilm },
                            { label: 'Series', path: '/series', icon: FiTv },
                            { label: 'Animation', path: '/animation', icon: FiSmile },
                            { label: 'VIP Premium', path: '/premium', icon: FiAward },
                        ].map(({ label, path, icon: Icon }) => (
                            <Link
                                key={label}
                                to={path}
                                className="inline-flex items-center gap-1.5 rounded-xl border border-base-300 bg-base-200/40 px-3 py-1.5 text-xs font-semibold text-base-content/80 hover:border-primary/40 hover:text-primary hover:bg-base-200 transition-all"
                            >
                                <Icon className="h-3.5 w-3.5" />
                                <span>{label}</span>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recommended Titles preview */}
                {recommended.length > 0 && (
                    <div className="pt-6 max-w-2xl mx-auto text-left space-y-3">
                        <h3 className="font-display text-sm font-bold text-base-content/70">
                            🍿 You might enjoy these trending titles:
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {recommended.map((item) => (
                                <Link
                                    key={item.id || item._id}
                                    to={`/details/${item.id || item._id}`}
                                    className="group relative flex flex-col overflow-hidden rounded-xl border border-base-300/80 bg-base-200/50 p-2 backdrop-blur-xs transition-all hover:border-primary/50 hover:shadow-md"
                                >
                                    <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg bg-base-300">
                                        <img
                                            src={item.poster}
                                            alt={item.title}
                                            className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                                        />
                                        <span className="absolute bottom-1 right-1 flex items-center gap-0.5 rounded bg-black/80 px-1 py-0.2 text-[9px] font-bold text-amber-400">
                                            <FiStar className="h-2 w-2 fill-amber-400" />
                                            {item.rating}
                                        </span>
                                    </div>
                                    <p className="mt-1.5 line-clamp-1 font-display text-xs font-bold text-base-content group-hover:text-primary transition-colors">
                                        {item.title}
                                    </p>
                                    <span className="text-[10px] text-base-content/50">
                                        {item.year} • {item.type}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    )
}

export default NotFound
