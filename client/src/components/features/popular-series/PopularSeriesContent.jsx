import { use } from 'react'
import { useLoaderData, useSearchParams, Link, useLocation } from 'react-router'
import { FiX, FiFilter, FiSearch } from 'react-icons/fi'
import SectionHeader from '../../ui/SectionHeader'
import MediaCard from '../../ui/MediaCard'
import EmptyState from '../../ui/EmptyState'

const PopularSeriesContent = ({ popularSeriesPromise, popularSeries, maxCount }) => {
    const loaderData = useLoaderData()
    const [searchParams, setSearchParams] = useSearchParams()
    const location = useLocation()
    const isHomePage = location.pathname === '/'
    const selectedGenre = searchParams.get('genre')
    const searchQuery = searchParams.get('search')?.trim()

    const target = popularSeriesPromise || popularSeries || loaderData

    let series = []
    if (target && typeof target.then === 'function') {
        series = use(target)
    } else if (Array.isArray(target)) {
        series = target
    }

    // Filter by genre if query param exists
    if (selectedGenre && Array.isArray(series)) {
        series = series.filter((item) =>
            item.genres?.some(
                (g) => g.toLowerCase() === selectedGenre.toLowerCase()
            )
        )
    }

    // Filter by search query
    if (searchQuery && Array.isArray(series)) {
        const query = searchQuery.toLowerCase()
        series = series.filter((item) =>
            item.title?.toLowerCase().includes(query) ||
            item.description?.toLowerCase().includes(query) ||
            item.genres?.some((g) => g.toLowerCase().includes(query)) ||
            item.cast?.some((c) => c.toLowerCase().includes(query)) ||
            item.creator?.toLowerCase().includes(query)
        )
    }

    const hasActiveFilters = Boolean(selectedGenre || searchQuery)
    const displaySeries = isHomePage && maxCount ? series.slice(0, maxCount) : isHomePage && !hasActiveFilters ? series.slice(0, 6) : series

    const clearSearch = () => {
        const newParams = new URLSearchParams(searchParams)
        newParams.delete('search')
        setSearchParams(newParams)
    }

    const clearGenre = () => {
        const newParams = new URLSearchParams(searchParams)
        newParams.delete('genre')
        setSearchParams(newParams)
    }

    const clearAll = () => {
        setSearchParams({})
    }

    // Dynamic SectionHeader content
    let headerDescription = "Explore series that are gaining momentum across ICSN."
    let headerBadge = "Series"
    if (searchQuery && selectedGenre) {
        headerDescription = `Showing series matching "${searchQuery}" in ${selectedGenre}.`
        headerBadge = `"${searchQuery}" • ${selectedGenre}`
    } else if (searchQuery) {
        headerDescription = `Showing series matching "${searchQuery}".`
        headerBadge = `Search: "${searchQuery}"`
    } else if (selectedGenre) {
        headerDescription = `Showing popular series tagged under "${selectedGenre}".`
        headerBadge = `Genre: ${selectedGenre}`
    }

    const viewAllHref = isHomePage ? (hasActiveFilters ? `/series?${searchParams.toString()}` : '/series') : null

    return (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex-1">
                    <SectionHeader
                        title="Popular Series"
                        description={headerDescription}
                        badge={headerBadge}
                        viewAllLink={viewAllHref}
                        viewAllText="View All Series"
                    />
                </div>

                {hasActiveFilters && !isHomePage && (
                    <div className="flex flex-wrap items-center gap-2 self-start">
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="inline-flex items-center gap-1.5 rounded-full border border-secondary/40 bg-secondary/10 px-3 py-1.5 text-xs font-semibold text-secondary hover:bg-secondary/20 transition-colors"
                            >
                                <FiSearch className="h-3.5 w-3.5" />
                                <span>Clear &ldquo;{searchQuery}&rdquo;</span>
                                <FiX className="h-3.5 w-3.5" />
                            </button>
                        )}
                        {selectedGenre && (
                            <button
                                type="button"
                                onClick={clearGenre}
                                className="inline-flex items-center gap-1.5 rounded-full border border-base-300 bg-base-200/60 px-3 py-1.5 text-xs font-semibold text-base-content/80 hover:bg-base-300 hover:text-base-content transition-colors"
                            >
                                <FiFilter className="h-3.5 w-3.5 text-secondary" />
                                <span>Clear Genre</span>
                                <FiX className="h-3.5 w-3.5" />
                            </button>
                        )}
                        {searchQuery && selectedGenre && (
                            <button
                                type="button"
                                onClick={clearAll}
                                className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium text-error hover:underline"
                            >
                                Clear all
                            </button>
                        )}
                    </div>
                )}
            </div>

            {!displaySeries || displaySeries.length === 0 ? (
                <EmptyState
                    message={
                        searchQuery && selectedGenre
                            ? `No series found matching "${searchQuery}" in "${selectedGenre}".`
                            : searchQuery
                            ? `No series found matching "${searchQuery}".`
                            : selectedGenre
                            ? `No popular series found for "${selectedGenre}".`
                            : "No popular series available."
                    }
                />
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                    {displaySeries.map((item) => (
                        <MediaCard key={item.id || item._id} item={item} />
                    ))}
                </div>
            )}
        </section>
    )
}

export default PopularSeriesContent