import { Suspense } from 'react'
import { useSearchParams, Link } from 'react-router'
import { FiFilter, FiX, FiSearch } from 'react-icons/fi'
import Banner from '../components/Banner/Banner'
import PopularMoviesContent from '../components/features/popular-movies/PopularMoviesContent'
import TrendingContent from '../components/features/trending-content/TrendingContent'
import GenreIcon from '../components/ui/GenreIcon'
import SectionHeader from '../components/ui/SectionHeader'
import LoadingGrid from '../components/ui/LoadingGrid'
import PopularSeriesContent from '../components/features/popular-series/PopularSeriesContent'

const popularMoviesPromise = fetch("/popularMovies.json").then((res) => res.json());
const popularSeriesPromise = fetch("/popularSeries.json").then((res) => res.json());
const trendingContentPromise = fetch("/trendingContent.json").then((res) => res.json());

const MainLayout = () => {
    const [searchParams] = useSearchParams()
    const activeGenre = searchParams.get('genre')
    const activeSearch = searchParams.get('search')?.trim()
    const hasActiveFilters = Boolean(activeGenre || activeSearch)

    return (
        <div className="flex min-h-screen flex-col bg-base-100 text-base-content transition-colors duration-300">
            <Banner />

            {/* Active Search & Genre Global Filter Indicator on Home */}
            {hasActiveFilters && (
                <div className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 rounded-2xl border border-primary/30 bg-primary/10 p-4 backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-content shadow-sm">
                                {activeGenre ? (
                                    <GenreIcon name={activeGenre} className="h-5 w-5" />
                                ) : (
                                    <FiSearch className="h-5 w-5" />
                                )}
                            </span>
                            <div>
                                <h3 className="font-display text-base font-bold text-base-content">
                                    {activeSearch && activeGenre ? (
                                        <>Searching for <span className="text-primary">&ldquo;{activeSearch}&rdquo;</span> in <span className="text-secondary">{activeGenre}</span></>
                                    ) : activeSearch ? (
                                        <>Searching for <span className="text-primary">&ldquo;{activeSearch}&rdquo;</span></>
                                    ) : (
                                        <>Filtering by <span className="text-primary">{activeGenre}</span></>
                                    )}
                                </h3>
                                <p className="text-xs text-base-content/65">
                                    Showing movies, series, and trending content matching your criteria.
                                </p>
                            </div>
                        </div>

                        <Link
                            to="/"
                            className="inline-flex items-center gap-1.5 rounded-xl border border-base-300 bg-base-100 px-3.5 py-2 text-xs font-bold text-base-content hover:bg-base-200 transition-colors shadow-xs"
                        >
                            <FiX className="h-3.5 w-3.5" />
                            <span>Clear Filter</span>
                        </Link>
                    </div>
                </div>
            )}

            <Suspense
                fallback={
                    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
                        <SectionHeader
                            title="Popular Movies"
                            description="Discover movies currently catching the attention of ICSN viewers."
                            badge="Movies"
                            viewAllLink="/movies"
                        />
                        <LoadingGrid count={6} />
                    </div>
                }
            >
                <PopularMoviesContent popularMoviesPromise={popularMoviesPromise} />
            </Suspense>

            <Suspense
                fallback={
                    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
                        <SectionHeader
                            title="Popular Series"
                            description="Explore series that are gaining momentum across ICSN."
                            badge="Series"
                            viewAllLink="/series"
                        />
                        <LoadingGrid count={6} />
                    </div>
                }
            >
                <PopularSeriesContent popularSeriesPromise={popularSeriesPromise} />
            </Suspense>

            <Suspense
                fallback={
                    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
                        <SectionHeader
                            title="Trending Content"
                            description="See what the ICSN community is watching right now."
                            badge="Trending"
                            viewAllLink="/trending"
                        />
                        <LoadingGrid count={6} />
                    </div>
                }
            >
                <TrendingContent trendingContentPromise={trendingContentPromise} />
            </Suspense>
        </div>
    )
}

export default MainLayout