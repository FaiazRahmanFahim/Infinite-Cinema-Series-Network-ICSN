import { useMemo, useState, useEffect } from 'react'
import { useLoaderData, useSearchParams } from 'react-router'
import { motion } from 'framer-motion'
import { FiRotateCcw } from 'react-icons/fi'
import SectionHeader from '../../ui/SectionHeader'
import MediaCard from '../../ui/MediaCard'
import EmptyState from '../../ui/EmptyState'
import MediaFilterBar from '../../ui/MediaFilterBar'
import PersonAvatar from '../../ui/PersonAvatar'
import { filterAndSortMedia } from '../../../utils/filterMedia'
import {
    pageVariants,
    containerVariants,
    itemVariants,
} from '../../../animations/motionVariants'

const BrowseContent = () => {
    const loaderData = useLoaderData()
    const [searchParams, setSearchParams] = useSearchParams()
    const [fallbackItems, setFallbackItems] = useState([])

    // Fallback in case loaderData is empty on initial direct navigation
    useEffect(() => {
        if (!loaderData || loaderData.length === 0) {
            Promise.all([
                fetch('/popularMovies.json').then((r) => r.json()),
                fetch('/popularSeries.json').then((r) => r.json()),
                fetch('/popularAnimation.json').then((r) => r.json()),
            ])
                .then(([movies, series, animation]) => {
                    const map = new Map()
                    for (const item of [...movies, ...series, ...animation]) {
                        if (!map.has(item.id)) map.set(item.id, item)
                    }
                    setFallbackItems(Array.from(map.values()))
                })
                .catch(() => setFallbackItems([]))
        }
    }, [loaderData])

    const allMedia = (loaderData && loaderData.length > 0) ? loaderData : fallbackItems

    // Read current filter state from URL search params
    const filters = useMemo(() => {
        const type = searchParams.get('type') || ''
        const country = searchParams.get('country') || ''
        const language = searchParams.get('language') || ''
        const year = searchParams.get('year') || ''
        const sort = searchParams.get('sort') || 'popularity'
        const search = searchParams.get('search') || ''
        const genre = searchParams.get('genre') || ''
        const genresParam = searchParams.get('genres')
        const genres = genresParam
            ? genresParam.split(',').filter(Boolean)
            : genre
            ? [genre]
            : []
        const person = searchParams.get('person') || ''
        const director = searchParams.get('director') || ''
        const cast = searchParams.get('cast') || ''

        return {
            type,
            country,
            language,
            year,
            sort,
            search,
            genre,
            genres,
            person,
            director,
            cast,
        }
    }, [searchParams])

    // Filter and sort all media items
    const filteredItems = useMemo(() => {
        return filterAndSortMedia(allMedia, filters)
    }, [allMedia, filters])

    // Update URL when filters change
    const handleFilterChange = (newFilters) => {
        const params = new URLSearchParams()
        if (newFilters.type) params.set('type', newFilters.type)
        if (newFilters.country) params.set('country', newFilters.country)
        if (newFilters.language) params.set('language', newFilters.language)
        if (newFilters.year) params.set('year', newFilters.year)
        if (newFilters.sort && newFilters.sort !== 'popularity') params.set('sort', newFilters.sort)
        if (newFilters.search) params.set('search', newFilters.search)
        if (newFilters.person) params.set('person', newFilters.person)
        if (newFilters.director) params.set('director', newFilters.director)
        if (newFilters.cast) params.set('cast', newFilters.cast)

        if (Array.isArray(newFilters.genres) && newFilters.genres.length > 0) {
            params.set('genres', newFilters.genres.join(','))
        } else if (newFilters.genre && (!newFilters.genres || newFilters.genres.length === 0)) {
            params.set('genre', newFilters.genre)
        }

        setSearchParams(params)
    }

    const handleResetFilters = () => {
        setSearchParams({})
    }

    const activePersonFilter = filters.person || filters.director || filters.cast
    const activePersonRole = filters.director ? 'Director' : filters.cast ? 'Cast Member' : 'Person'

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6"
        >
            <SectionHeader
                title="Browse & Filter Catalog"
                description="Filter across all movies, series, and animation by type, country, language, release year, genres, and sort by latest or IMDb rating."
                badge="Explore Everything"
            />

            {/* Active Person / Filmography Filter Banner */}
            {activePersonFilter && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-primary/40 bg-primary/10 p-4 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <PersonAvatar name={activePersonFilter} size="md" className="border-primary/40 ring-2 ring-primary/20" />
                        <div>
                            <p className="text-xs font-semibold text-base-content/70">
                                Filtering by {activePersonRole}:
                            </p>
                            <h3 className="font-display text-sm sm:text-base font-bold text-base-content">
                                {activePersonFilter}
                            </h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <a
                            href={`/person/${encodeURIComponent(activePersonFilter)}`}
                            className="btn btn-xs btn-primary font-bold"
                        >
                            View Full Filmography &rarr;
                        </a>
                        <button
                            type="button"
                            onClick={() => {
                                const params = new URLSearchParams(searchParams)
                                params.delete('person')
                                params.delete('director')
                                params.delete('cast')
                                setSearchParams(params)
                            }}
                            className="btn btn-xs btn-ghost text-base-content/70 hover:text-base-content"
                        >
                            Clear Filter
                        </button>
                    </div>
                </div>
            )}

            {/* Comprehensive Multi-Criteria Filter Bar */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.05 }}
            >
                <MediaFilterBar
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    onResetFilters={handleResetFilters}
                    totalCount={filteredItems.length}
                    showTypeFilter={true}
                />
            </motion.div>

            {/* Results Grid */}
            {filteredItems.length === 0 ? (
                <div className="py-12 text-center space-y-4">
                    <EmptyState
                        message="No titles matched your combined filter criteria. Try adjusting or resetting some filters."
                    />
                    <button
                        type="button"
                        onClick={handleResetFilters}
                        className="btn btn-primary btn-sm gap-2"
                    >
                        <FiRotateCcw className="h-4 w-4" />
                        <span>Reset All Filters</span>
                    </button>
                </div>
            ) : (
                <motion.div
                    key={JSON.stringify(filters)}
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
                >
                    {filteredItems.map((item) => (
                        <motion.div key={item.id || item._id} variants={itemVariants}>
                            <MediaCard item={item} />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </motion.div>
    )
}

export default BrowseContent
