import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { FiClock, FiStar, FiTrash2, FiX, FiArrowRight, FiPlay } from 'react-icons/fi'
import { getRecentViews, removeRecentView, clearRecentViews } from '../../utils/recentViews'
import { sectionVariants, containerVariants, itemVariants } from '../../animations/motionVariants'

const RecentlyViewedRibbon = ({ maxDisplay = 6, showClear = true }) => {
    const [recentItems, setRecentItems] = useState([])
    const [mounted, setMounted] = useState(false)

    const syncItems = () => {
        setRecentItems(getRecentViews())
    }

    useEffect(() => {
        setMounted(true)
        syncItems()

        const handleUpdate = (e) => {
            if (e.detail) {
                setRecentItems(e.detail)
            } else {
                syncItems()
            }
        }

        window.addEventListener('icsn_recent_views_updated', handleUpdate)
        window.addEventListener('storage', syncItems)

        return () => {
            window.removeEventListener('icsn_recent_views_updated', handleUpdate)
            window.removeEventListener('storage', syncItems)
        }
    }, [])

    if (!mounted || recentItems.length === 0) {
        return null
    }

    const displayedItems = recentItems.slice(0, maxDisplay)

    return (
        <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
            className="w-full py-8 sm:py-10 border-b border-base-300/60 bg-gradient-to-b from-base-200/40 via-base-200/20 to-transparent backdrop-blur-xs transition-colors"
        >
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-5">
                {/* Header Row */}
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2.5">
                        <span className="grid h-8 w-8 place-items-center rounded-xl bg-secondary/15 text-secondary">
                            <FiClock className="h-4 w-4" />
                        </span>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="font-display text-lg sm:text-xl font-bold tracking-tight text-base-content">
                                    Recently Viewed
                                </h2>
                                <span className="rounded-full bg-base-300 px-2 py-0.5 text-[10px] font-bold text-base-content/70">
                                    {recentItems.length}
                                </span>
                            </div>
                            <p className="text-xs text-base-content/60 hidden sm:block">
                                Quick access to titles you recently inspected
                            </p>
                        </div>
                    </div>

                    {showClear && (
                        <button
                            type="button"
                            onClick={clearRecentViews}
                            className="inline-flex items-center gap-1.5 rounded-xl border border-base-300/80 bg-base-100/60 px-2.5 py-1 text-xs font-semibold text-base-content/70 hover:bg-error/10 hover:text-error hover:border-error/30 transition-all duration-200"
                            title="Clear recent viewing history"
                        >
                            <FiTrash2 className="h-3 w-3" />
                            <span className="hidden sm:inline">Clear History</span>
                        </button>
                    )}
                </div>

                {/* Items Grid / Reel */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5 sm:gap-4"
                >
                    <AnimatePresence mode="popLayout">
                        {displayedItems.map((item) => {
                            const itemId = item.id || item._id
                            return (
                                <motion.div
                                    key={itemId}
                                    variants={itemVariants}
                                    layout
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    className="group relative flex flex-col overflow-hidden rounded-2xl border border-base-300/70 bg-base-100/80 backdrop-blur-md shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-secondary/50 hover:shadow-lg hover:shadow-secondary/10"
                                >
                                    {/* Poster */}
                                    <div className="relative aspect-[2/3] w-full overflow-hidden bg-base-300">
                                        <img
                                            src={item.poster}
                                            alt={item.title}
                                            loading="lazy"
                                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-106"
                                            onError={(e) => {
                                                e.currentTarget.src =
                                                    'https://placehold.co/600x900/111827/ffffff?text=ICSN'
                                            }}
                                        />

                                        {/* Overlay gradient */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                                        {/* Top Type Badge */}
                                        <div className="absolute top-2 left-2 flex items-center gap-1">
                                            <span className="rounded bg-black/70 px-1.5 py-0.5 text-[9px] font-extrabold uppercase tracking-wider text-white backdrop-blur-xs">
                                                {item.type || 'Media'}
                                            </span>
                                            {item.isPremium && (
                                                <span className="rounded bg-amber-500/90 px-1.5 py-0.5 text-[9px] font-black text-black">
                                                    VIP
                                                </span>
                                            )}
                                        </div>

                                        {/* Quick Remove Button */}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault()
                                                e.stopPropagation()
                                                removeRecentView(itemId)
                                            }}
                                            className="absolute top-2 right-2 grid h-6 w-6 place-items-center rounded-full bg-black/60 text-white/70 opacity-0 group-hover:opacity-100 hover:bg-error hover:text-white transition-all backdrop-blur-xs shadow-sm"
                                            title="Remove from recently viewed"
                                            aria-label="Remove"
                                        >
                                            <FiX className="h-3 w-3" />
                                        </button>

                                        {/* Bottom Rating & Year */}
                                        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-white text-[10px] font-bold">
                                            <span>{item.year}</span>
                                            {item.rating && (
                                                <span className="flex items-center gap-1 text-amber-400">
                                                    <FiStar className="h-2.5 w-2.5 fill-amber-400" />
                                                    {Number(item.rating).toFixed(1)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Title & Link */}
                                    <div className="p-2.5 flex-1 flex flex-col justify-between space-y-1">
                                        <Link
                                            to={`/details/${itemId}`}
                                            className="line-clamp-1 font-display text-xs font-bold text-base-content hover:text-primary transition-colors"
                                            title={item.title}
                                        >
                                            {item.title}
                                        </Link>

                                        <Link
                                            to={`/details/${itemId}`}
                                            className="inline-flex items-center gap-1 text-[10px] font-semibold text-secondary hover:text-secondary/80 transition-colors pt-0.5"
                                        >
                                            <span>Resume</span>
                                            <FiArrowRight className="h-2.5 w-2.5 transition-transform group-hover:translate-x-0.5" />
                                        </Link>
                                    </div>
                                </motion.div>
                            )
                        })}
                    </AnimatePresence>
                </motion.div>
            </div>
        </motion.section>
    )
}

export default RecentlyViewedRibbon
