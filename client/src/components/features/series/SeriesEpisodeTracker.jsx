import { useState, useEffect, useMemo } from 'react'
import { motion } from 'framer-motion'
import {
    FiTv,
    FiCheck,
    FiPlay,
    FiClock,
    FiCalendar,
    FiStar,
    FiRotateCcw,
    FiAward,
} from 'react-icons/fi'
import {
    getSeriesCatalog,
    getSeriesProgress,
    toggleEpisodeWatched,
    markSeasonWatched,
    markEntireSeriesWatched,
    EPISODE_UPDATE_EVENT,
} from '../../../utils/episodeTracker'
import { useWatchlist } from '../../../context/WatchlistContext'

const SeriesEpisodeTracker = ({ seriesItem }) => {
    const seriesId = seriesItem?.id || seriesItem?._id
    const { isInWatchlist, addToWatchlist, updateItemStatus } = useWatchlist()

    const [tick, setTick] = useState(0)
    const [selectedSeason, setSelectedSeason] = useState(1)

    // Listen to reactive update events across app
    useEffect(() => {
        const handleUpdate = () => {
            setTick((t) => t + 1)
        }
        window.addEventListener(EPISODE_UPDATE_EVENT, handleUpdate)
        return () => window.removeEventListener(EPISODE_UPDATE_EVENT, handleUpdate)
    }, [])

    const seasons = useMemo(() => {
        return getSeriesCatalog(seriesItem)
    }, [seriesItem])

    const progress = useMemo(() => {
        void tick
        return getSeriesProgress(seriesId, seriesItem)
    }, [seriesId, seriesItem, tick])

    if (!seriesItem || seasons.length === 0 || !progress) return null

    const currentSeasonObj = seasons.find((s) => s.seasonNumber === selectedSeason) || seasons[0]
    const currentSeasonProgress = progress.seasonProgress.find((s) => s.seasonNumber === selectedSeason)
    const isCurrentSeasonComplete = currentSeasonProgress && currentSeasonProgress.watchedCount === currentSeasonProgress.totalEpisodes

    const handleEpisodeToggle = (seasonNum, epNum) => {
        const nowWatched = toggleEpisodeWatched(seriesId, seriesItem, seasonNum, epNum)
        setTick((t) => t + 1)

        // Auto-sync with Watchlist status
        const updatedProgress = getSeriesProgress(seriesId, seriesItem)
        if (!isInWatchlist(seriesId)) {
            addToWatchlist(seriesItem, 'watching')
        } else {
            if (updatedProgress.isCompleted) {
                updateItemStatus(seriesId, 'completed')
            } else if (nowWatched && updatedProgress.watchedCount > 0) {
                updateItemStatus(seriesId, 'watching')
            }
        }
    }

    const handleMarkSeason = (seasonNum, markAll) => {
        markSeasonWatched(seriesId, seriesItem, seasonNum, markAll)
        setTick((t) => t + 1)

        const updatedProgress = getSeriesProgress(seriesId, seriesItem)
        if (!isInWatchlist(seriesId)) {
            addToWatchlist(seriesItem, 'watching')
        } else if (updatedProgress.isCompleted) {
            updateItemStatus(seriesId, 'completed')
        }
    }

    const handleResetAll = () => {
        markEntireSeriesWatched(seriesId, seriesItem, false)
        setTick((t) => t + 1)
    }

    const handleCompleteAll = () => {
        markEntireSeriesWatched(seriesId, seriesItem, true)
        setTick((t) => t + 1)
        if (isInWatchlist(seriesId)) {
            updateItemStatus(seriesId, 'completed')
        } else {
            addToWatchlist(seriesItem, 'completed')
        }
    }

    return (
        <div className="space-y-8 rounded-3xl border border-base-300/70 bg-base-200/40 p-6 sm:p-8 backdrop-blur-sm shadow-xs">
            {/* Header with Title & Global Progress */}
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between border-b border-base-300/60 pb-6">
                <div>
                    <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/15 text-primary">
                            <FiTv className="h-5 w-5" />
                        </span>
                        <div>
                            <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-base-content">
                                Seasons & Episode Tracker
                            </h2>
                            <p className="text-xs text-base-content/70">
                                Track your viewing progress, check off episodes, and pick up right where you left off.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Progress Overview Pill */}
                <div className="flex flex-wrap items-center gap-4 bg-base-100/90 rounded-2xl border border-base-300/80 p-3 shadow-xs">
                    <div className="space-y-1 min-w-[140px]">
                        <div className="flex justify-between text-xs font-bold">
                            <span className="text-base-content/70">Overall Progress</span>
                            <span className="text-primary">{progress.percentage}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full bg-base-300">
                            <motion.div
                                className="h-full bg-gradient-to-r from-primary to-secondary"
                                initial={{ width: 0 }}
                                animate={{ width: `${progress.percentage}%` }}
                                transition={{ duration: 0.5, ease: 'easeOut' }}
                            />
                        </div>
                        <p className="text-[10px] text-base-content/60 font-medium">
                            {progress.watchedCount} of {progress.totalEpisodes} Episodes Watched
                        </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                        {progress.isCompleted ? (
                            <button
                                type="button"
                                onClick={handleResetAll}
                                className="btn btn-ghost btn-xs gap-1 text-base-content/70 hover:text-warning"
                                title="Reset viewing progress"
                            >
                                <FiRotateCcw className="h-3 w-3" />
                                <span>Reset</span>
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleCompleteAll}
                                className="btn btn-primary btn-xs gap-1 shadow-sm"
                                title="Mark all episodes as watched"
                            >
                                <FiCheck className="h-3 w-3" />
                                <span>Mark All Watched</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Next Up Spotlight Banner (if in progress or unwatched) */}
            {progress.nextEpisode ? (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-r from-primary/15 via-base-100 to-base-100 p-5 shadow-md shadow-primary/5"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-start gap-3.5">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-content shadow-md shadow-primary/30 font-extrabold text-sm">
                                <FiPlay className="h-4 w-4 fill-current translate-x-0.5" />
                            </span>
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="rounded-md bg-primary/20 text-primary border border-primary/30 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
                                        Next Up: {progress.nextEpisode.code}
                                    </span>
                                    <span className="text-xs text-base-content/60 font-medium">
                                        {progress.nextEpisode.runtime}
                                    </span>
                                </div>
                                <h3 className="text-base sm:text-lg font-bold text-base-content mt-1">
                                    {progress.nextEpisode.title}
                                </h3>
                                <p className="text-xs text-base-content/70 line-clamp-1 mt-0.5 max-w-xl">
                                    {progress.nextEpisode.overview}
                                </p>
                            </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                            <button
                                type="button"
                                onClick={() => handleEpisodeToggle(progress.nextEpisode.seasonNumber, progress.nextEpisode.episodeNumber)}
                                className="btn btn-primary btn-sm gap-2 shadow-md shadow-primary/20 font-bold text-xs"
                            >
                                <FiCheck className="h-3.5 w-3.5 stroke-[3]" />
                                <span>Mark as Watched</span>
                            </button>
                        </div>
                    </div>
                </motion.div>
            ) : (
                <div className="flex items-center justify-between gap-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-500 dark:text-emerald-400">
                    <div className="flex items-center gap-3">
                        <FiAward className="h-6 w-6" />
                        <div>
                            <p className="text-sm font-bold">Series Completed! 🏆</p>
                            <p className="text-xs opacity-80">You have watched every single episode of this series.</p>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={handleResetAll}
                        className="btn btn-outline btn-xs gap-1 border-emerald-500/40 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500 hover:text-white"
                    >
                        <FiRotateCcw className="h-3 w-3" />
                        <span>Rewatch Series</span>
                    </button>
                </div>
            )}

            {/* Season Navigation Tabs */}
            <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 scrollbar-none">
                    <div className="flex gap-2">
                        {seasons.map((season) => {
                            const seasonStats = progress.seasonProgress.find((s) => s.seasonNumber === season.seasonNumber)
                            const isSeasonComplete = seasonStats && seasonStats.watchedCount === seasonStats.totalEpisodes && seasonStats.totalEpisodes > 0
                            const isSelected = selectedSeason === season.seasonNumber

                            return (
                                <button
                                    key={season.seasonNumber}
                                    type="button"
                                    onClick={() => setSelectedSeason(season.seasonNumber)}
                                    className={`relative flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all whitespace-nowrap ${
                                        isSelected
                                            ? 'bg-primary text-primary-content shadow-md shadow-primary/25'
                                            : 'bg-base-100/80 border border-base-300/80 text-base-content/80 hover:bg-base-200'
                                    }`}
                                >
                                    <span>{season.title}</span>
                                    {isSeasonComplete ? (
                                        <span className={`inline-flex items-center rounded-full p-0.5 ${isSelected ? 'bg-primary-content text-primary' : 'bg-emerald-500/20 text-emerald-500'}`}>
                                            <FiCheck className="h-3 w-3 stroke-[3]" />
                                        </span>
                                    ) : (
                                        <span className={`text-[10px] font-semibold opacity-75`}>
                                            ({seasonStats?.watchedCount || 0}/{season.episodeCount})
                                        </span>
                                    )}
                                </button>
                            )
                        })}
                    </div>

                    {/* Season-level quick action */}
                    <div className="shrink-0">
                        {isCurrentSeasonComplete ? (
                            <button
                                type="button"
                                onClick={() => handleMarkSeason(selectedSeason, false)}
                                className="btn btn-ghost btn-xs gap-1 text-base-content/70 hover:text-warning"
                            >
                                <FiRotateCcw className="h-3 w-3" />
                                <span>Unmark Season {selectedSeason}</span>
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => handleMarkSeason(selectedSeason, true)}
                                className="btn btn-outline btn-xs gap-1 border-base-300/80 hover:border-primary hover:bg-primary/10 hover:text-primary"
                            >
                                <FiCheck className="h-3 w-3" />
                                <span>Mark Season {selectedSeason} as Watched</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Episodes Grid List for the selected Season */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                    {currentSeasonObj.episodes.map((ep) => {
                        const isWatched = !!progress.watchedMap[ep.id]

                        return (
                            <motion.div
                                key={ep.id}
                                layout
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.2 }}
                                className={`group flex items-start justify-between gap-3.5 rounded-2xl border p-4 transition-all ${
                                    isWatched
                                        ? 'border-emerald-500/30 bg-emerald-500/5 hover:border-emerald-500/50'
                                        : 'border-base-300/80 bg-base-100/90 hover:border-primary/50 hover:bg-base-200/50 hover:shadow-xs'
                                }`}
                            >
                                <div className="space-y-1.5 flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className={`rounded-md px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                                            isWatched
                                                ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                                                : 'bg-base-300 text-base-content/80'
                                        }`}>
                                            {ep.code}
                                        </span>

                                        <span className="flex items-center gap-1 text-[11px] text-base-content/60 font-medium">
                                            <FiClock className="h-3 w-3" />
                                            {ep.runtime}
                                        </span>

                                        <span className="flex items-center gap-1 text-[11px] text-amber-500 font-bold">
                                            <FiStar className="h-3 w-3 fill-current" />
                                            {ep.rating}
                                        </span>

                                        <span className="flex items-center gap-1 text-[11px] text-base-content/50 font-medium hidden sm:inline-flex">
                                            <FiCalendar className="h-3 w-3" />
                                            {ep.airDate}
                                        </span>
                                    </div>

                                    <h4 className={`text-sm font-bold truncate transition-colors ${
                                        isWatched ? 'text-base-content/75 line-through decoration-emerald-500/50' : 'text-base-content group-hover:text-primary'
                                    }`}>
                                        {ep.episodeNumber}. {ep.title}
                                    </h4>

                                    <p className="text-xs text-base-content/65 line-clamp-2 leading-relaxed">
                                        {ep.overview}
                                    </p>
                                </div>

                                {/* Checkmark Toggle Button */}
                                <div className="shrink-0 pt-0.5">
                                    <button
                                        type="button"
                                        onClick={() => handleEpisodeToggle(ep.seasonNumber, ep.episodeNumber)}
                                        aria-label={`Mark episode ${ep.code} as ${isWatched ? 'unwatched' : 'watched'}`}
                                        className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-all ${
                                            isWatched
                                                ? 'border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/30 scale-100'
                                                : 'border-base-300/80 bg-base-200/80 text-base-content/40 hover:border-primary hover:bg-primary/10 hover:text-primary hover:scale-105'
                                        }`}
                                    >
                                        <FiCheck className={`h-4 w-4 stroke-[3] transition-transform ${isWatched ? 'scale-110' : 'scale-90 opacity-60'}`} />
                                    </button>
                                </div>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default SeriesEpisodeTracker
