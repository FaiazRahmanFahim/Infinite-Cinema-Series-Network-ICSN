import { use } from 'react'
import { useLoaderData, useSearchParams, Link, useLocation } from 'react-router'
import { FiX, FiFilter, FiSearch } from 'react-icons/fi'
import SectionHeader from '../../ui/SectionHeader'
import MediaCard from '../../ui/MediaCard'
import EmptyState from '../../ui/EmptyState'

const TrendingContent = ({ trendingContentPromise, trendingContent, maxCount }) => {
    const loaderData = useLoaderData()
    const [searchParams, setSearchParams] = useSearchParams()
    const location = useLocation()
    const isHomePage = location.pathname === '/'
    const selectedGenre = searchParams.get('genre')
    const searchQuery = searchParams.get('search')?.trim()

    const target = trendingContentPromise || trendingContent || loaderData

    let content = []
    if (target && typeof target.then === 'function') {
        content = use(target)
    } else if (Array.isArray(target)) {
        content = target
    }

    // Filter by genre if query param exists
    if (selectedGenre && Array.isArray(content)) {
        content = content.filter((item) =>
            item.genres?.some(
                (g) => g.toLowerCase() === selectedGenre.toLowerCase()
            )
        )
    }

    // Filter by search query
    if (searchQuery && Array.isArray(content)) {
        const query = searchQuery.toLowerCase()
        content = content.filter((item) =>
            item.title?.toLowerCase().includes(query) ||
            item.description?.toLowerCase().includes(query) ||
            item.genres?.some((g) => g.toLowerCase().includes(query)) ||
            item.cast?.some((c) => c.toLowerCase().includes(query)) ||
            item.type?.toLowerCase().includes(query)
        )
    }

    const hasActiveFilters = Boolean(selectedGenre || searchQuery)
    const displayContent = isHomePage && maxCount ? content.slice(0, maxCount) : isHomePage && !hasActiveFilters ? content.slice(0, 6) : content

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
    let headerDescription = "See what the ICSN community is watching right now."
    let headerBadge = "Trending"
    if (searchQuery && selectedGenre) {
        headerDescription = `Showing trending titles matching "${searchQuery}" in ${selectedGenre}.`
        headerBadge = `"${searchQuery}" • ${selectedGenre}`
    } else if (searchQuery) {
        headerDescription = `Showing trending titles matching "${searchQuery}".`
        headerBadge = `Search: "${searchQuery}"`
    } else if (selectedGenre) {
        headerDescription = `Showing trending titles tagged under "${selectedGenre}".`
        headerBadge = `Genre: ${selectedGenre}`
    }

    const viewAllHref = isHomePage ? (hasActiveFilters ? `/trending?${searchParams.toString()}` : '/trending') : null

    return (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex-1">
                    <SectionHeader
                        title="Trending Content"
                        description={headerDescription}
                        badge={headerBadge}
                        viewAllLink={viewAllHref}
                        viewAllText="View All Trending"
                    />
                </div>

                {hasActiveFilters && !isHomePage && (
                    <div className="flex flex-wrap items-center gap-2 self-start">
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="inline-flex items-center gap-1.5 rounded-full border border-accent/40 bg-accent/10 px-3 py-1.5 text-xs font-semibold text-accent hover:bg-accent/20 transition-colors"
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
                                <FiFilter className="h-3.5 w-3.5 text-accent" />
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

            {!displayContent || displayContent.length === 0 ? (
                <EmptyState
                    message={
                        searchQuery && selectedGenre
                            ? `No trending content found matching "${searchQuery}" in "${selectedGenre}".`
                            : searchQuery
                            ? `No trending content found matching "${searchQuery}".`
                            : selectedGenre
                            ? `No trending content found for "${selectedGenre}".`
                            : "No trending content available."
                    }
                />
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                    {displayContent.map((item) => (
                        <MediaCard key={item.id || item._id} item={item} />
                    ))}
                </div>
            )}
        </section>
    )
}

export default TrendingContent