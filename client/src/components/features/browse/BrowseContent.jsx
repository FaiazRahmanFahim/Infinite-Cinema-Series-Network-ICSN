import { useMemo, useState, useEffect } from 'react'
import { useLoaderData, useSearchParams } from 'react-router'
import { FiRotateCcw } from 'react-icons/fi'
import SectionHeader from '../../ui/SectionHeader'
import MediaCard from '../../ui/MediaCard'
import EmptyState from '../../ui/EmptyState'
import MediaFilterBar from '../../ui/MediaFilterBar'
import { filterAndSortMedia } from '../../../utils/filterMedia'

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

        return {
            type,
            country,
            language,
            year,
            sort,
            search,
            genre,
            genres,
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

    return (
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
            <SectionHeader
                title="Browse & Filter Catalog"
                description="Filter across all movies, series, and animation by type, country, language, release year, genres, and sort by latest or IMDb rating."
                badge="Explore Everything"
            />

            {/* Comprehensive Multi-Criteria Filter Bar */}
            <MediaFilterBar
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilters={handleResetFilters}
                totalCount={filteredItems.length}
                showTypeFilter={true}
            />

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
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                    {filteredItems.map((item) => (
                        <MediaCard key={item.id || item._id} item={item} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default BrowseContent
