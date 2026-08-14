import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router'
import { FiPlay, FiStar, FiBookmark, FiCheck } from 'react-icons/fi'

const MediaCard = ({ item }) => {
    const [isBookmarked, setIsBookmarked] = useState(false)
    const detailsUrl = `/details/${item.id || item._id}`

    return (
        <motion.article
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-base-300/70 bg-base-200/60 backdrop-blur-sm shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10"
        >
            <Link to={detailsUrl} className="block relative aspect-[2/3] w-full overflow-hidden bg-base-300" aria-label={`View details for ${item.title}`}>
                <img
                    src={item.poster}
                    alt={`${item.title} poster`}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
                    onError={(event) => {
                        event.currentTarget.src =
                            'https://placehold.co/600x900/111827/ffffff?text=ICSN+Cinema'
                    }}
                />

                {/* Dark Vignette Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/10 opacity-80 transition-opacity duration-300 group-hover:opacity-90" />

                {/* Top Badges */}
                <div className="absolute left-3 top-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="rounded-md bg-primary/90 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary-content shadow-xs backdrop-blur-md">
                        {item.type || 'Media'}
                    </span>

                    <motion.button
                        whileHover={{ scale: 1.15 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setIsBookmarked((prev) => !prev)
                        }}
                        className="pointer-events-auto grid h-7 w-7 place-items-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-primary hover:text-primary-content"
                        aria-label={isBookmarked ? 'Remove from watchlist' : 'Add to watchlist'}
                        title={isBookmarked ? 'In Watchlist' : 'Add to Watchlist'}
                    >
                        {isBookmarked ? (
                            <FiCheck className="h-3.5 w-3.5 stroke-[3]" />
                        ) : (
                            <FiBookmark className="h-3.5 w-3.5" />
                        )}
                    </motion.button>
                </div>

                {/* Bottom Overlay Info */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-semibold">
                    <span className="rounded bg-black/50 px-1.5 py-0.5 text-[11px] backdrop-blur-xs">
                        {item.year}
                    </span>

                    <span className="flex items-center gap-1 rounded bg-amber-500/20 px-2 py-0.5 text-amber-300 border border-amber-500/30 backdrop-blur-xs font-bold text-[11px]">
                        <FiStar className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {item.rating ? Number(item.rating).toFixed(1) : 'N/A'}
                    </span>
                </div>

                {/* Hover Play Button */}
                <div
                    className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-primary-content opacity-0 shadow-lg shadow-primary/40 transition duration-300 group-hover:opacity-100"
                    aria-hidden="true"
                >
                    <FiPlay className="ml-0.5 h-5 w-5 fill-current" />
                </div>
            </Link>

            {/* Card Content */}
            <div className="flex flex-1 flex-col justify-between space-y-2 p-3.5">
                <div>
                    <Link to={detailsUrl}>
                        <h3 className="line-clamp-1 font-display text-sm font-bold tracking-tight text-base-content hover:text-primary transition-colors">
                            {item.title}
                        </h3>
                    </Link>

                    {item.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-base-content/60 leading-relaxed">
                            {item.description}
                        </p>
                    )}
                </div>

                {item.genres && item.genres.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                        {item.genres.slice(0, 2).map((genre) => (
                            <Link
                                key={genre}
                                to={`/movies?genre=${encodeURIComponent(genre)}`}
                                className="rounded-md bg-base-300/80 px-2 py-0.5 text-[10px] font-medium text-base-content/75 hover:bg-primary/15 hover:text-primary transition-colors"
                            >
                                {genre}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </motion.article>
    )
}

export default MediaCard