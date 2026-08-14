import { use } from 'react'
import { useLoaderData, useSearchParams, Link, useLocation } from 'react-router'
import { FiX, FiFilter } from 'react-icons/fi'
import SectionHeader from '../../ui/SectionHeader'
import MediaCard from '../../ui/MediaCard'
import EmptyState from '../../ui/EmptyState'

const PopularMoviesContent = ({ popularMoviesPromise, popularMovies, maxCount }) => {
    const loaderData = useLoaderData()
    const [searchParams] = useSearchParams()
    const location = useLocation()
    const isHomePage = location.pathname === '/'
    const selectedGenre = searchParams.get('genre')

    const target = popularMoviesPromise || popularMovies || loaderData

    let movies = []
    if (target && typeof target.then === 'function') {
        movies = use(target)
    } else if (Array.isArray(target)) {
        movies = target
    }

    if (selectedGenre && Array.isArray(movies)) {
        movies = movies.filter((movie) =>
            movie.genres?.some(
                (g) => g.toLowerCase() === selectedGenre.toLowerCase()
            )
        )
    }

    const displayMovies = isHomePage && maxCount ? movies.slice(0, maxCount) : isHomePage && !selectedGenre ? movies.slice(0, 6) : movies

    return (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex-1">
                    <SectionHeader
                        title="Popular Movies"
                        description={
                            selectedGenre
                                ? `Showing popular movies tagged under "${selectedGenre}".`
                                : "Discover movies currently catching the attention of ICSN viewers."
                        }
                        badge={selectedGenre ? `Genre: ${selectedGenre}` : "Movies"}
                        viewAllLink={isHomePage ? "/movies" : null}
                        viewAllText="View All Movies"
                    />
                </div>

                {selectedGenre && !isHomePage && (
                    <Link
                        to="/movies"
                        className="inline-flex items-center gap-1.5 self-start rounded-full border border-base-300 bg-base-200/60 px-3 py-1.5 text-xs font-semibold text-base-content/80 hover:bg-base-300 hover:text-base-content transition-colors"
                    >
                        <FiFilter className="h-3.5 w-3.5 text-primary" />
                        <span>Clear Genre Filter</span>
                        <FiX className="h-3.5 w-3.5" />
                    </Link>
                )}
            </div>

            {!displayMovies || displayMovies.length === 0 ? (
                <EmptyState message={selectedGenre ? `No popular movies found for "${selectedGenre}".` : "No popular movies available."} />
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