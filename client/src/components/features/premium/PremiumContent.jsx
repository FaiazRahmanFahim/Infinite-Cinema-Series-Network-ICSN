import { use, useMemo, useState } from 'react'
import { useLoaderData, useSearchParams, useLocation, Link } from 'react-router'
import { motion } from 'framer-motion'
import {
    FiAward,
    FiZap,
    FiFilm,
    FiTv,
    FiSmile,
    FiCheckCircle,

} from 'react-icons/fi'
import SectionHeader from '../../ui/SectionHeader'
import MediaCard from '../../ui/MediaCard'
import EmptyState from '../../ui/EmptyState'
import SortBar from '../../ui/SortBar'
import { filterAndSortMedia } from '../../../utils/filterMedia'

const PremiumContent = ({ premiumPromise, premiumData, maxCount }) => {
    const loaderData = useLoaderData()
    const [searchParams, setSearchParams] = useSearchParams()
    const location = useLocation()
    const isHomePage = location.pathname === '/'

    const target = premiumPromise || premiumData || loaderData

    let rawData = []
    if (target && typeof target.then === 'function') {
        rawData = use(target)
    } else if (Array.isArray(target)) {
        rawData = target
    }

    const currentSort = searchParams.get('sort') || 'rating'
    const activeGenre = searchParams.get('genre') || ''
    const activeType = searchParams.get('type') || ''
    const searchQuery = searchParams.get('search') || ''

    // Filter by type, genre, search, and sort
    const filteredItems = useMemo(() => {
        return filterAndSortMedia(rawData, {
            type: activeType,
            genre: activeGenre,
            search: searchQuery,
            sort: currentSort,
        })
    }, [rawData, activeType, activeGenre, searchQuery, currentSort])

    const counts = useMemo(() => {
        return {
            all: rawData.length,
            movies: rawData.filter((i) => i.type === 'Movie').length,
            series: rawData.filter((i) => i.type === 'Series').length,
            animation: rawData.filter((i) => i.type === 'Animation').length,
        }
    }, [rawData])

    const hasActiveFilters = Boolean(activeGenre || activeType || searchQuery || (currentSort && currentSort !== 'rating'))

    const displayItems = isHomePage && maxCount
        ? filteredItems.slice(0, maxCount)
        : isHomePage && !hasActiveFilters
            ? filteredItems.slice(0, 6)
            : filteredItems

    const handleTypeChange = (type) => {
        const params = new URLSearchParams(searchParams)
        if (type && type !== 'all') {
            params.set('type', type)
        } else {
            params.delete('type')
        }
        setSearchParams(params)
    }

    const handleSearchChange = (query) => {
        const params = new URLSearchParams(searchParams)
        if (query) {
            params.set('search', query)
        } else {
            params.delete('search')
        }
        setSearchParams(params)
    }

    const handleSortChange = (newSort) => {
        const params = new URLSearchParams(searchParams)
        if (newSort && newSort !== 'rating') {
            params.set('sort', newSort)
        } else {
            params.delete('sort')
        }
        setSearchParams(params)
    }

    const handleClearGenre = () => {
        const params = new URLSearchParams(searchParams)
        params.delete('genre')
        setSearchParams(params)
    }

    const viewAllHref = isHomePage
        ? (hasActiveFilters ? `/premium?${searchParams.toString()}` : '/premium')
        : null

    return (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-8">
            {/* Dedicated Page Hero Banner */}
            {!isHomePage && (
                <div className="relative overflow-hidden rounded-3xl border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-base-200/90 to-purple-900/20 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
                    <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-amber-500/15 blur-3xl" />
                    <div className="absolute -left-16 -bottom-16 h-64 w-64 rounded-full bg-purple-600/15 blur-3xl" />

                    <div className="relative z-10 max-w-3xl space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-500/10 px-3.5 py-1 text-xs font-extrabold text-amber-400 backdrop-blur-md shadow-sm">
                            <FiAward className="h-4 w-4" />
                            <span>ICSN VIP CINEMA LOUNGE</span>
                        </div>

                        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-base-content">
                            Exclusive <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">Premium Collection</span>
                        </h1>

                        <p className="text-sm sm:text-base text-base-content/75 leading-relaxed">
                            Experience cinematic perfection with master-grade 4K Ultra HD, Dolby Vision, IMAX Enhanced aspect ratios, and uncompressed Dolby Atmos spatial audio across top movies, series, and animation.
                        </p>

                        {/* Premium Tech Perks Pills */}
                        <div className="flex flex-wrap gap-2 pt-2">
                            <span className="flex items-center gap-1.5 rounded-xl border border-amber-500/30 bg-base-100/80 px-3 py-1 text-xs font-bold text-base-content/90 backdrop-blur-md">
                                <FiZap className="h-3.5 w-3.5 text-amber-400" />
                                4K Ultra HD & HDR10+
                            </span>
                            <span className="flex items-center gap-1.5 rounded-xl border border-purple-500/30 bg-base-100/80 px-3 py-1 text-xs font-bold text-base-content/90 backdrop-blur-md">
                                <FiAward className="h-3.5 w-3.5 text-purple-400" />
                                Dolby Cinema & Atmos
                            </span>
                            <span className="flex items-center gap-1.5 rounded-xl border border-sky-500/30 bg-base-100/80 px-3 py-1 text-xs font-bold text-base-content/90 backdrop-blur-md">
                                <FiFilm className="h-3.5 w-3.5 text-sky-400" />
                                IMAX Enhanced
                            </span>
                            <span className="flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-base-100/80 px-3 py-1 text-xs font-bold text-base-content/90 backdrop-blur-md">
                                <FiCheckCircle className="h-3.5 w-3.5 text-emerald-400" />
                                Uncensored & Director's Cuts
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {/* Section Header (For Home or sub-header) */}
            {isHomePage ? (
                <SectionHeader
                    title="Premium Content"
                    description="Explore master-grade releases in 4K Ultra HD, Dolby Vision, and IMAX format."
                    badge="Premium"
                    viewAllLink={viewAllHref}
                    viewAllText="View All Premium"
                />
            ) : (
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-base-300/60 pb-4">
                    <div>
                        <h2 className="font-display text-xl font-bold tracking-tight text-base-content">
                            Curated Master Releases
                        </h2>
                        <p className="text-xs text-base-content/60">
                            Showing {displayItems.length} of {rawData.length} premium titles
                        </p>
                    </div>

                    {/* Media Type Tabs */}
                    <div className="flex flex-wrap items-center gap-1.5 rounded-2xl border border-base-300/80 bg-base-200/50 p-1 backdrop-blur-sm">
                        <button
                            type="button"
                            onClick={() => handleTypeChange('all')}
                            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${!activeType || activeType === 'all'
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-sm'
                                    : 'text-base-content/70 hover:text-base-content hover:bg-base-300/60'
                                }`}
                        >
                            <span>All</span>
                            <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px]">
                                {counts.all}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleTypeChange('Movie')}
                            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${activeType === 'Movie'
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-sm'
                                    : 'text-base-content/70 hover:text-base-content hover:bg-base-300/60'
                                }`}
                        >
                            <FiFilm className="h-3.5 w-3.5" />
                            <span>Movies</span>
                            <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px]">
                                {counts.movies}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleTypeChange('Series')}
                            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${activeType === 'Series'
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-sm'
                                    : 'text-base-content/70 hover:text-base-content hover:bg-base-300/60'
                                }`}
                        >
                            <FiTv className="h-3.5 w-3.5" />
                            <span>Series</span>
                            <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px]">
                                {counts.series}
                            </span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleTypeChange('Animation')}
                            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${activeType === 'Animation'
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-sm'
                                    : 'text-base-content/70 hover:text-base-content hover:bg-base-300/60'
                                }`}
                        >
                            <FiSmile className="h-3.5 w-3.5" />
                            <span>Animation</span>
                            <span className="rounded-full bg-black/20 px-1.5 py-0.2 text-[10px]">
                                {counts.animation}
                            </span>
                        </button>
                    </div>
                </div>
            )}

            {/* Individual search and sort on dedicated page */}
            {!isHomePage && (
                <SortBar
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    currentSort={currentSort}
                    onSortChange={handleSortChange}
                    totalCount={filteredItems.length}
                    activeGenre={activeGenre}
                    onClearGenre={handleClearGenre}
                    placeholder="Search premium movies, series, directors, cast..."
                />
            )}

            {/* Media Grid */}
            {!displayItems || displayItems.length === 0 ? (
                <EmptyState
                    message={
                        activeGenre
                            ? `No premium titles found in "${activeGenre}".`
                            : "No premium titles match your search criteria."
                    }
                />
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                    {displayItems.map((item) => (
                        <MediaCard key={item.id || item._id} item={item} />
                    ))}
                </div>
            )}
        </section>
    )
}

export default PremiumContent
