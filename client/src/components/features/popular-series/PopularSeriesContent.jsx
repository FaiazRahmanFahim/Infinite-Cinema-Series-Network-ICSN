import { use, useMemo } from 'react'
import { useLoaderData, useSearchParams, useLocation } from 'react-router'
import SectionHeader from '../../ui/SectionHeader'
import MediaCard from '../../ui/MediaCard'
import EmptyState from '../../ui/EmptyState'
import SortBar from '../../ui/SortBar'
import { filterAndSortMedia } from '../../../utils/filterMedia'

const PopularSeriesContent = ({ popularSeriesPromise, popularSeries, maxCount }) => {
    const loaderData = useLoaderData()
    const [searchParams, setSearchParams] = useSearchParams()
    const location = useLocation()
    const isHomePage = location.pathname === '/'

    const target = popularSeriesPromise || popularSeries || loaderData

    let rawSeries = []
    if (target && typeof target.then === 'function') {
        rawSeries = use(target)
    } else if (Array.isArray(target)) {
        rawSeries = target
    }

    const currentSort = searchParams.get('sort') || 'popularity'
    const activeGenre = searchParams.get('genre') || ''
    const searchQuery = searchParams.get('search') || ''

    // Apply sorting & active genre/search filter
    const sortedSeries = useMemo(() => {
        return filterAndSortMedia(rawSeries, {
            genre: activeGenre,
            search: searchQuery,
            sort: currentSort,
        })
    }, [rawSeries, activeGenre, searchQuery, currentSort])

    const hasActiveFilters = Boolean(activeGenre || searchQuery || (currentSort && currentSort !== 'popularity'))

    const displaySeries = isHomePage && maxCount
        ? sortedSeries.slice(0, maxCount)
        : isHomePage && !hasActiveFilters
        ? sortedSeries.slice(0, 6)
        : sortedSeries

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
        if (newSort && newSort !== 'popularity') {
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
        ? (hasActiveFilters ? `/series?${searchParams.toString()}` : '/series')
        : null

    return (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
            <SectionHeader
                title="Popular Series"
                description={
                    isHomePage
                        ? "Explore series that are gaining momentum across ICSN."
                        : "Explore trending and popular television series."
                }
                badge={isHomePage ? "Series" : "Series Catalog"}
                viewAllLink={viewAllHref}
                viewAllText="View All Series"
            />

            {/* Individual search and sort on dedicated series page */}
            {!isHomePage && (
                <SortBar
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    currentSort={currentSort}
                    onSortChange={handleSortChange}
                    totalCount={sortedSeries.length}
                    activeGenre={activeGenre}
                    onClearGenre={handleClearGenre}
                    placeholder="Search series by title, cast, creator..."
                />
            )}

            {!displaySeries || displaySeries.length === 0 ? (
                <EmptyState
                    message={
                        activeGenre
                            ? `No TV series found in "${activeGenre}".`
                            : "No popular series available."
                    }
                />
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                    {displaySeries.map((s) => (
                        <MediaCard key={s.id || s._id} item={s} />
                    ))}
                </div>
            )}
        </section>
    )
}

export default PopularSeriesContent