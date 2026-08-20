import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FiPlay,
    FiStar,
    FiClock,
    FiCalendar,
    FiArrowLeft,
    FiBookmark,
    FiCheck,
    FiShare2,
    FiX,
    FiFilm,
    FiAward,
    FiZap,
    FiGlobe,
    FiUser,
} from 'react-icons/fi'
import SectionHeader from '../../ui/SectionHeader'
import MediaCard from '../../ui/MediaCard'
import GenreIcon from '../../ui/GenreIcon'
import {
    pageVariants,
    sectionVariants,
    containerVariants,
    itemVariants,
    modalVariants,
    scaleInVariants,
    defaultViewport,
} from '../../../animations/motionVariants'

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
                const [moviesRes, seriesRes, animRes, trendRes] = await Promise.all([
                    fetch('/popularMovies.json').then((r) => r.json()),
                    fetch('/popularSeries.json').then((r) => r.json()),
                    fetch('/popularAnimation.json').then((r) => r.json()),
                    fetch('/trendingContent.json').then((r) => r.json()).catch(() => []),
                ])

                if (!isMounted) return

                const combined = [...moviesRes, ...seriesRes, ...animRes, ...trendRes]
                setAllMedia(combined)

                // Match item by id or normalized title slug
                const found = combined.find(
                    (m) =>
                        m.id === id ||
                        m._id === id ||
                        m.title.toLowerCase().replace(/[^a-z0-9]/g, '-') === id?.toLowerCase()
                )

                setItem(found || null)
            } catch (err) {
                console.error('Failed to load item details:', err)
            } finally {
                if (isMounted) setLoading(false)
            }
        }

        fetchDetails()

        return () => {
            isMounted = false
        }
    }, [id])

    // Scroll to top on new detail page load
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [id])

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: item?.title || 'ICSN Media',
                    text: item?.description || '',
                    url: window.location.href,
                })
            } catch {
                // Ignore cancel
            }
        } else {
            navigator.clipboard.writeText(window.location.href)
            setCopied(true)
            setTimeout(() => setCopied(false), 2500)
        }
    }

    // Filter related media by shared genres or type
    const relatedMedia = allMedia
        .filter((m) => {
            if (!item) return false
            if (m.id === item.id) return false
            const hasSharedGenre = m.genres?.some((g) => item.genres?.includes(g))
            const isSameType = m.type === item.type
            return hasSharedGenre || isSameType
        })
        .slice(0, 6)

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <span className="loading loading-spinner loading-lg text-primary" />
                    <p className="text-sm font-semibold text-base-content/70">
                        Loading cinematic experience...
                    </p>
                </div>
            </div>
        )
    }

    if (!item) {
        return (
            <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-4 text-center">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-base-300 text-base-content/40 mb-4">
                    <FiFilm className="h-8 w-8" />
                </div>
                <h2 className="font-display text-2xl font-bold text-base-content">
                    Title Not Found
                </h2>
                <p className="mt-2 text-sm text-base-content/70">
                    The media you are looking for might have been moved or does not exist in the current catalog.
                </p>
                <div className="mt-6 flex gap-3">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="btn btn-outline btn-sm gap-2"
                    >
                        <FiArrowLeft className="h-4 w-4" />
                        <span>Go Back</span>
                    </button>
                    <Link to="/" className="btn btn-primary btn-sm">
                        Back to Home
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen bg-base-100 pb-20 text-base-content"
        >
            {/* Hero Backdrop Banner */}
            <div className="relative min-h-[520px] w-full overflow-hidden bg-black lg:min-h-[580px]">
                <motion.img
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1.05, opacity: 0.35 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    src={item.backdrop || item.poster}
                    alt={`${item.title} backdrop`}
                    className="h-full w-full object-cover filter blur-[1px]"
                />

                {/* Dark Gradient Overlays for Cinematic Atmosphere */}
                <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-base-100/70 to-black/60" />
                <div className="absolute inset-0 bg-gradient-to-r from-base-100/90 via-base-100/40 to-transparent" />

                {/* Back Button */}
                <div className="absolute top-6 left-4 sm:left-8 z-20">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="group inline-flex items-center gap-2 rounded-full border border-base-300/60 bg-base-100/80 px-4 py-2 text-xs font-bold text-base-content backdrop-blur-xl transition hover:bg-primary hover:text-primary-content hover:border-primary shadow-sm"
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
                            variants={scaleInVariants}
                            initial="hidden"
                            animate="visible"
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
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.15 }}
                            className="flex-1 space-y-4"
                        >
                            {/* Badges & Meta Info Row */}
                            <div className="flex flex-wrap items-center gap-2 text-xs font-bold text-base-content/80">
                                <span className="rounded-md bg-primary px-2.5 py-1 text-[11px] font-extrabold text-primary-content shadow-sm">
                                    {item.type || 'Media'}
                                </span>

                                {item.isPremium && (
                                    <span className="inline-flex items-center gap-1.5 rounded-md bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-1 text-[11px] font-extrabold text-black shadow-sm">
                                        <FiAward className="h-3.5 w-3.5" />
                                        {item.premiumTier || 'VIP Selection'}
                                    </span>
                                )}

                                {item.videoQuality && (
                                    <span className="inline-flex items-center gap-1 rounded-md border border-amber-500/30 bg-base-200/80 px-2.5 py-1 text-[11px] text-amber-400 backdrop-blur-md font-semibold">
                                        <FiZap className="h-3 w-3 text-amber-400" />
                                        {item.videoQuality}
                                    </span>
                                )}

                                {item.audio && (
                                    <span className="rounded-md border border-purple-500/30 bg-base-200/80 px-2.5 py-1 text-[11px] text-purple-400 backdrop-blur-md font-semibold">
                                        {item.audio}
                                    </span>
                                )}

                                {item.country && (
                                    <span className="inline-flex items-center gap-1 rounded-md border border-base-300/80 bg-base-200/80 px-2.5 py-1 text-[11px] backdrop-blur-md">
                                        <FiGlobe className="h-3 w-3 text-secondary" />
                                        {item.country}
                                    </span>
                                )}

                                {item.language && (
                                    <span className="rounded-md border border-base-300/80 bg-base-200/80 px-2.5 py-1 text-[11px] backdrop-blur-md text-base-content/80">
                                        {item.language}
                                    </span>
                                )}

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

                                <span className="flex items-center gap-1 rounded-md bg-black/80 border border-amber-400/50 px-2.5 py-1 text-amber-400 font-extrabold text-xs backdrop-blur-md shadow-sm">
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

                            {/* Genres Row */}
                            {item.genres && item.genres.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 pt-1">
                                    {item.genres.map((genre) => (
                                        <Link
                                            key={genre}
                                            to={`/browse?genre=${encodeURIComponent(genre)}`}
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
                        </motion.div>
                    </div>
                </div>
            </div>

            {/* Overview & Metadata Content Section */}
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-12">
                <motion.div
                    variants={sectionVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={defaultViewport}
                    className="grid grid-cols-1 gap-8 lg:grid-cols-3"
                >
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
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.45 }}
                                className="rounded-3xl border border-base-300/70 bg-base-200/40 p-6 sm:p-8 backdrop-blur-sm shadow-xs space-y-4"
                            >
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
                            </motion.div>
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

                                {item.country && (
                                    <div className="flex justify-between py-1 border-b border-base-300/30">
                                        <span className="font-medium text-base-content/60">Country</span>
                                        <span className="font-bold text-base-content">{item.country}</span>
                                    </div>
                                )}

                                {item.language && (
                                    <div className="flex justify-between py-1 border-b border-base-300/30">
                                        <span className="font-medium text-base-content/60">Language</span>
                                        <span className="font-bold text-base-content">{item.language}</span>
                                    </div>
                                )}

                                <div className="flex justify-between py-1 border-b border-base-300/30">
                                    <span className="font-medium text-base-content/60">Release Year</span>
                                    <span className="font-bold text-base-content">{item.year}</span>
                                </div>

                                {item.popularity && (
                                    <div className="flex justify-between py-1 border-b border-base-300/30">
                                        <span className="font-medium text-base-content/60">Popularity Score</span>
                                        <span className="font-bold text-primary">{item.popularity} / 100</span>
                                    </div>
                                )}

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
                </motion.div>

                {/* Related / Recommended Titles Section */}
                {relatedMedia.length > 0 && (
                    <motion.div
                        variants={sectionVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={defaultViewport}
                        className="space-y-6 pt-6"
                    >
                        <SectionHeader
                            title="Related & Recommended"
                            description={`More ${item.genres?.[0] || 'popular'} titles you might enjoy.`}
                            badge="Recommended"
                            viewAllLink={item.type === 'Series' ? '/series' : '/movies'}
                            viewAllText={`Explore All ${item.type === 'Series' ? 'Series' : 'Movies'}`}
                        />

                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            whileInView="show"
                            viewport={defaultViewport}
                            className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6"
                        >
                            {relatedMedia.map((relItem) => (
                                <motion.div key={relItem.id || relItem._id} variants={itemVariants}>
                                    <MediaCard item={relItem} />
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>
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
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
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
        </motion.div>
    )
}

export default DetailsPage