import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FiArrowLeft,
    FiPlay,
    FiStar,
    FiBookmark,
    FiCheck,
    FiShare2,
    FiClock,
    FiCalendar,
    FiFilm,
    FiUser,
    FiX,
    FiTv,
} from 'react-icons/fi'
import SectionHeader from '../../ui/SectionHeader'
import MediaCard from '../../ui/MediaCard'
import LoadingGrid from '../../ui/LoadingGrid'
import EmptyState from '../../ui/EmptyState'
import GenreIcon from '../../ui/GenreIcon'

const DetailsPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [item, setItem] = useState(null)
    const [allMedia, setAllMedia] = useState([])
    const [loading, setLoading] = useState(true)
    const [trailerModalOpen, setTrailerModalOpen] = useState(false)
    const [isBookmarked, setIsBookmarked] = useState(false)
    const [copied, setCopied] = useState(false)

    useEffect(() => {
        let isMounted = true
        setLoading(true)

        async function fetchDetails() {
            try {
                const [moviesRes, seriesRes, animRes] = await Promise.all([
                    fetch('/popularMovies.json').then((r) => r.json()),
                    fetch('/popularSeries.json').then((r) => r.json()),
                    fetch('/popularAnimation.json').then((r) => r.json()),
                ])

                if (!isMounted) return

                const combined = [...moviesRes, ...seriesRes, ...animRes]
                setAllMedia(combined)

                // Match item by id or normalized title slug
                const found = combined.find(
                    (m) =>
                        m.id === id ||
                        m._id === id ||
                        m.title.toLowerCase().replace(/[^a-z0-9]/g, '-') === id?.toLowerCase()
                )

                setItem(found || null)
                setLoading(false)
            } catch {
                if (isMounted) setLoading(false)
            }
        }

        fetchDetails()
        window.scrollTo({ top: 0, behavior: 'smooth' })

        return () => {
            isMounted = false
        }
    }, [id])

    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        }
    }

    if (loading) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
                <div className="h-96 w-full animate-pulse rounded-3xl bg-base-300" />
                <LoadingGrid count={6} />
            </div>
        )
    }

    if (!item) {
        return (
            <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8 space-y-6">
                <EmptyState message="The requested movie or series could not be found." />
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="btn btn-primary btn-sm gap-2"
                >
                    <FiArrowLeft className="h-4 w-4" />
                    <span>Go Back</span>
                </button>
            </div>
        )
    }

    // Find related media sharing at least 1 genre
    const relatedMedia = allMedia
        .filter(
            (m) =>
                (m.id !== item.id) &&
                m.genres?.some((g) => item.genres?.includes(g))
        )
        .slice(0, 6)

    return (
        <div className="min-h-screen bg-base-100 pb-20 text-base-content">
            {/* Hero Backdrop Banner */}
            <div className="relative min-h-[520px] w-full overflow-hidden bg-black lg:min-h-[580px]">
                <img
                    src={item.backdrop || item.poster}
                    alt={`${item.title} backdrop`}
                    className="h-full w-full object-cover opacity-35 filter blur-[1px] transform scale-105 transition-all duration-700"
                />

                {/* Dark Gradient Overlays for Cinematic Atmosphere */}
                <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-base-100/70 to-black/60" />
                <div className="absolute inset-0 bg-gradient-to-r from-base-100/90 via-base-100/40 to-transparent" />

                {/* Back Button */}
                <div className="absolute top-6 left-4 sm:left-8 z-20">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="group inline-flex items-center gap-2 rounded-full border border-base-300/60 bg-base-100/80 px-4 py-2 text-xs font-bold text-base-content backdrop-blur-xl transition hover:bg-primary hover:text-primary-content hover:border-primary"
                    >
                        <FiArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                        <span>Back</span>
                    </button>
                </div>

                {/* Hero Content Container */}
                <div className="absolute inset-0 flex items-end pb-10">
                    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 sm:px-6 lg:flex-row lg:items-end lg:px-8">
                        {/* Poster Card */}
                        <motion.div
                            initial={{ opacity: 0, y: 30, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.5 }}
                            className="relative hidden aspect-[2/3] w-56 shrink-0 overflow-hidden rounded-2xl border-2 border-base-300/80 bg-base-300 shadow-2xl lg:block"
                        >
                            <img
                                src={item.poster}
                                alt={`${item.title} poster`}
                                className="h-full w-full object-cover"
                            />
                            <div className="absolute top-3 left-3">
                                <span className="rounded-md bg-primary px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-primary-content shadow-md">
                                    {item.type || 'Media'}
                                </span>
                            </div>
                        </motion.div>

                        {/* Title & Metadata Details */}
                        <div className="flex-1 space-y-4">
                            {/* Badges & Meta Info Row */}
                            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-base-content/80">
                                <span className="rounded-md bg-primary px-2.5 py-1 text-[11px] font-extrabold text-primary-content shadow-sm">
                                    {item.type || 'Media'}
                                </span>

                                {item.ageRating && (
                                    <span className="rounded-md border border-base-300/80 bg-base-200/80 px-2 py-0.5 text-[11px] backdrop-blur-md">
                                        {item.ageRating}
                                    </span>
                                )}

                                <span className="flex items-center gap-1 text-base-content/70">
                                    <FiCalendar className="h-3.5 w-3.5" />
                                    {item.year}
                                </span>

                                {item.runtime && (
                                    <span className="flex items-center gap-1 text-base-content/70">
                                        <FiClock className="h-3.5 w-3.5" />
                                        {item.runtime}
                                    </span>
                                )}

                                <span className="flex items-center gap-1 rounded-md bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 text-amber-300 font-extrabold text-xs backdrop-blur-md">
                                    <FiStar className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                    {item.rating ? Number(item.rating).toFixed(1) : 'N/A'}
                                </span>
                            </div>

                            {/* Main Title */}
                            <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-base-content drop-shadow-md">
                                {item.title}
                            </h1>

                            {/* Tagline */}
                            {item.tagline && (
                                <p className="italic text-sm sm:text-base text-primary/90 font-medium">
                                    &ldquo;{item.tagline}&rdquo;
                                </p>
                            )}

                            {/* Genre Badges */}
                            {item.genres && item.genres.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {item.genres.map((genre) => (
                                        <Link
                                            key={genre}
                                            to={`/movies?genre=${encodeURIComponent(genre)}`}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-base-300/80 bg-base-200/70 px-3 py-1 text-xs font-semibold text-base-content/85 backdrop-blur-md hover:border-primary/50 hover:bg-primary/10 hover:text-primary transition-all"
                                        >
                                            <GenreIcon name={genre} className="h-3 w-3" />
                                            <span>{genre}</span>
                                        </Link>
                                    ))}
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap items-center gap-3 pt-3">
                                {item.trailerUrl && (
                                    <motion.button
                                        whileHover={{ scale: 1.03 }}
                                        whileTap={{ scale: 0.97 }}
                                        type="button"
                                        onClick={() => setTrailerModalOpen(true)}
                                        className="btn btn-primary gap-2 text-xs sm:text-sm font-bold shadow-lg shadow-primary/25"
                                    >
                                        <FiPlay className="h-4 w-4 fill-current" />
                                        <span>Watch Trailer</span>
                                    </motion.button>
                                )}

                                <motion.button
                                    whileHover={{ scale: 1.03 }}
                                    whileTap={{ scale: 0.97 }}
                                    type="button"
                                    onClick={() => setIsBookmarked((prev) => !prev)}
                                    className={`btn btn-outline gap-2 text-xs sm:text-sm font-bold border-base-300/80 ${
                                        isBookmarked
                                            ? 'bg-primary text-primary-content border-primary'
                                            : 'bg-base-200/60 hover:bg-base-300'
                                    }`}
                                >
                                    {isBookmarked ? (
                                        <>
                                            <FiCheck className="h-4 w-4 stroke-[3]" />
                                            <span>In Watchlist</span>
                                        </>
                                    ) : (
                                        <>
                                            <FiBookmark className="h-4 w-4" />
                                            <span>Add to Watchlist</span>
                                        </>
                                    )}
                                </motion.button>

                                <button
                                    type="button"
                                    onClick={handleShare}
                                    className="btn btn-ghost btn-circle btn-sm text-base-content/80 hover:text-primary"
                                    title="Share title"
                                    aria-label="Share title"
                                >
                                    <FiShare2 className="h-4 w-4" />
                                </button>
                                {copied && (
                                    <span className="text-xs font-bold text-success animate-fade-in">
                                        Link copied!
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Overview & Metadata Content Section */}
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-12">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Storyline & Overview */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="rounded-3xl border border-base-300/70 bg-base-200/40 p-6 sm:p-8 backdrop-blur-sm shadow-xs space-y-4">
                            <h2 className="font-display text-xl font-bold tracking-tight text-base-content flex items-center gap-2">
                                <FiFilm className="h-5 w-5 text-primary" />
                                <span>Storyline & Overview</span>
                            </h2>
                            <p className="text-sm sm:text-base leading-relaxed text-base-content/80">
                                {item.description}
                            </p>
                        </div>

                        {/* Cast Members */}
                        {item.cast && item.cast.length > 0 && (
                            <div className="rounded-3xl border border-base-300/70 bg-base-200/40 p-6 sm:p-8 backdrop-blur-sm shadow-xs space-y-4">
                                <h3 className="font-display text-lg font-bold tracking-tight text-base-content flex items-center gap-2">
                                    <FiUser className="h-5 w-5 text-secondary" />
                                    <span>Top Cast</span>
                                </h3>
                                <div className="flex flex-wrap gap-2.5">
                                    {item.cast.map((actor) => (
                                        <div
                                            key={actor}
                                            className="flex items-center gap-2 rounded-xl border border-base-300 bg-base-100 px-3.5 py-2 text-xs font-semibold text-base-content shadow-xs"
                                        >
                                            <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/10 text-primary font-bold text-[11px]">
                                                {actor.charAt(0)}
                                            </span>
                                            <span>{actor}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Metadata Quick Panel */}
                    <div className="space-y-4">
                        <div className="rounded-3xl border border-base-300/70 bg-base-200/40 p-6 backdrop-blur-sm shadow-xs space-y-4">
                            <h3 className="font-display text-base font-bold tracking-tight text-base-content border-b border-base-300/60 pb-3">
                                Media Details
                            </h3>

                            <div className="space-y-3 text-xs">
                                {item.director && (
                                    <div className="flex justify-between py-1 border-b border-base-300/30">
                                        <span className="font-medium text-base-content/60">Director</span>
                                        <span className="font-bold text-base-content">{item.director}</span>
                                    </div>
                                )}

                                {item.creator && (
                                    <div className="flex justify-between py-1 border-b border-base-300/30">
                                        <span className="font-medium text-base-content/60">Creator</span>
                                        <span className="font-bold text-base-content">{item.creator}</span>
                                    </div>
                                )}

                                <div className="flex justify-between py-1 border-b border-base-300/30">
                                    <span className="font-medium text-base-content/60">Type</span>
                                    <span className="font-bold text-base-content">{item.type || 'Feature'}</span>
                                </div>

                                <div className="flex justify-between py-1 border-b border-base-300/30">
                                    <span className="font-medium text-base-content/60">Release Year</span>
                                    <span className="font-bold text-base-content">{item.year}</span>
                                </div>

                                {item.runtime && (
                                    <div className="flex justify-between py-1 border-b border-base-300/30">
                                        <span className="font-medium text-base-content/60">Runtime</span>
                                        <span className="font-bold text-base-content">{item.runtime}</span>
                                    </div>
                                )}

                                {item.ageRating && (
                                    <div className="flex justify-between py-1 border-b border-base-300/30">
                                        <span className="font-medium text-base-content/60">Rating</span>
                                        <span className="font-bold text-base-content">{item.ageRating}</span>
                                    </div>
                                )}

                                <div className="flex justify-between py-1">
                                    <span className="font-medium text-base-content/60">Network</span>
                                    <span className="font-bold text-primary">ICSN Original Stream</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related / Recommended Titles Section */}
                {relatedMedia.length > 0 && (
                    <div className="space-y-6 pt-6">
                        <SectionHeader
                            title="Related & Recommended"
                            description={`More ${item.genres?.[0] || 'popular'} titles you might enjoy.`}
                            badge="Recommended"
                            viewAllLink={item.type === 'Series' ? '/series' : '/movies'}
                            viewAllText={`Explore All ${item.type === 'Series' ? 'Series' : 'Movies'}`}
                        />

                        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                            {relatedMedia.map((relItem) => (
                                <MediaCard key={relItem.id || relItem._id} item={relItem} />
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Video Trailer Modal */}
            <AnimatePresence>
                {trailerModalOpen && item.trailerUrl && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
                        onClick={() => setTrailerModalOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-black shadow-2xl"
                        >
                            {/* Modal Header */}
                            <div className="flex items-center justify-between border-b border-white/10 px-5 py-3.5 text-white">
                                <div className="flex items-center gap-2">
                                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary text-primary-content">
                                        <FiPlay className="h-3.5 w-3.5 fill-current" />
                                    </span>
                                    <span className="font-display text-sm font-bold truncate">
                                        {item.title} — Official Trailer
                                    </span>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => setTrailerModalOpen(false)}
                                    className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-white/80 hover:bg-white/20 hover:text-white transition"
                                    aria-label="Close trailer"
                                >
                                    <FiX className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Responsive 16:9 Trailer Video Player */}
                            <div className="relative aspect-video w-full bg-black">
                                <iframe
                                    src={item.trailerUrl}
                                    title={`${item.title} trailer`}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                    className="h-full w-full border-0"
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default DetailsPage