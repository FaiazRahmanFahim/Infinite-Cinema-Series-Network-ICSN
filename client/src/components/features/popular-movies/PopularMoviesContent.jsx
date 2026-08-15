import { use } from 'react'
import { useLoaderData, useSearchParams, Link, useLocation } from 'react-router'
import { FiX, FiFilter, FiSearch } from 'react-icons/fi'
import SectionHeader from '../../ui/SectionHeader'
import MediaCard from '../../ui/MediaCard'
import EmptyState from '../../ui/EmptyState'

const PopularMoviesContent = ({ popularMoviesPromise, popularMovies, maxCount }) => {
    const loaderData = useLoaderData()
    const [searchParams, setSearchParams] = useSearchParams()
    const location = useLocation()
    const isHomePage = location.pathname === '/'
    const selectedGenre = searchParams.get('genre')
    const searchQuery = searchParams.get('search')?.trim()

    const target = popularMoviesPromise || popularMovies || loaderData

    let movies = []
    if (target && typeof target.then === 'function') {
        movies = use(target)
    } else if (Array.isArray(target)) {
        movies = target
    }

    // Filter by genre
    if (selectedGenre && Array.isArray(movies)) {
        movies = movies.filter((movie) =>
            movie.genres?.some(
                (g) => g.toLowerCase() === selectedGenre.toLowerCase()
            )
        )
    }

    // Filter by search query
    if (searchQuery && Array.isArray(movies)) {
        const query = searchQuery.toLowerCase()
        movies = movies.filter((movie) =>
            movie.title?.toLowerCase().includes(query) ||
            movie.description?.toLowerCase().includes(query) ||
            movie.genres?.some((g) => g.toLowerCase().includes(query)) ||
            movie.cast?.some((c) => c.toLowerCase().includes(query)) ||
            movie.director?.toLowerCase().includes(query)
        )
    }

    const hasActiveFilters = Boolean(selectedGenre || searchQuery)
    const displayMovies = isHomePage && maxCount ? movies.slice(0, maxCount) : isHomePage && !hasActiveFilters ? movies.slice(0, 6) : movies

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
    let headerDescription = "Discover movies currently catching the attention of ICSN viewers."
    let headerBadge = "Movies"
    if (searchQuery && selectedGenre) {
        headerDescription = `Showing movies matching "${searchQuery}" in ${selectedGenre}.`
        headerBadge = `"${searchQuery}" • ${selectedGenre}`
    } else if (searchQuery) {
        headerDescription = `Showing movies matching "${searchQuery}".`
        headerBadge = `Search: "${searchQuery}"`
    } else if (selectedGenre) {
        headerDescription = `Showing popular movies tagged under "${selectedGenre}".`
        headerBadge = `Genre: ${selectedGenre}`
    }

    const viewAllHref = isHomePage ? (hasActiveFilters ? `/movies?${searchParams.toString()}` : '/movies') : null

    return (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex-1">
                    <SectionHeader
                        title="Popular Movies"
                        description={headerDescription}
                        badge={headerBadge}
                        viewAllLink={viewAllHref}
                        viewAllText="View All Movies"
                    />
                </div>

                {hasActiveFilters && !isHomePage && (
                    <div className="flex flex-wrap items-center gap-2 self-start">
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-primary/20 transition-colors"
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
                                <FiFilter className="h-3.5 w-3.5 text-primary" />
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

            {!displayMovies || displayMovies.length === 0 ? (
                <EmptyState
                    message={
                        searchQuery && selectedGenre
                            ? `No movies found matching "${searchQuery}" in "${selectedGenre}".`
                            : searchQuery
                            ? `No movies found matching "${searchQuery}".`
                            : selectedGenre
                            ? `No popular movies found for "${selectedGenre}".`
                            : "No popular movies available."
                    }
                />
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
                    {displayMovies.map((movie) => (
                        <MediaCard key={movie.id || movie._id} item={movie} />
                    ))}
                </div>
            )}
        </section>
    )
}

export default PopularMoviesContent