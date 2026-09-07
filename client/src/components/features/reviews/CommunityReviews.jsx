import React, { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FiStar,
    FiThumbsUp,
    FiAlertTriangle,
    FiEye,
    FiEyeOff,
    FiEdit3,
    FiTrash2,
    FiMessageSquare,
    FiCheck,
    FiSliders,
    FiAward,
    FiUser,
    FiX,
    FiPlus,
    FiFilter,
} from 'react-icons/fi'
import {
    getReviewsForMedia,
    saveReview,
    deleteReview,
    toggleHelpfulVote,
    getUserVotes,
    getAggregateStats,
} from '../../../utils/reviewsManager'
import { useAuth } from '../../../context/AuthProvider'

const RATING_DESCRIPTIONS = {
    10: 'Masterpiece — An all-time cinematic triumph',
    9: 'Incredible — Exceptional storytelling & craft',
    8: 'Great — Deeply engaging & high quality',
    7: 'Good — Solid entertainment worth watching',
    6: 'Decent — Enjoyable with minor flaws',
    5: 'Average — Mixed feelings throughout',
    4: 'Subpar — Missed potential & weak pacing',
    3: 'Poor — Disappointing execution',
    2: 'Bad — Hard to recommend',
    1: 'Avoid — Complete misfire',
}

const AVAILABLE_TAGS = [
    'Stunning Visuals',
    'Mind-Bending',
    'Masterpiece Direction',
    'Plot Twist',
    'Heart-Wrenching',
    'Must-Watch in 4K',
    'Dolby Atmos Gold',
    'Flawless Acting',
    'Insane Pacing',
]

const CommunityReviews = ({ mediaItem }) => {
    const { user } = useAuth()
    const mediaId = mediaItem?.id || mediaItem?._id

    // Review list state
    const [reviews, setReviews] = useState([])
    const [userVotes, setUserVotes] = useState({})
    const [revealedSpoilers, setRevealedSpoilers] = useState(new Set())

    // Filter & Sort State
    const [sortBy, setSortBy] = useState('helpful') // 'helpful' | 'highest' | 'lowest' | 'newest'
    const [filterSpoiler, setFilterSpoiler] = useState('all') // 'all' | 'clean' | 'spoilers'

    // Review Submission Form State
    const [formOpen, setFormOpen] = useState(false)
    const [formRating, setFormRating] = useState(10)
    const [hoverRating, setHoverRating] = useState(null)
    const [formTitle, setFormTitle] = useState('')
    const [formBody, setFormBody] = useState('')
    const [formHasSpoiler, setFormHasSpoiler] = useState(false)
    const [formSelectedTags, setFormSelectedTags] = useState(['Stunning Visuals'])
    const [formAuthorName, setFormAuthorName] = useState(user?.name || '')
    const [formSuccessMessage, setFormSuccessMessage] = useState(false)

    // Load initial reviews and user vote state
    useEffect(() => {
        if (!mediaId) return
        setReviews(getReviewsForMedia(mediaId))
        setUserVotes(getUserVotes())
    }, [mediaId])

    // Sync author name if user logs in
    useEffect(() => {
        if (user?.name && !formAuthorName) {
            setFormAuthorName(user.name)
        }
    }, [user, formAuthorName])

    // Toggle Tag Selection in Form
    const toggleTag = (tag) => {
        setFormSelectedTags((prev) =>
            prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
        )
    }

    // Toggle Reveal of Individual Spoiler
    const toggleRevealSpoiler = (reviewId) => {
        setRevealedSpoilers((prev) => {
            const next = new Set(prev)
            if (next.has(reviewId)) {
                next.delete(reviewId)
            } else {
                next.add(reviewId)
            }
            return next
        })
    }

    // Handle Helpful Upvote
    const handleVoteHelpful = (reviewId) => {
        const result = toggleHelpfulVote(reviewId)
        setUserVotes((prev) => ({ ...prev, [reviewId]: result.hasVoted }))
        setReviews(getReviewsForMedia(mediaId))
    }

    // Handle Review Deletion
    const handleDelete = (reviewId) => {
        deleteReview(reviewId)
        setReviews(getReviewsForMedia(mediaId))
    }

    // Handle Review Form Submission
    const handleSubmitReview = (e) => {
        e.preventDefault()
        if (!formTitle.trim() || !formBody.trim()) return

        const authorDisplay = formAuthorName.trim() || user?.name || 'Cinephile Critic'

        saveReview({
            mediaId,
            mediaTitle: mediaItem?.title || 'Media',
            mediaPoster: mediaItem?.poster || '',
            author: authorDisplay,
            avatarId: 'cinephile',
            avatarIcon: '🍿',
            avatarBg: 'from-primary to-accent',
            badge: user ? 'Verified Member' : 'Guest Cinephile',
            isCurrentUser: true,
            rating: Number(formRating),
            title: formTitle.trim(),
            body: formBody.trim(),
            hasSpoiler: formHasSpoiler,
            tags: formSelectedTags,
        })

        // Refresh reviews list
        setReviews(getReviewsForMedia(mediaId))

        // Reset form & show feedback
        setFormTitle('')
        setFormBody('')
        setFormHasSpoiler(false)
        setFormSelectedTags(['Stunning Visuals'])
        setFormSuccessMessage(true)

        setTimeout(() => {
            setFormSuccessMessage(false)
            setFormOpen(false)
        }, 1500)
    }

    // Aggregate Stats
    const stats = useMemo(() => {
        return getAggregateStats(mediaId, mediaItem?.rating || 8.5)
    }, [mediaId, mediaItem?.rating, reviews])

    // Filter & Sort Reviews
    const filteredReviews = useMemo(() => {
        return reviews
            .filter((r) => {
                if (filterSpoiler === 'clean' && r.hasSpoiler) return false
                if (filterSpoiler === 'spoilers' && !r.hasSpoiler) return false
                return true
            })
            .sort((a, b) => {
                if (sortBy === 'helpful') {
                    return (b.helpfulCount || 0) - (a.helpfulCount || 0)
                }
                if (sortBy === 'highest') {
                    return Number(b.rating || 0) - Number(a.rating || 0)
                }
                if (sortBy === 'lowest') {
                    return Number(a.rating || 0) - Number(b.rating || 0)
                }
                if (sortBy === 'newest') {
                    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0)
                }
                return 0
            })
    }, [reviews, filterSpoiler, sortBy])

    const activeDisplayRating = hoverRating !== null ? hoverRating : formRating

    return (
        <section className="space-y-6 pt-4">
            {/* Header Title with Action Button */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-base-300/80 pb-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/15 text-primary">
                            <FiMessageSquare className="h-4 w-4" />
                        </span>
                        <h2 className="font-display text-2xl font-black tracking-tight text-base-content">
                            Community Reviews & Ratings
                        </h2>
                    </div>
                    <p className="text-xs text-base-content/60">
                        Cinephile impressions, star ratings, and spoiler-protected discussions.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setFormOpen((prev) => !prev)}
                    className="btn btn-primary btn-sm rounded-xl font-bold gap-2 shadow-md shadow-primary/20 shrink-0 cursor-pointer"
                >
                    <FiEdit3 className="h-4 w-4" />
                    <span>{formOpen ? 'Close Form' : 'Write a Review'}</span>
                </button>
            </div>

            {/* COMMUNITY SCORE BANNER & STAR BREAKDOWN */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 rounded-3xl border border-base-300/80 bg-base-200/40 p-6 sm:p-8 backdrop-blur-md shadow-xs">
                {/* Left: Overall Score Card */}
                <div className="md:col-span-5 flex flex-col items-center justify-center text-center border-b md:border-b-0 md:border-r border-base-300/70 pb-6 md:pb-0 md:pr-6 space-y-2">
                    <span className="text-[11px] font-black uppercase tracking-widest text-primary">
                        Community Consensus Score
                    </span>

                    <div className="flex items-center justify-center gap-2 font-display text-5xl sm:text-6xl font-black text-base-content">
                        <FiStar className="h-10 w-10 sm:h-12 sm:w-12 fill-amber-400 text-amber-400" />
                        <span>{stats.avgRating}</span>
                        <span className="text-xl font-normal text-base-content/40">/10</span>
                    </div>

                    <p className="text-xs font-semibold text-base-content/70">
                        Based on {stats.totalReviews} {stats.totalReviews === 1 ? 'review' : 'reviews'} from ICSN cinephiles
                    </p>

                    <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 mt-1">
                        {Number(stats.avgRating) >= 9.0
                            ? '🏆 Certified Masterpiece'
                            : Number(stats.avgRating) >= 8.0
                            ? '⭐ Highly Acclaimed'
                            : '🍿 Worth Watching'}
                    </span>
                </div>

                {/* Right: Star Distribution Bars */}
                <div className="md:col-span-7 flex flex-col justify-center space-y-2.5">
                    <p className="text-xs font-bold uppercase tracking-wider text-base-content/60">
                        Rating Breakdown
                    </p>

                    {[
                        { label: '10 Stars', count: stats.distribution[10] },
                        { label: '9 Stars', count: stats.distribution[9] },
                        { label: '8 Stars', count: stats.distribution[8] },
                        { label: '7 Stars', count: stats.distribution[7] },
                        { label: '6 Stars & Below', count: stats.distribution[6] + stats.distribution.low },
                    ].map(({ label, count }) => {
                        const percent = stats.totalReviews > 0 ? Math.round((count / stats.totalReviews) * 100) : 0
                        return (
                            <div key={label} className="flex items-center gap-3 text-xs font-semibold">
                                <span className="w-28 text-base-content/70 truncate">{label}</span>
                                <div className="h-2 flex-1 overflow-hidden rounded-full bg-base-300">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${percent}%` }}
                                        transition={{ duration: 0.6 }}
                                        className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                                    />
                                </div>
                                <span className="w-10 text-right text-base-content/50 text-[11px]">
                                    {count}
                                </span>
                            </div>
                        )
                    })}
                </div>
            </div>

            {/* INTERACTIVE REVIEW SUBMISSION FORM */}
            <AnimatePresence>
                {formOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0, scale: 0.98 }}
                        animate={{ opacity: 1, height: 'auto', scale: 1 }}
                        exit={{ opacity: 0, height: 0, scale: 0.98 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                    >
                        <form
                            onSubmit={handleSubmitReview}
                            className="rounded-3xl border-2 border-primary/40 bg-base-100 p-6 sm:p-8 shadow-xl space-y-5"
                        >
                            <div className="flex items-center justify-between border-b border-base-300/80 pb-3">
                                <div>
                                    <h3 className="font-display text-lg font-bold text-base-content">
                                        Write Your Cinephile Review
                                    </h3>
                                    <p className="text-xs text-base-content/60">
                                        Reviewing &ldquo;{mediaItem?.title}&rdquo;
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setFormOpen(false)}
                                    className="btn btn-ghost btn-circle btn-xs text-base-content/60"
                                >
                                    <FiX className="h-4 w-4" />
                                </button>
                            </div>

                            {formSuccessMessage ? (
                                <div className="py-8 text-center space-y-2 text-emerald-500">
                                    <span className="grid h-12 w-12 mx-auto place-items-center rounded-full bg-emerald-500/20 text-2xl font-bold">
                                        ✓
                                    </span>
                                    <h4 className="font-display text-lg font-bold text-base-content">
                                        Review Published Successfully!
                                    </h4>
                                    <p className="text-xs text-base-content/60">
                                        Your rating has been recorded to the community consensus.
                                    </p>
                                </div>
                            ) : (
                                <>
                                    {/* 1 to 10 Star Rating Selector */}
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <label className="text-xs font-bold text-base-content/80">
                                                Your Score ({activeDisplayRating}/10)
                                            </label>
                                            <span className="text-xs font-semibold text-primary">
                                                {RATING_DESCRIPTIONS[activeDisplayRating]}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                                            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => {
                                                const isFilled = star <= activeDisplayRating
                                                return (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setFormRating(star)}
                                                        onMouseEnter={() => setHoverRating(star)}
                                                        onMouseLeave={() => setHoverRating(null)}
                                                        className={`flex flex-col items-center justify-center h-10 w-9 sm:h-11 sm:w-11 rounded-xl border transition-all cursor-pointer ${
                                                            isFilled
                                                                ? 'bg-amber-500/15 border-amber-400 text-amber-500 scale-105 shadow-sm'
                                                                : 'bg-base-200/60 border-base-300 text-base-content/40 hover:bg-base-200'
                                                        }`}
                                                    >
                                                        <FiStar
                                                            className={`h-4 w-4 ${
                                                                isFilled ? 'fill-amber-400 text-amber-400' : ''
                                                            }`}
                                                        />
                                                        <span className="text-[10px] font-bold mt-0.5">{star}</span>
                                                    </button>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Author & Review Title Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-bold text-base-content/70">
                                                Critic Name / Handle
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formAuthorName}
                                                onChange={(e) => setFormAuthorName(e.target.value)}
                                                placeholder={user?.name || 'e.g. Cinema Enthusiast'}
                                                className="h-10 w-full rounded-xl border border-base-300 bg-base-200/50 px-3 text-xs font-semibold focus:border-primary focus:outline-none"
                                            />
                                        </div>

                                        <div className="space-y-1">
                                            <label className="text-[11px] font-bold text-base-content/70">
                                                Review Headline
                                            </label>
                                            <input
                                                type="text"
                                                required
                                                value={formTitle}
                                                onChange={(e) => setFormTitle(e.target.value)}
                                                placeholder="e.g. An awe-inspiring masterclass in modern sci-fi..."
                                                className="h-10 w-full rounded-xl border border-base-300 bg-base-200/50 px-3 text-xs font-semibold focus:border-primary focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    {/* Review Body Textarea */}
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-base-content/70">
                                            Detailed Thoughts & Critique
                                        </label>
                                        <textarea
                                            rows={4}
                                            required
                                            value={formBody}
                                            onChange={(e) => setFormBody(e.target.value)}
                                            placeholder="Share your impressions on the direction, soundtrack, performance, visuals, and pacing..."
                                            className="w-full rounded-xl border border-base-300 bg-base-200/50 p-3 text-xs font-medium focus:border-primary focus:outline-none leading-relaxed"
                                        />
                                    </div>

                                    {/* Spoiler Toggle & Highlight Tag Chips */}
                                    <div className="space-y-3 pt-1">
                                        {/* Spoiler Warning Checkbox */}
                                        <label className="flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={formHasSpoiler}
                                                onChange={(e) => setFormHasSpoiler(e.target.checked)}
                                                className="checkbox checkbox-warning checkbox-sm rounded-md"
                                            />
                                            <div>
                                                <span className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                                                    <FiAlertTriangle className="h-3.5 w-3.5" />
                                                    <span>This review contains major plot spoilers</span>
                                                </span>
                                                <p className="text-[11px] text-base-content/60">
                                                    Will blur the review text with a protective spoiler shield for other viewers.
                                                </p>
                                            </div>
                                        </label>

                                        {/* Tag Highlights */}
                                        <div className="space-y-1.5">
                                            <span className="text-[11px] font-bold text-base-content/70">
                                                Select Highlights (Optional):
                                            </span>
                                            <div className="flex flex-wrap gap-1.5">
                                                {AVAILABLE_TAGS.map((tag) => {
                                                    const isSelected = formSelectedTags.includes(tag)
                                                    return (
                                                        <button
                                                            key={tag}
                                                            type="button"
                                                            onClick={() => toggleTag(tag)}
                                                            className={`rounded-lg px-2.5 py-1 text-[11px] font-semibold transition cursor-pointer ${
                                                                isSelected
                                                                    ? 'bg-primary text-primary-content font-bold shadow-xs'
                                                                    : 'bg-base-200 text-base-content/70 hover:bg-base-300'
                                                            }`}
                                                        >
                                                            {isSelected && '✓ '}
                                                            {tag}
                                                        </button>
                                                    )
                                                })}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-base-300/80">
                                        <button
                                            type="button"
                                            onClick={() => setFormOpen(false)}
                                            className="btn btn-ghost btn-sm rounded-xl font-bold"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-sm rounded-xl font-black gap-1.5 shadow-md shadow-primary/25"
                                        >
                                            <span>Publish Review</span>
                                        </button>
                                    </div>
                                </>
                            )}
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* FILTER & SORT CONTROLS BAR */}
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-base-300/80 bg-base-200/40 p-3.5 backdrop-blur-md">
                {/* Left: Spoiler Filter Tabs */}
                <div className="flex items-center gap-1 rounded-xl bg-base-100 p-1 border border-base-300/70">
                    {[
                        { id: 'all', label: `All (${reviews.length})` },
                        { id: 'clean', label: 'Clean (No Spoilers)' },
                        { id: 'spoilers', label: 'Spoilers Only' },
                    ].map(({ id, label }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setFilterSpoiler(id)}
                            className={`rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                                filterSpoiler === id
                                    ? 'bg-primary text-primary-content shadow-xs'
                                    : 'text-base-content/70 hover:text-base-content'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                {/* Right: Sort Options Dropdown */}
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-base-content/60 hidden sm:inline">Sort:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="select select-bordered select-sm rounded-xl text-xs bg-base-100 font-semibold border-base-300"
                    >
                        <option value="helpful">Most Helpful</option>
                        <option value="highest">Highest Rating (10 → 1)</option>
                        <option value="lowest">Lowest Rating (1 → 10)</option>
                        <option value="newest">Most Recent</option>
                    </select>
                </div>
            </div>

            {/* REVIEWS FEED CARDS LIST */}
            {filteredReviews.length === 0 ? (
                <div className="rounded-3xl border border-dashed border-base-300 p-10 text-center space-y-3">
                    <span className="grid h-12 w-12 mx-auto place-items-center rounded-2xl bg-base-200 text-base-content/60">
                        <FiMessageSquare className="h-6 w-6" />
                    </span>
                    <h4 className="font-display text-base font-bold text-base-content">
                        No community reviews match your current filter
                    </h4>
                    <p className="text-xs text-base-content/60 max-w-sm mx-auto">
                        Be the first cinephile to share your rating and perspective on &ldquo;{mediaItem?.title}&rdquo;.
                    </p>
                    <button
                        type="button"
                        onClick={() => setFormOpen(true)}
                        className="btn btn-primary btn-sm rounded-xl font-bold"
                    >
                        Write First Review
                    </button>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredReviews.map((rev) => {
                        const isRevealed = revealedSpoilers.has(rev.id)
                        const hasUserVoted = Boolean(userVotes[rev.id])

                        return (
                            <motion.article
                                key={rev.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-3xl border border-base-300/80 bg-base-200/40 p-5 sm:p-6 backdrop-blur-md shadow-xs space-y-3.5 transition hover:border-primary/40"
                            >
                                {/* Review Card Header */}
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3">
                                        <span
                                            className={`grid h-10 w-10 place-items-center rounded-2xl text-lg shadow-sm bg-gradient-to-tr ${
                                                rev.avatarBg || 'from-primary to-accent'
                                            } text-primary-content`}
                                        >
                                            {rev.avatarIcon || '🍿'}
                                        </span>

                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="font-display text-sm font-bold text-base-content">
                                                    {rev.author}
                                                </span>
                                                {rev.badge && (
                                                    <span className="rounded bg-primary/10 text-primary border border-primary/20 px-1.5 py-0.2 text-[9px] font-extrabold uppercase tracking-wider">
                                                        {rev.badge}
                                                    </span>
                                                )}
                                            </div>
                                            <span className="text-[10px] text-base-content/50">
                                                {new Date(rev.createdAt).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric',
                                                })}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Star Rating Badge */}
                                    <div className="flex items-center gap-1.5 rounded-xl bg-black/80 border border-amber-400/40 px-3 py-1 font-bold text-amber-400 text-xs shadow-xs">
                                        <FiStar className="h-3.5 w-3.5 fill-amber-400" />
                                        <span>{rev.rating}</span>
                                        <span className="text-[10px] text-gray-400 font-normal">/10</span>
                                    </div>
                                </div>

                                {/* Headline Title */}
                                <h3 className="font-display text-base font-bold text-base-content">
                                    {rev.title}
                                </h3>

                                {/* Review Content Body (with Spoiler Shield if needed) */}
                                {rev.hasSpoiler && !isRevealed ? (
                                    <div className="relative overflow-hidden rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-center space-y-2">
                                        <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-600 dark:text-amber-400">
                                            <FiAlertTriangle className="h-4 w-4" />
                                            <span>SPOILER WARNING</span>
                                        </span>
                                        <p className="text-[11px] text-base-content/70">
                                            This review contains key plot developments and spoilers.
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() => toggleRevealSpoiler(rev.id)}
                                            className="btn btn-xs rounded-xl bg-amber-500 text-black font-extrabold hover:bg-amber-400 gap-1.5 cursor-pointer"
                                        >
                                            <FiEye className="h-3.5 w-3.5" />
                                            <span>Reveal Review</span>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        {rev.hasSpoiler && (
                                            <div className="flex items-center justify-between text-[10px] text-amber-600 dark:text-amber-400 font-bold border-b border-amber-500/20 pb-1">
                                                <span className="flex items-center gap-1">
                                                    <FiAlertTriangle className="h-3 w-3" />
                                                    <span>Spoiler content revealed</span>
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={() => toggleRevealSpoiler(rev.id)}
                                                    className="hover:underline flex items-center gap-1 cursor-pointer"
                                                >
                                                    <FiEyeOff className="h-3 w-3" />
                                                    <span>Hide Spoilers</span>
                                                </button>
                                            </div>
                                        )}
                                        <p className="text-xs sm:text-sm text-base-content/80 leading-relaxed">
                                            {rev.body}
                                        </p>
                                    </div>
                                )}

                                {/* Tag Chips Row */}
                                {rev.tags && rev.tags.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 pt-1">
                                        {rev.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="rounded-md bg-base-300/60 px-2 py-0.5 text-[10px] font-semibold text-base-content/75"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Review Footer: Helpful Button & Actions */}
                                <div className="flex items-center justify-between pt-2 border-t border-base-300/50 text-xs">
                                    <button
                                        type="button"
                                        onClick={() => handleVoteHelpful(rev.id)}
                                        className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                                            hasUserVoted
                                                ? 'bg-primary/20 text-primary border border-primary/40'
                                                : 'bg-base-300/60 text-base-content/70 hover:bg-base-300'
                                        }`}
                                    >
                                        <FiThumbsUp className={`h-3.5 w-3.5 ${hasUserVoted ? 'fill-current' : ''}`} />
                                        <span>Helpful ({rev.helpfulCount || 0})</span>
                                    </button>

                                    {rev.isCurrentUser && (
                                        <button
                                            type="button"
                                            onClick={() => handleDelete(rev.id)}
                                            className="btn btn-ghost btn-xs text-error/80 hover:bg-error/10 hover:text-error gap-1 font-semibold"
                                            title="Delete my review"
                                        >
                                            <FiTrash2 className="h-3 w-3" />
                                            <span>Delete</span>
                                        </button>
                                    )}
                                </div>
                            </motion.article>
                        )
                    })}
                </div>
            )}
        </section>
    )
}

export default CommunityReviews
