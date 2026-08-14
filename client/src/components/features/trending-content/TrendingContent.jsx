import { use } from 'react'
import { useLoaderData, useSearchParams, Link, useLocation } from 'react-router'
import { FiX, FiFilter } from 'react-icons/fi'
import SectionHeader from '../../ui/SectionHeader'
import MediaCard from '../../ui/MediaCard'
import EmptyState from '../../ui/EmptyState'

const TrendingContent = ({ trendingContentPromise, trendingContent, maxCount }) => {
    const loaderData = useLoaderData()
    const [searchParams] = useSearchParams()
    const location = useLocation()
    const isHomePage = location.pathname === '/'
    const selectedGenre = searchParams.get('genre')

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

    // On home page, limit to maxCount (default 6) if not filtering
    const displayContent = isHomePage && maxCount ? content.slice(0, maxCount) : isHomePage && !selectedGenre ? content.slice(0, 6) : content

    return (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex-1">
                    <SectionHeader
                        title="Trending Content"
                        description={
                            selectedGenre
                                ? `Showing trending titles tagged under "${selectedGenre}".`
                                : "See what the ICSN community is watching right now."
                        }
                        badge={selectedGenre ? `Genre: ${selectedGenre}` : "Trending"}
                        viewAllLink={isHomePage ? "/trending" : null}
                        viewAllText="View All Trending"
                    />
                </div>

                {selectedGenre && !isHomePage && (
                    <Link
                        to="/trending"
                        className="inline-flex items-center gap-1.5 self-start rounded-full border border-base-300 bg-base-200/60 px-3 py-1.5 text-xs font-semibold text-base-content/80 hover:bg-base-300 hover:text-base-content transition-colors"
                    >
                        <FiFilter className="h-3.5 w-3.5 text-accent" />
                        <span>Clear Genre Filter</span>
                        <FiX className="h-3.5 w-3.5" />
                    </Link>
                )}
            </div>

            {!displayContent || displayContent.length === 0 ? (
                <EmptyState message={selectedGenre ? `No trending content found for "${selectedGenre}".` : "No trending content available."} />
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