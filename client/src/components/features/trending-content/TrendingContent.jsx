import { use, useMemo } from 'react'
import { useLoaderData, useSearchParams, useLocation } from 'react-router'
import SectionHeader from '../../ui/SectionHeader'
import MediaCard from '../../ui/MediaCard'
import EmptyState from '../../ui/EmptyState'
import SortBar from '../../ui/SortBar'
import { filterAndSortMedia } from '../../../utils/filterMedia'

const TrendingContent = ({ trendingContentPromise, trendingContent, maxCount }) => {
    const loaderData = useLoaderData()
    const [searchParams, setSearchParams] = useSearchParams()
    const location = useLocation()
    const isHomePage = location.pathname === '/'

    const target = trendingContentPromise || trendingContent || loaderData

    let rawContent = []
    if (target && typeof target.then === 'function') {
        rawContent = use(target)
    } else if (Array.isArray(target)) {
        rawContent = target
    }

    const currentSort = searchParams.get('sort') || 'popularity'
    const activeGenre = searchParams.get('genre') || ''
    const searchQuery = searchParams.get('search') || ''

    // Apply sorting & active genre/search filter
    const sortedContent = useMemo(() => {
        return filterAndSortMedia(rawContent, {
            genre: activeGenre,
            search: searchQuery,
            sort: currentSort,
        })
    }, [rawContent, activeGenre, searchQuery, currentSort])

    const hasActiveFilters = Boolean(activeGenre || searchQuery || (currentSort && currentSort !== 'popularity'))

    const displayContent = isHomePage && maxCount
        ? sortedContent.slice(0, maxCount)
        : isHomePage && !hasActiveFilters
        ? sortedContent.slice(0, 6)
        : sortedContent

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
        ? (hasActiveFilters ? `/trending?${searchParams.toString()}` : '/trending')
        : null

    return (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
            <SectionHeader
                title="Trending Content"
                description={
                    isHomePage
                        ? "See what the ICSN community is watching right now."
                        : "Discover currently trending titles across ICSN."
                }
                badge={isHomePage ? "Trending" : "Trending Catalog"}
                viewAllLink={viewAllHref}
                viewAllText="View All Trending"
            />

            {/* Individual search and sort on dedicated trending page */}
            {!isHomePage && (
                <SortBar
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    currentSort={currentSort}
                    onSortChange={handleSortChange}
                    totalCount={sortedContent.length}
                    activeGenre={activeGenre}
                    onClearGenre={handleClearGenre}
                    placeholder="Search trending titles..."
                />
            )}

            {!displayContent || displayContent.length === 0 ? (
                <EmptyState
                    message={
                        activeGenre
                            ? `No trending content found in "${activeGenre}".`
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