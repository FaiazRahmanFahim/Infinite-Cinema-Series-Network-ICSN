import React, { useState, useEffect, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { motion } from 'framer-motion'
import {
    FiUser,
    FiFilm,
    FiTv,
    FiSmile,
    FiStar,
    FiCalendar,
    FiArrowLeft,
    FiShare2,
    FiAward,
    FiCheck,
    FiSliders,
    FiLayers,
} from 'react-icons/fi'
import SectionHeader from '../../components/ui/SectionHeader'
import MediaCard from '../../components/ui/MediaCard'
import GenreIcon from '../../components/ui/GenreIcon'
import PersonAvatar from '../../components/ui/PersonAvatar'
import {
    pageVariants,
    containerVariants,
    itemVariants,
} from '../../animations/motionVariants'

const Filmography = () => {
    const { name } = useParams()
    const navigate = useNavigate()
    const decodedName = decodeURIComponent(name || '').trim()

    const [allMedia, setAllMedia] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedType, setSelectedType] = useState('all') // 'all' | 'Movie' | 'Series' | 'Animation'
    const [selectedRole, setSelectedRole] = useState('all') // 'all' | 'director' | 'cast'
    const [sortBy, setSortBy] = useState('rating') // 'rating' | 'newest' | 'oldest' | 'az'
    const [copiedShare, setCopiedShare] = useState(false)

    // Fetch all media items
    useEffect(() => {
        let isMounted = true
        fetch('/AllData.json')
            .then((r) => r.json())
            .then((data) => {
                if (!isMounted) return
                setAllMedia(data)
                setLoading(false)
            })
            .catch(() => {
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
            })

        return () => {
            isMounted = false
        }
    }, [])

    // Scroll to top when opening a new person filmography
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }, [name])

    // Find all titles associated with this director or cast member
    const personMedia = useMemo(() => {
        if (!decodedName) return []
        const target = decodedName.toLowerCase()

        return allMedia.filter((item) => {
            const isDirector = item.director?.toLowerCase().includes(target)
            const isCreator = item.creator?.toLowerCase().includes(target)
            const isCast = item.cast?.some((c) => c.toLowerCase().includes(target))
            return isDirector || isCreator || isCast
        })
    }, [allMedia, decodedName])

    // Detect primary roles across catalog
    const rolesDetected = useMemo(() => {
        const target = decodedName.toLowerCase()
        const roles = new Set()

        personMedia.forEach((item) => {
            if (item.director?.toLowerCase().includes(target)) roles.add('Director')
            if (item.creator?.toLowerCase().includes(target)) roles.add('Creator')
            if (item.cast?.some((c) => c.toLowerCase().includes(target))) roles.add('Cast Member')
        })

        return Array.from(roles)
    }, [personMedia, decodedName])

    // Calculate filmography metrics
    const stats = useMemo(() => {
        const total = personMedia.length
        if (total === 0) {
            return {
                total: 0,
                movies: 0,
                series: 0,
                animation: 0,
                avgRating: '0.0',
                topGenres: [],
                directedCount: 0,
                actedCount: 0,
            }
        }

        const movies = personMedia.filter((i) => (i.type || '').toLowerCase() === 'movie').length
        const series = personMedia.filter((i) => (i.type || '').toLowerCase() === 'series').length
        const animation = personMedia.filter(
            (i) => (i.type || '').toLowerCase() === 'animation' || i.genres?.includes('Animation')
        ).length

        const target = decodedName.toLowerCase()
        const directedCount = personMedia.filter(
            (i) => i.director?.toLowerCase().includes(target) || i.creator?.toLowerCase().includes(target)
        ).length
        const actedCount = personMedia.filter((i) =>
            i.cast?.some((c) => c.toLowerCase().includes(target))
        ).length

        const rated = personMedia.filter((i) => i.rating)
        const avgRating =
            rated.length > 0
                ? (rated.reduce((acc, i) => acc + Number(i.rating), 0) / rated.length).toFixed(1)
                : '8.5'

        const genreCounts = {}
        personMedia.forEach((i) => {
            if (Array.isArray(i.genres)) {
                i.genres.forEach((g) => {
                    genreCounts[g] = (genreCounts[g] || 0) + 1
                })
            }
        })

        const topGenres = Object.entries(genreCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 4)
            .map(([genre]) => genre)

        return {
            total,
            movies,
            series,
            animation,
            avgRating,
            topGenres,
            directedCount,
            actedCount,
        }
    }, [personMedia, decodedName])

    // Filter and sort the filmography results
    const filteredFilmography = useMemo(() => {
        const target = decodedName.toLowerCase()

        return personMedia
            .filter((item) => {
                // Type Filter
                if (selectedType === 'Movie' && (item.type || '').toLowerCase() !== 'movie') return false
                if (selectedType === 'Series' && (item.type || '').toLowerCase() !== 'series') return false
                if (
                    selectedType === 'Animation' &&
                    (item.type || '').toLowerCase() !== 'animation' &&
                    !item.genres?.includes('Animation')
                )
                    return false

                // Role Filter
                if (selectedRole === 'director') {
                    const isDir = item.director?.toLowerCase().includes(target) || item.creator?.toLowerCase().includes(target)
                    if (!isDir) return false
                }
                if (selectedRole === 'cast') {
                    const isCast = item.cast?.some((c) => c.toLowerCase().includes(target))
                    if (!isCast) return false
                }

                return true
            })
            .sort((a, b) => {
                if (sortBy === 'rating') {
                    return Number(b.rating || 0) - Number(a.rating || 0)
                }
                if (sortBy === 'newest') {
                    return (b.year || 0) - (a.year || 0)
                }
                if (sortBy === 'oldest') {
                    return (a.year || 0) - (b.year || 0)
                }
                if (sortBy === 'az') {
                    return (a.title || '').localeCompare(b.title || '')
                }
                return 0
            })
    }, [personMedia, selectedType, selectedRole, sortBy, decodedName])

    const handleShare = () => {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href)
            setCopiedShare(true)
            setTimeout(() => setCopiedShare(false), 2500)
        }
    }

    if (loading) {
        return (
            <div className="flex min-h-[70vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <span className="loading loading-spinner loading-lg text-primary" />
                    <p className="text-sm font-semibold text-base-content/70">
                        Loading {decodedName}&apos;s filmography...
                    </p>
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
            className="min-h-screen bg-base-100 pb-24 text-base-content"
        >
            {/* HERO PROFILE HEADER */}
            <section className="relative overflow-hidden border-b border-base-300/80 bg-gradient-to-b from-base-200/90 via-base-100 to-base-100 py-10 sm:py-14">
                {/* Ambient Glow */}
                <div className="pointer-events-none absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
                <div className="pointer-events-none absolute top-10 right-10 h-80 w-80 rounded-full bg-secondary/15 blur-3xl" />

                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-6">
                    {/* Back Button */}
                    <div>
                        <button
                            type="button"
                            onClick={() => navigate(-1)}
                            className="group inline-flex items-center gap-2 rounded-full border border-base-300/80 bg-base-100/80 px-4 py-2 text-xs font-bold text-base-content backdrop-blur-md transition hover:bg-primary hover:text-primary-content hover:border-primary shadow-xs"
                        >
                            <FiArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                            <span>Back</span>
                        </button>
                    </div>

                    {/* Profile Identity Card */}
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 rounded-3xl border border-base-300/80 bg-base-200/40 p-6 sm:p-8 backdrop-blur-xl shadow-lg">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start md:items-center gap-5 text-center sm:text-left">
                            <PersonAvatar
                                name={decodedName}
                                size="xl"
                                className="border-4 border-primary/30 shadow-2xl shadow-primary/20 ring-4 ring-base-100"
                            />

                            <div className="space-y-2">
                                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                                    <h1 className="font-display text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-base-content">
                                        {decodedName}
                                    </h1>
                                    {rolesDetected.map((role) => (
                                        <span
                                            key={role}
                                            className="rounded-full bg-primary/20 border border-primary/40 px-3 py-0.5 text-xs font-black text-primary uppercase tracking-wider"
                                        >
                                            {role}
                                        </span>
                                    ))}
                                </div>

                                <p className="text-xs sm:text-sm text-base-content/70 max-w-xl">
                                    Official ICSN filmography catalog tracking movies, series, and animated productions.
                                </p>

                                {/* Signature Genres */}
                                {stats.topGenres.length > 0 && (
                                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-1.5 pt-1">
                                        <span className="text-[11px] font-bold text-base-content/50 mr-1">
                                            Signature Genres:
                                        </span>
                                        {stats.topGenres.map((g) => (
                                            <span
                                                key={g}
                                                className="inline-flex items-center gap-1 rounded-md bg-base-300/70 px-2 py-0.5 text-[10px] font-bold text-base-content/80"
                                            >
                                                <GenreIcon name={g} className="h-2.5 w-2.5 text-primary" />
                                                <span>{g}</span>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Share Button */}
                        <div className="flex items-center gap-2 self-center md:self-auto">
                            <button
                                type="button"
                                onClick={handleShare}
                                className="btn btn-outline btn-sm rounded-xl font-bold gap-2 border-base-300 hover:bg-base-200"
                            >
                                <FiShare2 className="h-4 w-4" />
                                <span>{copiedShare ? 'Link Copied!' : 'Share Filmography'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Metric Cards Bar */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 pt-2">
                        <div className="rounded-2xl border border-base-300/80 bg-base-200/50 p-4 backdrop-blur-md">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/60">
                                Catalog Titles
                            </span>
                            <p className="font-display text-2xl font-black text-base-content mt-1">
                                {stats.total}
                            </p>
                            <p className="text-[10px] text-base-content/50 mt-0.5">
                                {stats.movies} Movies • {stats.series} Series • {stats.animation} Anime
                            </p>
                        </div>

                        <div className="rounded-2xl border border-base-300/80 bg-base-200/50 p-4 backdrop-blur-md">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/60">
                                Career IMDb Average
                            </span>
                            <div className="flex items-center gap-1.5 font-display text-2xl font-black text-amber-400 mt-1">
                                <FiStar className="h-5 w-5 fill-amber-400" />
                                <span>{stats.avgRating}</span>
                            </div>
                            <p className="text-[10px] text-base-content/50 mt-0.5">Across catalog works</p>
                        </div>

                        <div className="rounded-2xl border border-base-300/80 bg-base-200/50 p-4 backdrop-blur-md">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/60">
                                Directed Works
                            </span>
                            <p className="font-display text-2xl font-black text-primary mt-1">
                                {stats.directedCount} <span className="text-xs font-normal text-base-content/60">titles</span>
                            </p>
                            <p className="text-[10px] text-base-content/50 mt-0.5">As Director or Creator</p>
                        </div>

                        <div className="rounded-2xl border border-base-300/80 bg-base-200/50 p-4 backdrop-blur-md">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-base-content/60">
                                Cast Roles
                            </span>
                            <p className="font-display text-2xl font-black text-secondary mt-1">
                                {stats.actedCount} <span className="text-xs font-normal text-base-content/60">titles</span>
                            </p>
                            <p className="text-[10px] text-base-content/50 mt-0.5">Starring or Featured</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* MAIN CATALOG GRID SECTION */}
            <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
                {/* Filter & Sort Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-base-300/80 bg-base-200/40 p-4 sm:p-5 backdrop-blur-md">
                    {/* Media Type Tabs */}
                    <div className="flex flex-wrap items-center gap-1.5">
                        {[
                            { id: 'all', label: `All (${personMedia.length})`, icon: FiFilm },
                            { id: 'Movie', label: `Movies (${stats.movies})`, icon: FiFilm },
                            { id: 'Series', label: `Series (${stats.series})`, icon: FiTv },
                            { id: 'Animation', label: `Animation (${stats.animation})`, icon: FiSmile },
                        ].map(({ id, label, icon: Icon }) => (
                            <button
                                key={id}
                                type="button"
                                onClick={() => setSelectedType(id)}
                                className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                                    selectedType === id
                                        ? 'bg-primary text-primary-content shadow-sm shadow-primary/25'
                                        : 'bg-base-100 text-base-content/70 hover:bg-base-200 hover:text-base-content border border-base-300/70'
                                }`}
                            >
                                <Icon className="h-3.5 w-3.5" />
                                <span>{label}</span>
                            </button>
                        ))}
                    </div>

                    {/* Controls: Role Filter & Sort */}
                    <div className="flex flex-wrap items-center gap-2.5">
                        {/* Role Filter */}
                        {stats.directedCount > 0 && stats.actedCount > 0 && (
                            <div className="flex items-center gap-1 rounded-xl bg-base-100 p-1 border border-base-300">
                                {[
                                    { id: 'all', label: 'All Roles' },
                                    { id: 'director', label: 'Directed' },
                                    { id: 'cast', label: 'Starred In' },
                                ].map(({ id, label }) => (
                                    <button
                                        key={id}
                                        type="button"
                                        onClick={() => setSelectedRole(id)}
                                        className={`rounded-lg px-2.5 py-1 text-xs font-bold transition cursor-pointer ${
                                            selectedRole === id
                                                ? 'bg-secondary text-secondary-content shadow-xs'
                                                : 'text-base-content/70 hover:text-base-content'
                                        }`}
                                    >
                                        {label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Sort Dropdown */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="select select-bordered select-sm rounded-xl text-xs bg-base-100 font-semibold border-base-300"
                        >
                            <option value="rating">Highest Rated (★ 10 → 1)</option>
                            <option value="newest">Release Year (Newest)</option>
                            <option value="oldest">Release Year (Oldest)</option>
                            <option value="az">Title (A → Z)</option>
                        </select>
                    </div>
                </div>

                {/* Media Cards Grid */}
                {filteredFilmography.length === 0 ? (
                    <div className="rounded-3xl border border-dashed border-base-300 p-12 text-center space-y-3">
                        <span className="grid h-12 w-12 mx-auto place-items-center rounded-2xl bg-base-200 text-base-content/60">
                            <FiUser className="h-6 w-6" />
                        </span>
                        <h4 className="font-display text-base font-bold text-base-content">
                            No titles found in this category
                        </h4>
                        <p className="text-xs text-base-content/60 max-w-sm mx-auto">
                            Try switching between Movies, Series, or All Roles to view all associated titles for {decodedName}.
                        </p>
                        <button
                            type="button"
                            onClick={() => {
                                setSelectedType('all')
                                setSelectedRole('all')
                            }}
                            className="btn btn-primary btn-sm rounded-xl font-bold"
                        >
                            Reset Filters
                        </button>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="show"
                        className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
                    >
                        {filteredFilmography.map((item) => (
                            <motion.div key={item.id || item._id} variants={itemVariants}>
                                <MediaCard item={item} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </main>
        </motion.div>
    )
}

export default Filmography
