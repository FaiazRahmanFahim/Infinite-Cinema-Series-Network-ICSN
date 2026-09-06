import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FiZap,
    FiClock,
    FiStar,
    FiPlay,
    FiBookmark,
    FiCheck,
    FiRefreshCw,
    FiArrowRight,
    FiArrowLeft,
    FiSliders,
    FiShare2,
    FiAward,
    FiFilm,
    FiTv,
    FiSmile,
    FiX,
    FiInfo,
    FiTrendingUp,
} from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi2'
import {
    MOODS,
    TIME_BUDGETS,
    VIBE_MODIFIERS,
    rankMediaForVibe,
} from '../../utils/moodMatchingEngine'
import { useWatchlist } from '../../context/WatchlistContext'
import GenreIcon from '../../components/ui/GenreIcon'
import {
    pageVariants,
    containerVariants,
    itemVariants,
    modalVariants,
} from '../../animations/motionVariants'

const MoodMatcher = () => {
    const { isInWatchlist, toggleWatchlist } = useWatchlist()

    // Wizard Step: 1 = Mood, 2 = Time, 3 = Modifiers, 4 = Results
    const [step, setStep] = useState(1)

    // User Selections
    const [selectedMood, setSelectedMood] = useState(MOODS[0].id)
    const [selectedTimeBudget, setSelectedTimeBudget] = useState(TIME_BUDGETS[1].id)
    const [selectedModifiers, setSelectedModifiers] = useState(['critically_acclaimed'])

    // Media Catalog
    const [allMedia, setAllMedia] = useState([])
    const [loading, setLoading] = useState(true)

    // Match Results State
    const [matches, setMatches] = useState([])
    const [spotlightIndex, setSpotlightIndex] = useState(0)
    const [activeTrailer, setActiveTrailer] = useState(null)
    const [copiedShare, setCopiedShare] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    // Fetch all media for recommendation pool
    useEffect(() => {
        let isMounted = true
        Promise.all([
            fetch('/popularMovies.json').then((r) => r.json()),
            fetch('/popularSeries.json').then((r) => r.json()),
            fetch('/popularAnimation.json').then((r) => r.json()),
            fetch('/trendingContent.json').then((r) => r.json()).catch(() => []),
        ])
            .then(([movies, series, animation, trending]) => {
                if (!isMounted) return
                const map = new Map()
                for (const item of [...movies, ...series, ...animation, ...trending]) {
                    if (!map.has(item.id)) map.set(item.id, item)
                }
                setAllMedia(Array.from(map.values()))
                setLoading(false)
            })
            .catch((err) => {
                console.error(err)
                if (isMounted) setLoading(false)
            })

        return () => {
            isMounted = false
        }
    }, [])

    // Toggle Vibe Modifier Checkbox
    const toggleModifier = (id) => {
        setSelectedModifiers((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        )
    }

    // Execute Smart Recommendation Matching
    const handleGenerateMatch = () => {
        setIsAnalyzing(true)
        setStep(4)
        window.scrollTo({ top: 0, behavior: 'smooth' })

        setTimeout(() => {
            const ranked = rankMediaForVibe(allMedia, {
                moodId: selectedMood,
                timeBudgetId: selectedTimeBudget,
                selectedModifiers,
            })
            setMatches(ranked)
            setSpotlightIndex(0)
            setIsAnalyzing(false)
        }, 650)
    }

    // Roll Again (Cycle through top 5 ranked matches)
    const handleRollAgain = () => {
        if (matches.length <= 1) return
        setSpotlightIndex((prev) => (prev + 1) % Math.min(matches.length, 5))
    }

    // Current Spotlight Item
    const currentSpotlight = matches[spotlightIndex] || matches[0]
    const runnerUps = useMemo(() => {
        if (matches.length <= 1) return []
        return matches.filter((_, idx) => idx !== spotlightIndex).slice(0, 4)
    }, [matches, spotlightIndex])

    const activeMoodObj = MOODS.find((m) => m.id === selectedMood) || MOODS[0]
    const activeTimeObj = TIME_BUDGETS.find((t) => t.id === selectedTimeBudget) || TIME_BUDGETS[1]

    const handleShareMatch = () => {
        if (!currentSpotlight) return
        const text = `🍿 ICSN Mood Matcher recommended "${currentSpotlight.title}" (${currentSpotlight.year}) with a ${currentSpotlight.matchScore}% Vibe Match for me tonight!`
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
            setCopiedShare(true)
            setTimeout(() => setCopiedShare(false), 2500)
        }
    }

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen bg-base-100 pb-24 text-base-content"
        >
            {/* HERO HEADER */}
            <section className="relative overflow-hidden border-b border-base-300 bg-gradient-to-b from-base-200/90 via-base-100 to-base-100 py-10 sm:py-14 text-center">
                {/* Ambient Glow */}
                <div className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full bg-gradient-to-tr from-primary/20 via-secondary/20 to-accent/20 blur-3xl" />

                <div className="mx-auto max-w-4xl px-4 sm:px-6 relative z-10 space-y-3">
                    <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-black uppercase tracking-wider text-primary shadow-xs">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                        </span>
                        <span>AI-Powered Cinema Matcher</span>
                    </div>

                    <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-base-content">
                        What Should You Watch Tonight?
                    </h1>

                    <p className="text-xs sm:text-sm md:text-base text-base-content/70 max-w-xl mx-auto">
                        Tell us your current mood, time window, and cinematic cravings. We&apos;ll calculate your algorithmic match score in seconds.
                    </p>

                    {/* Multi-Step Indicator Bar */}
                    <div className="pt-4 flex items-center justify-center gap-2 sm:gap-4 max-w-md mx-auto">
                        {[
                            { stepNum: 1, label: 'Mood' },
                            { stepNum: 2, label: 'Time' },
                            { stepNum: 3, label: 'Vibe' },
                            { stepNum: 4, label: 'Match' },
                        ].map(({ stepNum, label }) => (
                            <button
                                key={stepNum}
                                type="button"
                                onClick={() => {
                                    if (stepNum < step || (stepNum === 4 && matches.length > 0)) {
                                        setStep(stepNum)
                                    }
                                }}
                                className={`flex items-center gap-2 transition-all cursor-pointer ${
                                    step === stepNum
                                        ? 'text-primary font-black scale-105'
                                        : step > stepNum
                                        ? 'text-emerald-500 font-bold'
                                        : 'text-base-content/40 font-semibold'
                                }`}
                            >
                                <span
                                    className={`grid h-7 w-7 place-items-center rounded-full text-xs font-black transition-all ${
                                        step === stepNum
                                            ? 'bg-primary text-primary-content shadow-md shadow-primary/30 ring-2 ring-primary/40'
                                            : step > stepNum
                                            ? 'bg-emerald-500 text-black'
                                            : 'bg-base-200 border border-base-300 text-base-content/60'
                                    }`}
                                >
                                    {step > stepNum ? '✓' : stepNum}
                                </span>
                                <span className="text-xs hidden sm:inline">{label}</span>
                                {stepNum < 4 && (
                                    <span className="h-0.5 w-4 sm:w-6 bg-base-300 hidden sm:inline-block" />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* WIZARD INTERACTIVE BODY */}
            <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-8">
                {/* STEP 1: MOOD SELECTOR */}
                {step === 1 && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="space-y-6"
                    >
                        <div className="text-center space-y-1">
                            <span className="text-xs font-bold text-primary uppercase tracking-widest">
                                Step 1 of 3
                            </span>
                            <h2 className="font-display text-2xl font-black text-base-content">
                                Choose Your Desired Mood & Energy
                            </h2>
                            <p className="text-xs text-base-content/60">
                                How do you want this film or series to make you feel tonight?
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                            {MOODS.map((m) => {
                                const isSelected = selectedMood === m.id
                                return (
                                    <motion.button
                                        key={m.id}
                                        type="button"
                                        whileHover={{ scale: 1.025, y: -4 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedMood(m.id)}
                                        className={`group relative flex flex-col justify-between rounded-3xl border p-5 text-left transition-all backdrop-blur-md cursor-pointer ${
                                            isSelected
                                                ? `bg-base-200/90 ${m.borderColor} ring-2 ring-primary/40 shadow-xl shadow-primary/10`
                                                : 'bg-base-200/40 border-base-300/80 hover:bg-base-200 hover:border-base-300'
                                        }`}
                                    >
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span
                                                    className={`grid h-12 w-12 place-items-center rounded-2xl text-2xl shadow-md bg-gradient-to-tr ${m.gradient}`}
                                                >
                                                    {m.icon}
                                                </span>
                                                <div
                                                    className={`grid h-6 w-6 place-items-center rounded-full border transition-all ${
                                                        isSelected
                                                            ? 'bg-primary border-primary text-primary-content shadow-xs'
                                                            : 'border-base-300 bg-base-100/60'
                                                    }`}
                                                >
                                                    {isSelected && <FiCheck className="h-3.5 w-3.5 stroke-[3]" />}
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="font-display text-base font-bold text-base-content group-hover:text-primary transition-colors">
                                                    {m.title}
                                                </h3>
                                                <p className="text-xs text-base-content/65 mt-1 leading-relaxed">
                                                    {m.subtitle}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-1.5 pt-4">
                                            {m.genres.map((g) => (
                                                <span
                                                    key={g}
                                                    className="inline-flex items-center gap-1 rounded-lg bg-base-300/70 px-2 py-0.5 text-[10px] font-bold text-base-content/80"
                                                >
                                                    <GenreIcon name={g} className="h-2.5 w-2.5 text-primary" />
                                                    <span>{g}</span>
                                                </span>
                                            ))}
                                        </div>
                                    </motion.button>
                                )
                            })}
                        </div>

                        {/* Step Navigation Bar */}
                        <div className="flex items-center justify-end pt-6 border-t border-base-300/60">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="btn btn-primary rounded-2xl px-6 font-black gap-2 shadow-lg shadow-primary/25 cursor-pointer"
                            >
                                <span>Continue: Time Window</span>
                                <FiArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* STEP 2: TIME BUDGET SELECTOR */}
                {step === 2 && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="space-y-6"
                    >
                        <div className="text-center space-y-1">
                            <span className="text-xs font-bold text-primary uppercase tracking-widest">
                                Step 2 of 3
                            </span>
                            <h2 className="font-display text-2xl font-black text-base-content">
                                What&apos;s Your Time Budget?
                            </h2>
                            <p className="text-xs text-base-content/60">
                                How much time are you looking to invest in your watch session?
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                            {TIME_BUDGETS.map((t) => {
                                const isSelected = selectedTimeBudget === t.id
                                return (
                                    <motion.button
                                        key={t.id}
                                        type="button"
                                        whileHover={{ scale: 1.025, y: -4 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => setSelectedTimeBudget(t.id)}
                                        className={`group relative flex flex-col justify-between rounded-3xl border p-5 text-left transition-all backdrop-blur-md cursor-pointer ${
                                            isSelected
                                                ? 'bg-base-200/90 border-primary ring-2 ring-primary/40 shadow-xl shadow-primary/10'
                                                : 'bg-base-200/40 border-base-300/80 hover:bg-base-200 hover:border-base-300'
                                        }`}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/15 text-2xl shadow-xs">
                                                {t.icon}
                                            </span>
                                            <div
                                                className={`grid h-6 w-6 place-items-center rounded-full border transition-all ${
                                                    isSelected
                                                        ? 'bg-primary border-primary text-primary-content shadow-xs'
                                                        : 'border-base-300 bg-base-100/60'
                                                }`}
                                            >
                                                {isSelected && <FiCheck className="h-3.5 w-3.5 stroke-[3]" />}
                                            </div>
                                        </div>

                                        <div className="pt-4">
                                            <h3 className="font-display text-base font-bold text-base-content group-hover:text-primary transition-colors">
                                                {t.title}
                                            </h3>
                                            <p className="text-xs text-base-content/65 mt-1 leading-relaxed">
                                                {t.subtitle}
                                            </p>
                                        </div>
                                    </motion.button>
                                )
                            })}
                        </div>

                        {/* Step Navigation Bar */}
                        <div className="flex items-center justify-between pt-6 border-t border-base-300/60">
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="btn btn-outline border-base-300 rounded-2xl px-5 font-bold gap-2 hover:bg-base-200"
                            >
                                <FiArrowLeft className="h-4 w-4" />
                                <span>Back</span>
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep(3)}
                                className="btn btn-primary rounded-2xl px-6 font-black gap-2 shadow-lg shadow-primary/25 cursor-pointer"
                            >
                                <span>Continue: Vibe Modifiers</span>
                                <FiArrowRight className="h-4 w-4" />
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* STEP 3: VIBE MODIFIERS */}
                {step === 3 && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="space-y-6"
                    >
                        <div className="text-center space-y-1">
                            <span className="text-xs font-bold text-primary uppercase tracking-widest">
                                Step 3 of 3
                            </span>
                            <h2 className="font-display text-2xl font-black text-base-content">
                                Fine-Tune Your Cinematic Vibe
                            </h2>
                            <p className="text-xs text-base-content/60">
                                Select any bonus criteria to calibrate your match scoring algorithm.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2 max-w-3xl mx-auto">
                            {VIBE_MODIFIERS.map((mod) => {
                                const isChecked = selectedModifiers.includes(mod.id)
                                return (
                                    <div
                                        key={mod.id}
                                        onClick={() => toggleModifier(mod.id)}
                                        className={`flex items-start gap-3.5 rounded-2xl border p-4 transition-all cursor-pointer backdrop-blur-md ${
                                            isChecked
                                                ? 'bg-primary/10 border-primary/50 shadow-md shadow-primary/10'
                                                : 'bg-base-200/40 border-base-300/80 hover:bg-base-200'
                                        }`}
                                    >
                                        <div
                                            className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg border transition-all mt-0.5 ${
                                                isChecked
                                                    ? 'bg-primary border-primary text-primary-content shadow-xs'
                                                    : 'border-base-300 bg-base-100/60'
                                            }`}
                                        >
                                            {isChecked && <FiCheck className="h-3.5 w-3.5 stroke-[3]" />}
                                        </div>

                                        <div className="space-y-0.5">
                                            <p className="text-sm font-bold text-base-content">
                                                {mod.label}
                                            </p>
                                            <p className="text-xs text-base-content/60 leading-relaxed">
                                                {mod.desc}
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Summary Pill Preview */}
                        <div className="rounded-2xl border border-base-300/80 bg-base-200/30 p-4 text-center max-w-xl mx-auto space-y-2">
                            <span className="text-[11px] font-bold uppercase tracking-wider text-base-content/50">
                                Selected Matching Profile:
                            </span>
                            <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold">
                                <span className="rounded-lg bg-primary/20 text-primary px-2.5 py-1">
                                    {activeMoodObj.icon} {activeMoodObj.title}
                                </span>
                                <span>•</span>
                                <span className="rounded-lg bg-secondary/20 text-secondary px-2.5 py-1">
                                    {activeTimeObj.icon} {activeTimeObj.title}
                                </span>
                            </div>
                        </div>

                        {/* Step Navigation Bar */}
                        <div className="flex items-center justify-between pt-6 border-t border-base-300/60">
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="btn btn-outline border-base-300 rounded-2xl px-5 font-bold gap-2 hover:bg-base-200"
                            >
                                <FiArrowLeft className="h-4 w-4" />
                                <span>Back</span>
                            </button>

                            <button
                                type="button"
                                onClick={handleGenerateMatch}
                                className="btn btn-primary rounded-2xl px-8 font-black gap-2 shadow-xl shadow-primary/30 text-sm cursor-pointer"
                            >
                                <HiSparkles className="h-4 w-4 fill-current" />
                                <span>Calculate My Match</span>
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* STEP 4: RESULTS VIEW */}
                {step === 4 && (
                    <div className="space-y-10">
                        {isAnalyzing ? (
                            <div className="py-20 text-center space-y-4">
                                <span className="loading loading-ring loading-xl text-primary" />
                                <h3 className="font-display text-xl font-bold text-base-content animate-pulse">
                                    Analyzing Cinema Catalog & Scoring Vibe...
                                </h3>
                                <p className="text-xs text-base-content/60">
                                    Cross-referencing {activeMoodObj.title} + {activeTimeObj.title} parameters
                                </p>
                            </div>
                        ) : currentSpotlight ? (
                            <>
                                {/* TOP 1 SPOTLIGHT MATCH CARD */}
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.97, y: 15 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="relative overflow-hidden rounded-3xl border-2 border-primary/40 bg-gradient-to-br from-base-200/90 via-base-100/95 to-base-200/90 p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6"
                                >
                                    {/* Ambient Backdrop Glow */}
                                    <div className="absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-primary/20 blur-3xl pointer-events-none" />

                                    {/* Header Row: Match Score & Roll Action */}
                                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-base-300/80 pb-4 relative z-10">
                                        <div className="flex items-center gap-3">
                                            <div className="grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-tr from-primary to-accent text-primary-content font-display font-black text-xl shadow-lg shadow-primary/30">
                                                {currentSpotlight.matchScore}%
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[11px] font-black uppercase tracking-widest text-primary">
                                                        Top Vibe Match
                                                    </span>
                                                    {currentSpotlight.isPremium && (
                                                        <span className="rounded bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 text-[9px] font-extrabold uppercase">
                                                            VIP 4K
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-xs font-semibold text-base-content/80">
                                                    {currentSpotlight.primaryReason}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                type="button"
                                                onClick={handleRollAgain}
                                                className="btn btn-outline btn-sm rounded-xl font-bold gap-1.5 border-base-300 hover:bg-base-200"
                                                title="Cycle to next best recommendation"
                                            >
                                                <FiRefreshCw className="h-3.5 w-3.5" />
                                                <span>Roll Another Pick</span>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => setStep(1)}
                                                className="btn btn-ghost btn-sm rounded-xl font-bold gap-1.5 text-base-content/70 hover:text-base-content"
                                            >
                                                <FiSliders className="h-3.5 w-3.5" />
                                                <span>Tweak Mood</span>
                                            </button>
                                        </div>
                                    </div>

                                    {/* Spotlight Body Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center relative z-10">
                                        {/* Poster preview */}
                                        <div className="md:col-span-4 flex justify-center">
                                            <motion.div
                                                whileHover={{ scale: 1.03 }}
                                                className="relative aspect-[2/3] w-52 sm:w-60 overflow-hidden rounded-2xl border-2 border-base-300/80 shadow-2xl bg-base-300 group"
                                            >
                                                <img
                                                    src={currentSpotlight.poster}
                                                    alt={currentSpotlight.title}
                                                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                                <div className="absolute top-2.5 left-2.5">
                                                    <span className="rounded-md bg-black/70 px-2 py-0.5 text-[10px] font-black uppercase text-primary backdrop-blur-md">
                                                        {currentSpotlight.type || 'Movie'}
                                                    </span>
                                                </div>
                                                {currentSpotlight.trailerUrl && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveTrailer(currentSpotlight)}
                                                        className="absolute inset-0 grid place-items-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                                        aria-label="Play Trailer"
                                                    >
                                                        <span className="grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-content shadow-lg scale-90 group-hover:scale-100 transition-transform">
                                                            <FiPlay className="h-5 w-5 fill-current ml-0.5" />
                                                        </span>
                                                    </button>
                                                )}
                                            </motion.div>
                                        </div>

                                        {/* Details & Action Controls */}
                                        <div className="md:col-span-8 space-y-4 text-left">
                                            <div className="space-y-1.5">
                                                <div className="flex flex-wrap items-center gap-2 text-xs text-base-content/70 font-semibold">
                                                    <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-md">
                                                        <FiStar className="h-3.5 w-3.5 fill-amber-400" />
                                                        {currentSpotlight.rating || '8.8'}
                                                    </span>
                                                    <span>•</span>
                                                    <span>{currentSpotlight.year}</span>
                                                    {currentSpotlight.runtime && (
                                                        <>
                                                            <span>•</span>
                                                            <span className="flex items-center gap-1">
                                                                <FiClock className="h-3 w-3" />
                                                                {currentSpotlight.runtime}
                                                            </span>
                                                        </>
                                                    )}
                                                    {currentSpotlight.country && (
                                                        <>
                                                            <span>•</span>
                                                            <span>{currentSpotlight.country}</span>
                                                        </>
                                                    )}
                                                </div>

                                                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-base-content">
                                                    {currentSpotlight.title}
                                                </h2>

                                                {currentSpotlight.tagline && (
                                                    <p className="italic text-xs sm:text-sm text-primary font-medium">
                                                        &ldquo;{currentSpotlight.tagline}&rdquo;
                                                    </p>
                                                )}
                                            </div>

                                            <p className="text-xs sm:text-sm text-base-content/80 leading-relaxed line-clamp-3">
                                                {currentSpotlight.description}
                                            </p>

                                            {/* Reason Pills */}
                                            {currentSpotlight.matchReasons && (
                                                <div className="flex flex-wrap gap-1.5 pt-1">
                                                    {currentSpotlight.matchReasons.map((r, i) => (
                                                        <span
                                                            key={i}
                                                            className="inline-flex items-center gap-1 rounded-lg bg-primary/10 border border-primary/20 px-2.5 py-1 text-[11px] font-bold text-primary"
                                                        >
                                                            <span>✨</span>
                                                            <span>{r}</span>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            {/* Action Buttons */}
                                            <div className="flex flex-wrap items-center gap-3 pt-3">
                                                {currentSpotlight.trailerUrl && (
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveTrailer(currentSpotlight)}
                                                        className="btn btn-primary rounded-xl font-black gap-2 shadow-lg shadow-primary/25 cursor-pointer"
                                                    >
                                                        <FiPlay className="h-4 w-4 fill-current" />
                                                        <span>Watch Trailer</span>
                                                    </button>
                                                )}

                                                <button
                                                    type="button"
                                                    onClick={() => toggleWatchlist(currentSpotlight)}
                                                    className={`btn btn-outline rounded-xl font-bold gap-2 border-base-300 ${
                                                        isInWatchlist(currentSpotlight.id || currentSpotlight._id)
                                                            ? 'bg-primary text-primary-content border-primary shadow-sm'
                                                            : 'hover:bg-base-200'
                                                    }`}
                                                >
                                                    {isInWatchlist(currentSpotlight.id || currentSpotlight._id) ? (
                                                        <>
                                                            <FiCheck className="h-4 w-4 stroke-[3]" />
                                                            <span>In Watchlist</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <FiBookmark className="h-4 w-4" />
                                                            <span>Save to Watchlist</span>
                                                        </>
                                                    )}
                                                </button>

                                                <Link
                                                    to={`/details/${currentSpotlight.id || currentSpotlight._id}`}
                                                    className="btn btn-ghost rounded-xl font-bold gap-1.5 text-base-content/80 hover:bg-base-200"
                                                >
                                                    <FiInfo className="h-4 w-4 text-primary" />
                                                    <span>Full Details</span>
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={handleShareMatch}
                                                    className="btn btn-ghost btn-square rounded-xl text-base-content/70 hover:text-base-content"
                                                    title="Share match recommendation"
                                                    aria-label="Share recommendation"
                                                >
                                                    <FiShare2 className="h-4 w-4" />
                                                </button>
                                                {copiedShare && (
                                                    <span className="text-xs font-bold text-success animate-fade-in">
                                                        Copied to clipboard!
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* RUNNER-UPS CONTENDERS */}
                                {runnerUps.length > 0 && (
                                    <div className="space-y-4 pt-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="font-display text-xl font-bold text-base-content flex items-center gap-2">
                                                    <FiTrendingUp className="h-5 w-5 text-secondary" />
                                                    <span>More Top Contenders for This Vibe</span>
                                                </h3>
                                                <p className="text-xs text-base-content/60">
                                                    Strong algorithmic matches based on your mood configuration.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                            {runnerUps.map((item) => {
                                                const itemId = item.id || item._id
                                                return (
                                                    <div
                                                        key={itemId}
                                                        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-base-300/80 bg-base-200/50 p-3 backdrop-blur-xs transition hover:border-primary/50 hover:shadow-lg"
                                                    >
                                                        <div className="space-y-2.5">
                                                            <div className="relative aspect-[2/3] w-full overflow-hidden rounded-xl bg-base-300">
                                                                <img
                                                                    src={item.poster}
                                                                    alt={item.title}
                                                                    className="h-full w-full object-cover transition group-hover:scale-105"
                                                                />
                                                                <span className="absolute top-2 left-2 rounded bg-primary px-1.5 py-0.5 text-[10px] font-black text-primary-content shadow-xs">
                                                                    {item.matchScore}% Match
                                                                </span>
                                                            </div>

                                                            <div className="space-y-1">
                                                                <Link
                                                                    to={`/details/${itemId}`}
                                                                    className="line-clamp-1 font-display text-xs font-bold text-base-content group-hover:text-primary transition-colors"
                                                                >
                                                                    {item.title}
                                                                </Link>
                                                                <p className="text-[10px] text-base-content/60 line-clamp-1">
                                                                    {item.year} • {item.genres?.slice(0, 2).join(', ')}
                                                                </p>
                                                            </div>
                                                        </div>

                                                        <div className="pt-3 flex items-center gap-2">
                                                            <Link
                                                                to={`/details/${itemId}`}
                                                                className="flex-1 rounded-xl bg-base-300/70 hover:bg-primary hover:text-primary-content py-1.5 text-center text-[10px] font-bold transition"
                                                            >
                                                                View
                                                            </Link>
                                                            <button
                                                                type="button"
                                                                onClick={() => toggleWatchlist(item)}
                                                                className={`grid h-7 w-7 place-items-center rounded-xl border transition ${
                                                                    isInWatchlist(itemId)
                                                                        ? 'bg-primary border-primary text-primary-content'
                                                                        : 'border-base-300 bg-base-100 hover:bg-base-200'
                                                                }`}
                                                                title="Watchlist toggle"
                                                            >
                                                                {isInWatchlist(itemId) ? (
                                                                    <FiCheck className="h-3.5 w-3.5 stroke-[3]" />
                                                                ) : (
                                                                    <FiBookmark className="h-3.5 w-3.5" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </>
                        ) : null}
                    </div>
                )}
            </main>

            {/* TRAILER MODAL */}
            <AnimatePresence>
                {activeTrailer && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setActiveTrailer(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
                    >
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-black p-4 sm:p-6 shadow-2xl space-y-4 text-white"
                        >
                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                <div>
                                    <span className="rounded bg-primary/20 px-2 py-0.5 text-[9px] font-black uppercase text-primary">
                                        Matched Trailer Preview
                                    </span>
                                    <h3 className="font-display text-lg sm:text-xl font-bold text-white mt-1">
                                        {activeTrailer.title}
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setActiveTrailer(null)}
                                    className="btn btn-ghost btn-circle btn-sm text-gray-400 hover:text-white"
                                >
                                    <FiX className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
                                <iframe
                                    src={activeTrailer.trailerUrl}
                                    title={activeTrailer.title}
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
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

export default MoodMatcher
