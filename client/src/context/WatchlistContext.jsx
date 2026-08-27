import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiCheckCircle, FiTrash2, FiBookmark, FiX, FiInfo } from 'react-icons/fi'

export const WatchlistContext = createContext(null)

const STORAGE_KEY = 'icsn_watchlist_v1'

// Initial seed titles if local storage is completely empty
const INITIAL_SEED_WATCHLIST = [
    {
        id: 'movie-001',
        title: 'Midnight Horizon',
        type: 'Movie',
        isPremium: true,
        premiumTier: 'VIP 4K UHD',
        videoQuality: '4K Ultra HD • HDR10+',
        audio: 'Dolby Atmos 7.1',
        year: 2026,
        rating: 8.7,
        popularity: 96,
        country: 'United States',
        language: 'English',
        runtime: '2h 49m',
        ageRating: 'PG-13',
        tagline: "Beyond the stars lies humanity's final answer.",
        director: 'Christopher Nolan',
        cast: ['Matthew McConaughey', 'Anne Hathaway', 'Jessica Chastain', 'Michael Caine'],
        genres: ['Sci-Fi', 'Thriller', 'Adventure'],
        poster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80',
        trailerUrl: 'https://www.youtube-nocookie.com/embed/zSWdZVtXT7E?autoplay=1',
        description: 'A deep-space rescue mission discovers a signal from beyond the event horizon that could change humanity forever.',
        status: 'watching',
        addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    },
    {
        id: 'series-001',
        title: 'Cyberpunk: Edgerunners',
        type: 'Series',
        isPremium: false,
        year: 2024,
        rating: 8.9,
        popularity: 94,
        country: 'Japan',
        language: 'Japanese',
        runtime: '10 Episodes',
        ageRating: '18+',
        tagline: 'A street kid trying to survive in a technology and body modification-obsessed city.',
        director: 'Hiroyuki Imaishi',
        cast: ['KENN', 'Aoi Yuuki', 'Hiroki Touchi'],
        genres: ['Animation', 'Action', 'Sci-Fi'],
        poster: 'https://image.tmdb.org/t/p/w500/7jEPnvh6vdzPkWk1ip7vdFfPknE.jpg',
        backdrop: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1600&q=80',
        trailerUrl: 'https://www.youtube-nocookie.com/embed/JtqIas3bYhg?autoplay=1',
        description: 'In a dystopian future, a talented street kid becomes an outlaw mercenary known as an edgerunner after losing everything.',
        status: 'plan_to_watch',
        addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    },
    {
        id: 'movie-007',
        title: 'Dune: Part Two',
        type: 'Movie',
        isPremium: true,
        premiumTier: 'ICSN Premiere Choice',
        videoQuality: 'IMAX Enhanced 4K',
        audio: 'Dolby Atmos',
        year: 2024,
        rating: 8.8,
        popularity: 98,
        country: 'United States',
        language: 'English',
        runtime: '2h 46m',
        ageRating: 'PG-13',
        tagline: 'Long live the fighters.',
        director: 'Denis Villeneuve',
        cast: ['Timothée Chalamet', 'Zendaya', 'Rebecca Ferguson', 'Javier Bardem'],
        genres: ['Sci-Fi', 'Adventure', 'Action'],
        poster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
        backdrop: 'https://images.unsplash.com/photo-1574267496488-744fd5e19808?w=1600&q=80',
        trailerUrl: 'https://www.youtube-nocookie.com/embed/Way9Dexny3w?autoplay=1',
        description: 'Paul Atreides unites with Chani and the Fremen while seeking revenge against the conspirators who destroyed his family.',
        status: 'completed',
        addedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10).toISOString(),
    },
]

export const WatchlistProvider = ({ children }) => {
    const [watchlist, setWatchlist] = useState(() => {
        try {
            const saved = localStorage.getItem(STORAGE_KEY)
            if (saved !== null) {
                return JSON.parse(saved)
            }
            return INITIAL_SEED_WATCHLIST
        } catch (err) {
            console.error('Failed to load watchlist from localStorage:', err)
            return INITIAL_SEED_WATCHLIST
        }
    })

    const [toast, setToast] = useState(null)

    // Synchronize state changes to localStorage
    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist))
        } catch (err) {
            console.error('Failed to save watchlist to localStorage:', err)
        }
    }, [watchlist])

    // Auto-dismiss toast after 3.5s
    useEffect(() => {
        if (!toast) return
        const timer = setTimeout(() => {
            setToast(null)
        }, 3500)
        return () => clearTimeout(timer)
    }, [toast])

    const showToast = useCallback((message, type = 'info', item = null) => {
        setToast({
            id: Date.now(),
            message,
            type,
            item,
        })
    }, [])

    const dismissToast = useCallback(() => {
        setToast(null)
    }, [])

    const isInWatchlist = useCallback(
        (id) => {
            if (!id) return false
            return watchlist.some((item) => String(item.id || item._id) === String(id))
        },
        [watchlist]
    )

    const getItem = useCallback(
        (id) => {
            if (!id) return null
            return watchlist.find((item) => String(item.id || item._id) === String(id)) || null
        },
        [watchlist]
    )

    const addToWatchlist = useCallback(
        (item, status = 'plan_to_watch') => {
            if (!item) return
            const itemId = item.id || item._id
            if (!itemId) return

            setWatchlist((prev) => {
                const exists = prev.some((i) => String(i.id || i._id) === String(itemId))
                if (exists) {
                    showToast(`"${item.title}" is already in your watchlist.`, 'info', item)
                    return prev
                }

                const newItem = {
                    ...item,
                    id: itemId,
                    status: status || 'plan_to_watch',
                    addedAt: new Date().toISOString(),
                }

                showToast(`Added "${item.title}" to Watchlist!`, 'success', newItem)
                return [newItem, ...prev]
            })
        },
        [showToast]
    )

    const removeFromWatchlist = useCallback(
        (id) => {
            if (!id) return
            setWatchlist((prev) => {
                const target = prev.find((item) => String(item.id || item._id) === String(id))
                const filtered = prev.filter((item) => String(item.id || item._id) !== String(id))
                if (target) {
                    showToast(`Removed "${target.title}" from Watchlist.`, 'warning', target)
                }
                return filtered
            })
        },
        [showToast]
    )

    const toggleWatchlist = useCallback(
        (item, defaultStatus = 'plan_to_watch') => {
            if (!item) return
            const itemId = item.id || item._id
            if (!itemId) return

            const currentlyIn = watchlist.some((i) => String(i.id || i._id) === String(itemId))
            if (currentlyIn) {
                removeFromWatchlist(itemId)
            } else {
                addToWatchlist(item, defaultStatus)
            }
        },
        [watchlist, addToWatchlist, removeFromWatchlist]
    )

    const updateItemStatus = useCallback(
        (id, newStatus) => {
            if (!id || !newStatus) return
            setWatchlist((prev) =>
                prev.map((item) => {
                    if (String(item.id || item._id) === String(id)) {
                        return { ...item, status: newStatus }
                    }
                    return item
                })
            )
            showToast('Watch status updated.', 'info')
        },
        [showToast]
    )

    const updateItemRating = useCallback(
        (id, rating) => {
            if (!id) return
            setWatchlist((prev) =>
                prev.map((item) => {
                    if (String(item.id || item._id) === String(id)) {
                        return { ...item, userRating: rating }
                    }
                    return item
                })
            )
            showToast('Rating saved.', 'success')
        },
        [showToast]
    )

    const clearWatchlist = useCallback(() => {
        setWatchlist([])
        showToast('Watchlist has been cleared.', 'info')
    }, [showToast])

    const bulkRemove = useCallback(
        (ids) => {
            if (!Array.isArray(ids) || ids.length === 0) return
            const idSet = new Set(ids.map(String))
            setWatchlist((prev) => prev.filter((item) => !idSet.has(String(item.id || item._id))))
            showToast(`Removed ${ids.length} titles from Watchlist.`, 'info')
        },
        [showToast]
    )

    const bulkUpdateStatus = useCallback(
        (ids, newStatus) => {
            if (!Array.isArray(ids) || ids.length === 0 || !newStatus) return
            const idSet = new Set(ids.map(String))
            setWatchlist((prev) =>
                prev.map((item) => {
                    if (idSet.has(String(item.id || item._id))) {
                        return { ...item, status: newStatus }
                    }
                    return item
                })
            )
            showToast(`Updated status for ${ids.length} titles.`, 'success')
        },
        [showToast]
    )

    const importWatchlist = useCallback(
        (newItems) => {
            if (!Array.isArray(newItems)) return
            setWatchlist((prev) => {
                const map = new Map()
                // Keep new items on top
                for (const item of newItems) {
                    const itemId = item.id || item._id
                    if (itemId) {
                        map.set(String(itemId), {
                            ...item,
                            id: itemId,
                            status: item.status || 'plan_to_watch',
                            addedAt: item.addedAt || new Date().toISOString(),
                        })
                    }
                }
                for (const item of prev) {
                    const itemId = item.id || item._id
                    if (itemId && !map.has(String(itemId))) {
                        map.set(String(itemId), item)
                    }
                }
                return Array.from(map.values())
            })
            showToast(`Imported ${newItems.length} titles successfully!`, 'success')
        },
        [showToast]
    )

    const value = {
        watchlist,
        count: watchlist.length,
        isInWatchlist,
        getItem,
        addToWatchlist,
        removeFromWatchlist,
        toggleWatchlist,
        updateItemStatus,
        updateItemRating,
        clearWatchlist,
        bulkRemove,
        bulkUpdateStatus,
        importWatchlist,
        showToast,
    }

    return (
        <WatchlistContext.Provider value={value}>
            {children}

            {/* Global Interactive Toast Notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 30, scale: 0.92 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                        className="fixed bottom-6 right-6 z-50 flex max-w-sm items-center gap-3 rounded-2xl border border-base-300/80 bg-base-100/95 p-3.5 shadow-2xl backdrop-blur-xl"
                    >
                        {toast.item?.poster ? (
                            <img
                                src={toast.item.poster}
                                alt={toast.item.title || 'Poster'}
                                className="h-11 w-8 rounded-lg object-cover shadow-sm shrink-0"
                            />
                        ) : toast.type === 'success' ? (
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-success/15 text-success">
                                <FiCheckCircle className="h-5 w-5" />
                            </span>
                        ) : toast.type === 'warning' ? (
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-error/15 text-error">
                                <FiTrash2 className="h-5 w-5" />
                            </span>
                        ) : (
                            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/15 text-primary">
                                <FiBookmark className="h-5 w-5" />
                            </span>
                        )}

                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold text-base-content leading-tight">
                                {toast.message}
                            </p>
                            {toast.item?.genres && (
                                <p className="text-[10px] text-base-content/60 truncate mt-0.5">
                                    {toast.item.type} • {toast.item.genres.slice(0, 2).join(', ')}
                                </p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={dismissToast}
                            className="btn btn-ghost btn-circle btn-xs text-base-content/60 hover:text-base-content"
                            aria-label="Dismiss notification"
                        >
                            <FiX className="h-3.5 w-3.5" />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </WatchlistContext.Provider>
    )
}

export const useWatchlist = () => {
    const context = useContext(WatchlistContext)
    if (!context) {
        throw new Error('useWatchlist must be used within a WatchlistProvider')
    }
    return context
}

export default WatchlistProvider
