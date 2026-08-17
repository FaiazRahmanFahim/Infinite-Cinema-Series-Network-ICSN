import { use, useMemo } from 'react'
import { useLoaderData, useSearchParams, useLocation } from 'react-router'
import SectionHeader from '../../ui/SectionHeader'
import MediaCard from '../../ui/MediaCard'
import EmptyState from '../../ui/EmptyState'
import SortBar from '../../ui/SortBar'
import { filterAndSortMedia } from '../../../utils/filterMedia'

const PopularMoviesContent = ({ popularMoviesPromise, popularMovies, maxCount }) => {
    const loaderData = useLoaderData()
    const [searchParams, setSearchParams] = useSearchParams()
    const location = useLocation()
    const isHomePage = location.pathname === '/'

    const target = popularMoviesPromise || popularMovies || loaderData

    let rawMovies = []
    if (target && typeof target.then === 'function') {
        rawMovies = use(target)
    } else if (Array.isArray(target)) {
        rawMovies = target
    }

    const currentSort = searchParams.get('sort') || 'popularity'
    const activeGenre = searchParams.get('genre') || ''
    const searchQuery = searchParams.get('search') || ''

    // Apply sorting & active genre/search filter
    const sortedMovies = useMemo(() => {
        return filterAndSortMedia(rawMovies, {
            genre: activeGenre,
            search: searchQuery,
            sort: currentSort,
        })
    }, [rawMovies, activeGenre, searchQuery, currentSort])

    const hasActiveFilters = Boolean(activeGenre || searchQuery || (currentSort && currentSort !== 'popularity'))

    const displayMovies = isHomePage && maxCount
        ? sortedMovies.slice(0, maxCount)
        : isHomePage && !hasActiveFilters
        ? sortedMovies.slice(0, 6)
        : sortedMovies

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
        ? (hasActiveFilters ? `/movies?${searchParams.toString()}` : '/movies')
        : null

    return (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
            <SectionHeader
                title="Popular Movies"
                description={
                    isHomePage
                        ? "Discover movies currently catching the attention of ICSN viewers."
                        : "Explore the most popular cinema on ICSN."
                }
                badge={isHomePage ? "Movies" : "Movie Catalog"}
                viewAllLink={viewAllHref}
                viewAllText="View All Movies"
            />

            {/* Individual search and sort on dedicated movies page */}
            {!isHomePage && (
                <SortBar
                    searchQuery={searchQuery}
                    onSearchChange={handleSearchChange}
                    currentSort={currentSort}
                    onSortChange={handleSortChange}
                    totalCount={sortedMovies.length}
                    activeGenre={activeGenre}
                    onClearGenre={handleClearGenre}
                    placeholder="Search movies by title, cast, director..."
                />
            )}

            {!displayMovies || displayMovies.length === 0 ? (
                <EmptyState
                    message={
                        activeGenre
                            ? `No movies found in "${activeGenre}".`
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