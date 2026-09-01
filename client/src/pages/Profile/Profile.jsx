import { useState, useMemo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FiUser,
    FiMail,
    FiAward,
    FiStar,
    FiClock,
    FiFilm,
    FiTv,
    FiSmile,
    FiCheckCircle,
    FiPlay,
    FiSettings,
    FiEdit3,
    FiLogOut,
    FiShare2,
    FiBookmark,
    FiActivity,
    FiPieChart,
    FiSliders,
    FiShield,
    FiZap,
    FiHeart,
    FiX,
    FiCheck,
    FiTrendingUp,
} from 'react-icons/fi'
import { useAuth } from '../../context/AuthProvider'
import { useWatchlist } from '../../context/WatchlistContext'
import { getRecentViews } from '../../utils/recentViews'
import GenreIcon from '../../components/ui/GenreIcon'
import {
    pageVariants,
    sectionVariants,
    containerVariants,
    itemVariants,
    modalVariants,
} from '../../animations/motionVariants'

const AVATAR_PRESETS = [
    { id: 'director', label: 'Cinema Director', icon: '🎬', bg: 'from-red-600 to-amber-600' },
    { id: 'scifi', label: 'Cosmic Pilot', icon: '🚀', bg: 'from-blue-600 to-indigo-600' },
    { id: 'cyberpunk', label: 'Neon Rebel', icon: '⚡', bg: 'from-fuchsia-600 to-pink-600' },
    { id: 'anime', label: 'Anime Sensei', icon: '🌸', bg: 'from-emerald-600 to-teal-600' },
    { id: 'noir', label: 'Noir Detective', icon: '🕵️', bg: 'from-neutral-700 to-stone-900' },
    { id: 'cinephile', label: 'Master Critic', icon: '🍿', bg: 'from-amber-500 to-yellow-600' },
]

const Profile = () => {
    const { user, logOut } = useAuth()
    const navigate = useNavigate()
    const { watchlist, updateItemStatus } = useWatchlist()

    // Local profile customization state
    const [profileData, setProfileData] = useState(() => {
        try {
            const saved = localStorage.getItem('icsn_user_profile')
            return saved
                ? JSON.parse(saved)
                : {
                      displayName: user?.name || 'Cinema Enthusiast',
                      bio: 'Passionate cinephile exploring 4K masterworks, sci-fi epics, and indie gems.',
                      avatarId: 'director',
                      qualityPref: '4K Ultra HD • HDR10+',
                      audioPref: 'Dolby Atmos 7.1 Surround',
                      autoPlayTrailers: true,
                  }
        } catch {
            return {
                displayName: user?.name || 'Cinema Enthusiast',
                bio: 'Passionate cinephile exploring 4K masterworks, sci-fi epics, and indie gems.',
                avatarId: 'director',
                qualityPref: '4K Ultra HD • HDR10+',
                audioPref: 'Dolby Atmos 7.1 Surround',
                autoPlayTrailers: true,
            }
        }
    })

    const [activeTab, setActiveTab] = useState('analytics') // 'analytics' | 'watching' | 'completed' | 'recent' | 'settings'
    const [editModalOpen, setEditModalOpen] = useState(false)
    const [vipModalOpen, setVipModalOpen] = useState(false)
    const [copiedShare, setCopiedShare] = useState(false)
    const [recentViews, setRecentViews] = useState([])

    // Sync recent views
    useEffect(() => {
        setRecentViews(getRecentViews())
    }, [])

    // Update display name if user logs in with new info
    useEffect(() => {
        if (user?.name && !localStorage.getItem('icsn_user_profile')) {
            setProfileData((prev) => ({ ...prev, displayName: user.name }))
        }
    }, [user])

    const saveProfileChanges = (newData) => {
        setProfileData(newData)
        try {
            localStorage.setItem('icsn_user_profile', JSON.stringify(newData))
        } catch (e) {
            console.error('Failed to persist profile:', e)
        }
        setEditModalOpen(false)
    }

    // Analytics calculations
    const analytics = useMemo(() => {
        const total = watchlist.length
        const completed = watchlist.filter((i) => i.status === 'completed').length
        const watching = watchlist.filter((i) => i.status === 'watching').length
        const planToWatch = watchlist.filter((i) => !i.status || i.status === 'plan_to_watch').length
        const movies = watchlist.filter((i) => (i.type || '').toLowerCase() === 'movie').length
        const series = watchlist.filter((i) => (i.type || '').toLowerCase() === 'series').length
        const animation = watchlist.filter(
            (i) => (i.type || '').toLowerCase() === 'animation' || i.genres?.includes('Animation')
        ).length

        // Total hours estimate
        let totalMinutes = 0
        watchlist.forEach((i) => {
            if (typeof i.runtime === 'string') {
                const hourMatch = i.runtime.match(/(\d+)h/)
                const minMatch = i.runtime.match(/(\d+)m/)
                const epMatch = i.runtime.match(/(\d+)\s*Ep/)
                if (hourMatch) totalMinutes += parseInt(hourMatch[1], 10) * 60
                if (minMatch) totalMinutes += parseInt(minMatch[1], 10)
                if (epMatch) totalMinutes += parseInt(epMatch[1], 10) * 45
            }
        })
        const estHours = Math.floor(totalMinutes / 60)

        // Rating calculation
        const ratedItems = watchlist.filter((i) => i.rating)
        const avgRating =
            ratedItems.length > 0
                ? (ratedItems.reduce((acc, i) => acc + Number(i.rating), 0) / ratedItems.length).toFixed(1)
                : '8.4'

        // Genre Breakdown
        const genreMap = {}
        watchlist.forEach((item) => {
            if (Array.isArray(item.genres)) {
                item.genres.forEach((g) => {
                    genreMap[g] = (genreMap[g] || 0) + 1
                })
            }
        })

        const totalGenreTags = Object.values(genreMap).reduce((a, b) => a + b, 0) || 1
        const topGenres = Object.entries(genreMap)
            .map(([genre, count]) => ({
                genre,
                count,
                percentage: Math.round((count / totalGenreTags) * 100),
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5)

        const completionPercent = total > 0 ? Math.round((completed / total) * 100) : 0

        return {
            total,
            completed,
            watching,
            planToWatch,
            movies,
            series,
            animation,
            estHours,
            avgRating,
            topGenres,
            completionPercent,
        }
    }, [watchlist])

    const currentAvatar = AVATAR_PRESETS.find((a) => a.id === profileData.avatarId) || AVATAR_PRESETS[0]

    const handleLogout = async () => {
        if (logOut) {
            await logOut()
        }
        navigate('/')
    }

    const handleShareProfile = () => {
        navigator.clipboard.writeText(window.location.href)
        setCopiedShare(true)
        setTimeout(() => setCopiedShare(false), 2500)
    }

    // Filtered lists for activity tabs
    const watchingList = useMemo(() => watchlist.filter((i) => i.status === 'watching'), [watchlist])
    const completedList = useMemo(() => watchlist.filter((i) => i.status === 'completed'), [watchlist])
    const planToWatchList = useMemo(
        () => watchlist.filter((i) => !i.status || i.status === 'plan_to_watch'),
        [watchlist]
    )

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen bg-base-100 pb-24 text-base-content"
        >
            {/* Cinematic Hero Header */}
            <section className="relative overflow-hidden border-b border-base-300/80 bg-gradient-to-b from-base-200/90 via-base-100 to-base-100 pt-10 pb-10 sm:pt-14 sm:pb-12">
                {/* Ambient Glow Orbs */}
                <div className="pointer-events-none absolute -top-24 left-1/3 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
                <div className="pointer-events-none absolute top-10 right-10 h-80 w-80 rounded-full bg-secondary/15 blur-3xl" />

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
                    {/* User Profile Card Banner */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-3xl border border-base-300/80 bg-base-200/40 p-6 sm:p-8 backdrop-blur-xl shadow-lg">
                        {/* Left: Avatar & Info */}
                        <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-5 text-center sm:text-left">
                            <div className="relative group">
                                <span
                                    className={`grid h-20 w-20 sm:h-24 sm:w-24 place-items-center rounded-3xl bg-gradient-to-tr ${currentAvatar.bg} text-3xl sm:text-4xl shadow-xl shadow-primary/20 border-2 border-white/20`}
                                >
                                    {currentAvatar.icon}
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setEditModalOpen(true)}
                                    className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-base-100 border border-base-300 text-base-content shadow-md hover:bg-primary hover:text-primary-content transition-colors"
                                    title="Edit Avatar"
                                >
                                    <FiEdit3 className="h-3.5 w-3.5" />
                                </button>
                            </div>

                            <div className="space-y-1.5 max-w-lg">
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                    <h1 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-base-content">
                                        {profileData.displayName}
                                    </h1>
                                    <button
                                        type="button"
                                        onClick={() => setVipModalOpen(true)}
                                        className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-black shadow-sm shadow-amber-500/30 hover:scale-105 transition-transform"
                                    >
                                        <FiZap className="h-3 w-3 fill-current" />
                                        <span>VIP Premiere</span>
                                    </button>
                                </div>

                                <p className="text-xs sm:text-sm text-base-content/70">
                                    {profileData.bio}
                                </p>

                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-1 text-[11px] text-base-content/60 font-medium">
                                    <span className="flex items-center gap-1">
                                        <FiMail className="h-3.5 w-3.5 text-primary" />
                                        {user?.email || 'Guest Cinephile'}
                                    </span>
                                    <span>•</span>
                                    <span className="flex items-center gap-1">
                                        <FiAward className="h-3.5 w-3.5 text-secondary" />
                                        {user ? 'Verified Member' : 'Local Archive Mode'}
                                    </span>
                                    {!user && (
                                        <Link
                                            to="/login"
                                            className="text-primary font-bold hover:underline"
                                        >
                                            (Sign In &rarr;)
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Right: Quick Profile Actions */}
                        <div className="flex flex-wrap items-center gap-2.5 self-center md:self-auto">
                            <button
                                type="button"
                                onClick={() => setEditModalOpen(true)}
                                className="btn btn-outline btn-sm gap-1.5 rounded-xl font-bold border-base-300 hover:bg-base-200"
                            >
                                <FiSettings className="h-4 w-4" />
                                <span>Edit Profile</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleShareProfile}
                                className="btn btn-ghost btn-sm gap-1.5 rounded-xl text-base-content/80 hover:bg-base-200"
                                title="Share Profile URL"
                            >
                                <FiShare2 className="h-4 w-4" />
                                <span>{copiedShare ? 'Copied Link!' : 'Share'}</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="btn btn-ghost btn-sm btn-square text-error/80 hover:bg-error/10 hover:text-error"
                                title="Logout from ICSN"
                                aria-label="Logout"
                            >
                                <FiLogOut className="h-4 w-4" />
                            </button>
                        </div>
                    </div>

                    {/* Metric Stats Cards Row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
                        <div className="rounded-2xl border border-base-300/80 bg-base-200/50 p-4 backdrop-blur-md">
                            <div className="flex items-center justify-between text-base-content/60">
                                <span className="text-[10px] font-bold uppercase tracking-wider">Screen Time</span>
                                <FiClock className="h-4 w-4 text-primary" />
                            </div>
                            <p className="font-display text-2xl font-black text-primary mt-1">
                                ~{analytics.estHours} <span className="text-xs font-normal text-base-content/60">hrs</span>
                            </p>
                            <p className="text-[10px] text-base-content/50 mt-0.5">Estimated watched runtime</p>
                        </div>

                        <div className="rounded-2xl border border-base-300/80 bg-base-200/50 p-4 backdrop-blur-md">
                            <div className="flex items-center justify-between text-base-content/60">
                                <span className="text-[10px] font-bold uppercase tracking-wider">Library Saved</span>
                                <FiBookmark className="h-4 w-4 text-secondary" />
                            </div>
                            <p className="font-display text-2xl font-black text-base-content mt-1">
                                {analytics.total} <span className="text-xs font-normal text-base-content/60">titles</span>
                            </p>
                            <p className="text-[10px] text-base-content/50 mt-0.5">
                                {analytics.movies} Movies • {analytics.series} Series • {analytics.animation} Anime
                            </p>
                        </div>

                        <div className="rounded-2xl border border-base-300/80 bg-base-200/50 p-4 backdrop-blur-md">
                            <div className="flex items-center justify-between text-base-content/60">
                                <span className="text-[10px] font-bold uppercase tracking-wider">Completion</span>
                                <FiCheckCircle className="h-4 w-4 text-emerald-400" />
                            </div>
                            <p className="font-display text-2xl font-black text-emerald-400 mt-1">
                                {analytics.completionPercent}%
                            </p>
                            <p className="text-[10px] text-base-content/50 mt-0.5">
                                {analytics.completed} completed of {analytics.total}
                            </p>
                        </div>

                        <div className="rounded-2xl border border-base-300/80 bg-base-200/50 p-4 backdrop-blur-md">
                            <div className="flex items-center justify-between text-base-content/60">
                                <span className="text-[10px] font-bold uppercase tracking-wider">Taste Rating</span>
                                <FiStar className="h-4 w-4 text-amber-400 fill-amber-400" />
                            </div>
                            <div className="flex items-center gap-1.5 font-display text-2xl font-black text-amber-400 mt-1">
                                <span>★ {analytics.avgRating}</span>
                            </div>
                            <p className="text-[10px] text-base-content/50 mt-0.5">Average IMDb catalog score</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Navigation Tabs Bar */}
            <div className="border-b border-base-300/80 bg-base-100/90 backdrop-blur-md sticky top-16 z-20">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar">
                        {[
                            { id: 'analytics', label: 'Cinema Analytics', icon: FiPieChart },
                            { id: 'watching', label: `In Progress (${analytics.watching})`, icon: FiPlay },
                            { id: 'completed', label: `Completed (${analytics.completed})`, icon: FiCheckCircle },
                            { id: 'recent', label: `Recently Viewed (${recentViews.length})`, icon: FiClock },
                            { id: 'settings', label: 'Playback & Preferences', icon: FiSliders },
                        ].map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setActiveTab(id)}
                                className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all shrink-0 cursor-pointer ${
                                    activeTab === id
                                        ? 'bg-primary text-primary-content shadow-sm shadow-primary/25'
                                        : 'bg-base-200/60 text-base-content/70 hover:bg-base-200 hover:text-base-content'
                                }`}
                            >
                                <Icon className="h-3.5 w-3.5" />
                                <span>{label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tab Content Body */}
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8">
                {/* TAB 1: CINEMA ANALYTICS */}
                {activeTab === 'analytics' && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="space-y-8"
                    >
                        {/* Two Columns: Genre Affinity & Format Ratio */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Top Genres Breakdown */}
                            <div className="rounded-3xl border border-base-300/80 bg-base-200/40 p-6 backdrop-blur-md space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/15 text-primary">
                                            <FiHeart className="h-4 w-4" />
                                        </span>
                                        <h3 className="font-display text-base font-bold text-base-content">
                                            Top Genre Affinity
                                        </h3>
                                    </div>
                                    <span className="text-xs text-base-content/50 font-semibold">
                                        Based on saved library
                                    </span>
                                </div>

                                {analytics.topGenres.length === 0 ? (
                                    <p className="text-xs text-base-content/60 py-4">
                                        Add titles with genres to your watchlist to see your personalized affinity breakdown.
                                    </p>
                                ) : (
                                    <div className="space-y-3 pt-2">
                                        {analytics.topGenres.map(({ genre, count, percentage }) => (
                                            <div key={genre} className="space-y-1.5">
                                                <div className="flex items-center justify-between text-xs font-semibold">
                                                    <div className="flex items-center gap-2">
                                                        <GenreIcon name={genre} className="h-3.5 w-3.5 text-primary" />
                                                        <span className="text-base-content">{genre}</span>
                                                    </div>
                                                    <span className="text-base-content/70">
                                                        {count} {count === 1 ? 'title' : 'titles'} ({percentage}%)
                                                    </span>
                                                </div>
                                                <div className="h-2 w-full overflow-hidden rounded-full bg-base-300">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${percentage}%` }}
                                                        transition={{ duration: 0.8, ease: 'easeOut' }}
                                                        className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Cinema Watch Progress Gauge */}
                            <div className="rounded-3xl border border-base-300/80 bg-base-200/40 p-6 backdrop-blur-md space-y-4 flex flex-col justify-between">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="grid h-8 w-8 place-items-center rounded-xl bg-emerald-500/15 text-emerald-400">
                                            <FiActivity className="h-4 w-4" />
                                        </span>
                                        <h3 className="font-display text-base font-bold text-base-content">
                                            Watchlist Status Ratio
                                        </h3>
                                    </div>
                                    <Link
                                        to="/watchlist"
                                        className="text-xs font-bold text-primary hover:underline"
                                    >
                                        Open Watchlist &rarr;
                                    </Link>
                                </div>

                                <div className="space-y-4 py-2">
                                    <div className="grid grid-cols-3 gap-3 text-center">
                                        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-3">
                                            <span className="text-[10px] font-extrabold uppercase text-emerald-400">Completed</span>
                                            <p className="font-display text-xl font-black text-emerald-400 mt-0.5">{analytics.completed}</p>
                                        </div>
                                        <div className="rounded-2xl bg-amber-500/10 border border-amber-500/20 p-3">
                                            <span className="text-[10px] font-extrabold uppercase text-amber-400">Watching</span>
                                            <p className="font-display text-xl font-black text-amber-400 mt-0.5">{analytics.watching}</p>
                                        </div>
                                        <div className="rounded-2xl bg-blue-500/10 border border-blue-500/20 p-3">
                                            <span className="text-[10px] font-extrabold uppercase text-blue-400">Plan to Watch</span>
                                            <p className="font-display text-xl font-black text-blue-400 mt-0.5">{analytics.planToWatch}</p>
                                        </div>
                                    </div>

                                    {/* Multi-segment Progress bar */}
                                    <div className="space-y-1.5">
                                        <div className="flex h-3 w-full overflow-hidden rounded-full bg-base-300">
                                            {analytics.total > 0 && (
                                                <>
                                                    <div
                                                        style={{ width: `${(analytics.completed / analytics.total) * 100}%` }}
                                                        className="bg-emerald-500 transition-all"
                                                        title={`Completed: ${analytics.completed}`}
                                                    />
                                                    <div
                                                        style={{ width: `${(analytics.watching / analytics.total) * 100}%` }}
                                                        className="bg-amber-500 transition-all"
                                                        title={`Watching: ${analytics.watching}`}
                                                    />
                                                    <div
                                                        style={{ width: `${(analytics.planToWatch / analytics.total) * 100}%` }}
                                                        className="bg-blue-500 transition-all"
                                                        title={`Plan to Watch: ${analytics.planToWatch}`}
                                                    />
                                                </>
                                            )}
                                        </div>
                                        <p className="text-[11px] text-base-content/60 text-right font-medium">
                                            {analytics.completionPercent}% Library Completed
                                        </p>
                                    </div>
                                </div>

                                <div className="rounded-2xl bg-base-100/60 p-3.5 border border-base-300/70 flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <FiShield className="h-4 w-4 text-accent" />
                                        <span className="font-bold text-base-content">ICSN Cinephile Status</span>
                                    </div>
                                    <span className="font-extrabold text-accent">Tier IV Master Member</span>
                                </div>
                            </div>
                        </div>

                        {/* Quick Continue Watching Ribbon inside Analytics */}
                        {watchingList.length > 0 && (
                            <div className="space-y-3 pt-4">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-display text-lg font-bold text-base-content flex items-center gap-2">
                                        <FiPlay className="h-4 w-4 text-amber-400 fill-amber-400" />
                                        <span>Jump Back In (Currently Watching)</span>
                                    </h3>
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('watching')}
                                        className="text-xs font-bold text-primary hover:underline"
                                    >
                                        View All ({watchingList.length}) &rarr;
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
                                    {watchingList.slice(0, 6).map((item) => (
                                        <Link
                                            key={item.id || item._id}
                                            to={`/details/${item.id || item._id}`}
                                            className="group relative flex flex-col overflow-hidden rounded-2xl border border-amber-500/30 bg-base-200/50 p-2 backdrop-blur-xs transition hover:border-amber-400 hover:shadow-lg"
                                        >
                                            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-base-300">
                                                <img
                                                    src={item.poster}
                                                    alt={item.title}
                                                    className="h-full w-full object-cover transition group-hover:scale-105"
                                                />
                                                <span className="absolute bottom-1.5 right-1.5 rounded bg-amber-500 px-1.5 py-0.5 text-[9px] font-black text-black">
                                                    Watching
                                                </span>
                                            </div>
                                            <p className="mt-2 line-clamp-1 font-display text-xs font-bold text-base-content group-hover:text-primary transition-colors">
                                                {item.title}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}

                {/* TAB 2: IN PROGRESS (WATCHING) */}
                {activeTab === 'watching' && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-display text-xl font-bold text-base-content">
                                    Currently Watching ({watchingList.length})
                                </h3>
                                <p className="text-xs text-base-content/60">
                                    Titles you are actively following or mid-way through.
                                </p>
                            </div>
                        </div>

                        {watchingList.length === 0 ? (
                            <div className="rounded-3xl border border-dashed border-base-300 p-12 text-center space-y-3">
                                <span className="grid h-12 w-12 mx-auto place-items-center rounded-2xl bg-amber-500/10 text-amber-400">
                                    <FiPlay className="h-6 w-6" />
                                </span>
                                <h4 className="font-display text-base font-bold text-base-content">No active watching titles</h4>
                                <p className="text-xs text-base-content/60 max-w-sm mx-auto">
                                    When you mark a title as &ldquo;Currently Watching&rdquo; in your library, it will show up here.
                                </p>
                                <Link to="/browse" className="btn btn-primary btn-sm rounded-xl font-bold">
                                    Browse Movies & Series
                                </Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {watchingList.map((item) => {
                                    const itemId = item.id || item._id
                                    return (
                                        <div
                                            key={itemId}
                                            className="group relative flex flex-col overflow-hidden rounded-2xl border border-amber-500/30 bg-base-200/50 p-2.5 backdrop-blur-xs transition hover:border-amber-400 hover:shadow-lg"
                                        >
                                            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-base-300">
                                                <img
                                                    src={item.poster}
                                                    alt={item.title}
                                                    className="h-full w-full object-cover transition group-hover:scale-105"
                                                />
                                                <span className="absolute bottom-1.5 left-1.5 rounded bg-black/80 px-1.5 py-0.5 text-[9px] font-bold text-amber-400">
                                                    ★ {item.rating || '8.5'}
                                                </span>
                                            </div>
                                            <div className="pt-2 flex-1 flex flex-col justify-between space-y-2">
                                                <Link
                                                    to={`/details/${itemId}`}
                                                    className="line-clamp-1 font-display text-xs font-bold text-base-content hover:text-primary transition-colors"
                                                >
                                                    {item.title}
                                                </Link>
                                                <button
                                                    type="button"
                                                    onClick={() => updateItemStatus(itemId, 'completed')}
                                                    className="w-full rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 py-1 text-[10px] font-bold hover:bg-emerald-500/25 transition cursor-pointer"
                                                >
                                                    Mark Completed ✓
                                                </button>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* TAB 3: COMPLETED HALL OF FAME */}
                {activeTab === 'completed' && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-display text-xl font-bold text-base-content">
                                    Completed Hall of Fame ({completedList.length})
                                </h3>
                                <p className="text-xs text-base-content/60">
                                    Masterpieces and seasons you have conquered.
                                </p>
                            </div>
                        </div>

                        {completedList.length === 0 ? (
                            <div className="rounded-3xl border border-dashed border-base-300 p-12 text-center space-y-3">
                                <span className="grid h-12 w-12 mx-auto place-items-center rounded-2xl bg-emerald-500/10 text-emerald-400">
                                    <FiCheckCircle className="h-6 w-6" />
                                </span>
                                <h4 className="font-display text-base font-bold text-base-content">No finished titles yet</h4>
                                <p className="text-xs text-base-content/60 max-w-sm mx-auto">
                                    Mark movies and series as completed as you finish them to build your personal cinema trophy case.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {completedList.map((item) => (
                                    <Link
                                        key={item.id || item._id}
                                        to={`/details/${item.id || item._id}`}
                                        className="group relative flex flex-col overflow-hidden rounded-2xl border border-emerald-500/30 bg-base-200/50 p-2.5 backdrop-blur-xs transition hover:border-emerald-400 hover:shadow-lg"
                                    >
                                        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-base-300">
                                            <img
                                                src={item.poster}
                                                alt={item.title}
                                                className="h-full w-full object-cover transition group-hover:scale-105"
                                            />
                                            <span className="absolute top-1.5 right-1.5 rounded-full bg-emerald-500 p-1 text-black shadow-md">
                                                <FiCheck className="h-3 w-3 stroke-[3]" />
                                            </span>
                                        </div>
                                        <div className="pt-2">
                                            <p className="line-clamp-1 font-display text-xs font-bold text-base-content group-hover:text-primary transition-colors">
                                                {item.title}
                                            </p>
                                            <span className="text-[10px] text-base-content/50">
                                                {item.year} • {item.type}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* TAB 4: RECENTLY VIEWED */}
                {activeTab === 'recent' && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="space-y-4"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-display text-xl font-bold text-base-content">
                                    Recent Viewing Log ({recentViews.length})
                                </h3>
                                <p className="text-xs text-base-content/60">
                                    Titles you inspected across your recent cinema sessions.
                                </p>
                            </div>
                        </div>

                        {recentViews.length === 0 ? (
                            <div className="rounded-3xl border border-dashed border-base-300 p-12 text-center space-y-3">
                                <span className="grid h-12 w-12 mx-auto place-items-center rounded-2xl bg-secondary/10 text-secondary">
                                    <FiClock className="h-6 w-6" />
                                </span>
                                <h4 className="font-display text-base font-bold text-base-content">No recent views recorded</h4>
                                <p className="text-xs text-base-content/60 max-w-sm mx-auto">
                                    Open detail pages to automatically record your browsing session history.
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                {recentViews.map((item) => (
                                    <Link
                                        key={item.id || item._id}
                                        to={`/details/${item.id || item._id}`}
                                        className="group relative flex flex-col overflow-hidden rounded-2xl border border-base-300/80 bg-base-200/50 p-2.5 backdrop-blur-xs transition hover:border-primary/50 hover:shadow-lg"
                                    >
                                        <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-base-300">
                                            <img
                                                src={item.poster}
                                                alt={item.title}
                                                className="h-full w-full object-cover transition group-hover:scale-105"
                                            />
                                            <span className="absolute bottom-1.5 left-1.5 rounded bg-black/80 px-1.5 py-0.5 text-[9px] font-bold text-amber-400">
                                                ★ {item.rating || '8.5'}
                                            </span>
                                        </div>
                                        <div className="pt-2">
                                            <p className="line-clamp-1 font-display text-xs font-bold text-base-content group-hover:text-primary transition-colors">
                                                {item.title}
                                            </p>
                                            <span className="text-[10px] text-base-content/50">
                                                {item.year} • {item.type}
                                            </span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </motion.div>
                )}

                {/* TAB 5: SETTINGS & PLAYBACK PREFERENCES */}
                {activeTab === 'settings' && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="max-w-3xl space-y-6"
                    >
                        <div className="rounded-3xl border border-base-300/80 bg-base-200/40 p-6 backdrop-blur-md space-y-5">
                            <h3 className="font-display text-lg font-bold text-base-content flex items-center gap-2">
                                <FiSliders className="h-4 w-4 text-primary" />
                                <span>Streaming & Playback Preferences</span>
                            </h3>

                            <div className="space-y-4 text-xs">
                                <div className="flex items-center justify-between border-b border-base-300/60 pb-3">
                                    <div>
                                        <p className="font-bold text-base-content">Default Video Quality</p>
                                        <p className="text-[11px] text-base-content/60">
                                            Preferred streaming resolution for master trailers
                                        </p>
                                    </div>
                                    <span className="rounded-lg bg-primary/15 text-primary px-2.5 py-1 font-bold">
                                        {profileData.qualityPref}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between border-b border-base-300/60 pb-3">
                                    <div>
                                        <p className="font-bold text-base-content">Audio Engine</p>
                                        <p className="text-[11px] text-base-content/60">
                                            Surround sound & spatial audio passthrough
                                        </p>
                                    </div>
                                    <span className="rounded-lg bg-secondary/15 text-secondary px-2.5 py-1 font-bold">
                                        {profileData.audioPref}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between pt-1">
                                    <div>
                                        <p className="font-bold text-base-content">Autoplay Trailer Previews</p>
                                        <p className="text-[11px] text-base-content/60">
                                            Automatically start trailer preview in modal
                                        </p>
                                    </div>
                                    <span className="rounded-full bg-emerald-500/20 text-emerald-400 px-2 py-0.5 font-bold text-[10px]">
                                        Enabled
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-base-300/80 bg-base-200/40 p-6 backdrop-blur-md space-y-4">
                            <h3 className="font-display text-base font-bold text-base-content flex items-center gap-2">
                                <FiShield className="h-4 w-4 text-secondary" />
                                <span>Account Security & Data</span>
                            </h3>
                            <p className="text-xs text-base-content/70">
                                Your account is secured with ICSN Token Encryption. Watchlist and viewing logs are automatically backed up locally.
                            </p>
                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setEditModalOpen(true)}
                                    className="btn btn-outline btn-xs rounded-lg font-bold"
                                >
                                    Modify Profile Details
                                </button>
                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="btn btn-error btn-xs rounded-lg font-bold text-error-content"
                                >
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </main>

            {/* EDIT PROFILE MODAL */}
            <AnimatePresence>
                {editModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setEditModalOpen(false)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
                    >
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-md rounded-3xl border border-base-300/90 bg-base-100 p-6 shadow-2xl space-y-5"
                        >
                            <div className="flex items-center justify-between border-b border-base-300/60 pb-3">
                                <h3 className="font-display text-lg font-bold text-base-content">
                                    Edit Cinephile Profile
                                </h3>
                                <button
                                    type="button"
                                    onClick={() => setEditModalOpen(false)}
                                    className="btn btn-ghost btn-circle btn-xs text-base-content/70"
                                >
                                    <FiX className="h-4 w-4" />
                                </button>
                            </div>

                            {/* Avatar Picker */}
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-base-content/70">
                                    Choose Cinema Avatar
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {AVATAR_PRESETS.map((av) => (
                                        <button
                                            key={av.id}
                                            type="button"
                                            onClick={() => setProfileData((p) => ({ ...p, avatarId: av.id }))}
                                            className={`flex flex-col items-center gap-1 rounded-2xl border p-2 text-center transition ${
                                                profileData.avatarId === av.id
                                                    ? 'border-primary bg-primary/10 ring-2 ring-primary/40'
                                                    : 'border-base-300/80 bg-base-200/50 hover:bg-base-200'
                                            }`}
                                        >
                                            <span className="text-2xl">{av.icon}</span>
                                            <span className="text-[10px] font-bold truncate max-w-full">
                                                {av.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Name Input */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-base-content/70">
                                    Display Name
                                </label>
                                <input
                                    type="text"
                                    value={profileData.displayName}
                                    onChange={(e) =>
                                        setProfileData((p) => ({ ...p, displayName: e.target.value }))
                                    }
                                    className="h-10 w-full rounded-xl border border-base-300 bg-base-200/50 px-3 text-xs font-bold focus:border-primary focus:outline-none"
                                />
                            </div>

                            {/* Bio Input */}
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-base-content/70">
                                    Bio / Cinema Motto
                                </label>
                                <textarea
                                    rows={3}
                                    value={profileData.bio}
                                    onChange={(e) => setProfileData((p) => ({ ...p, bio: e.target.value }))}
                                    className="w-full rounded-xl border border-base-300 bg-base-200/50 p-3 text-xs focus:border-primary focus:outline-none"
                                />
                            </div>

                            {/* Modal Actions */}
                            <div className="flex items-center justify-end gap-2 pt-2 border-t border-base-300/60">
                                <button
                                    type="button"
                                    onClick={() => setEditModalOpen(false)}
                                    className="btn btn-ghost btn-sm rounded-xl font-semibold"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => saveProfileChanges(profileData)}
                                    className="btn btn-primary btn-sm rounded-xl font-bold"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* VIP PERKS MODAL */}
            <AnimatePresence>
                {vipModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setVipModalOpen(false)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
                    >
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-md rounded-3xl border border-amber-500/40 bg-gradient-to-b from-base-100 to-base-200 p-6 shadow-2xl space-y-4"
                        >
                            <div className="flex items-center justify-between border-b border-base-300/60 pb-3">
                                <div className="flex items-center gap-2 text-amber-400">
                                    <FiZap className="h-5 w-5 fill-current" />
                                    <h3 className="font-display text-lg font-black text-base-content">
                                        VIP Premiere Pass Active
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setVipModalOpen(false)}
                                    className="btn btn-ghost btn-circle btn-xs text-base-content/70"
                                >
                                    <FiX className="h-4 w-4" />
                                </button>
                            </div>

                            <p className="text-xs text-base-content/70">
                                You have full access to our highest echelon master tier streaming releases:
                            </p>

                            <div className="space-y-2.5 pt-1">
                                {[
                                    { title: '4K Ultra HD & Dolby Vision', desc: 'True uncompressed cinematic fidelity' },
                                    { title: 'Dolby Atmos Spatial Audio', desc: '3D multi-channel immersion' },
                                    { title: 'IMAX Enhanced Aspect Ratios', desc: 'Expanded screen real estate' },
                                    { title: 'Unlimited Cloud Watchlist Sync', desc: 'Instant backup across devices' },
                                ].map((perk) => (
                                    <div
                                        key={perk.title}
                                        className="flex items-start gap-2.5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-2.5"
                                    >
                                        <FiCheck className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs font-bold text-base-content">{perk.title}</p>
                                            <p className="text-[10px] text-base-content/60">{perk.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <Link
                                to="/premium"
                                onClick={() => setVipModalOpen(false)}
                                className="btn w-full bg-gradient-to-r from-amber-500 to-orange-500 font-bold text-black border-0 mt-2"
                            >
                                Explore All VIP Releases &rarr;
                            </Link>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default Profile
