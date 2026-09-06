import { Suspense } from 'react'
import { useSearchParams, Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import { FiX, FiSearch, FiArrowRight } from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi2'
import Banner from '../components/Banner/Banner'
import PopularMoviesContent from '../components/features/popular-movies/PopularMoviesContent'
import TrendingContent from '../components/features/trending-content/TrendingContent'
import PremiumContent from '../components/features/premium/PremiumContent'
import GenreIcon from '../components/ui/GenreIcon'
import SectionHeader from '../components/ui/SectionHeader'
import LoadingGrid from '../components/ui/LoadingGrid'
import PopularSeriesContent from '../components/features/popular-series/PopularSeriesContent'
import PopularAnimationContent from '../components/features/popular-animation/PopularAnimationContent'
import RecentlyViewedRibbon from '../components/ui/RecentlyViewedRibbon'
import { slideDownVariants } from '../animations/motionVariants'

const popularMoviesPromise = fetch("/popularMovies.json").then((res) => res.json());
const popularSeriesPromise = fetch("/popularSeries.json").then((res) => res.json());
const popularAnimationPromise = fetch("/popularAnimation.json").then((res) => res.json());
const trendingContentPromise = fetch("/trendingContent.json").then((res) => res.json());

// Derive premium items from existing datasets using the special identifier (isPremium)
const premiumContentPromise = Promise.all([
    popularMoviesPromise,
    popularSeriesPromise,
    popularAnimationPromise,
    trendingContentPromise,
]).then(([movies, series, animation, trending]) => {
    const map = new Map();
    for (const item of [...movies, ...series, ...animation, ...trending]) {
        if (item.isPremium && !map.has(item.id)) {
            map.set(item.id, item);
        }
    }
    return Array.from(map.values());
});

const MainLayout = () => {
    const [searchParams] = useSearchParams()
    const activeGenre = searchParams.get('genre')
    const activeSearch = searchParams.get('search')?.trim()
    const activeCountry = searchParams.get('country')
    const activeLang = searchParams.get('language')
    const activeYear = searchParams.get('year')
    const hasActiveFilters = Boolean(activeGenre || activeSearch || activeCountry || activeLang || activeYear)

    return (
        <div className="flex min-h-screen flex-col bg-base-100 text-base-content transition-colors duration-300">
            <Banner />

            {/* Active Search & Genre Global Filter Indicator on Home */}
            <AnimatePresence>
                {hasActiveFilters && (
                    <motion.div
                        variants={slideDownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="mx-auto w-full max-w-7xl px-4 pt-8 sm:px-6 lg:px-8 overflow-hidden"
                    >
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
                                        ) : activeGenre ? (
                                            <>Filtering by genre <span className="text-primary">{activeGenre}</span></>
                                        ) : (
                                            <>Active custom filters</>
                                        )}
                                    </h3>
                                    <p className="text-xs text-base-content/65">
                                        Showing preview of titles matching your criteria across categories.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 self-end sm:self-center">
                                <Link
                                    to={`/browse?${searchParams.toString()}`}
                                    className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-content hover:bg-primary/90 transition-colors shadow-sm"
                                >
                                    <span>Explore in Full Catalog &rarr;</span>
                                </Link>

                                <Link
                                    to="/"
                                    className="inline-flex items-center gap-1.5 rounded-xl border border-base-300 bg-base-100 px-3 py-2 text-xs font-bold text-base-content hover:bg-base-200 transition-colors shadow-xs"
                                >
                                    <FiX className="h-3.5 w-3.5" />
                                    <span>Clear</span>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Recently Viewed Media Ribbon (Shows directly after Hero Section) */}
            <RecentlyViewedRibbon />

            {/* Premium Content Section on Home */}
            <Suspense
                fallback={
                    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-6">
                        <SectionHeader
                            title="Premium Content"
                            description="Explore master-grade releases in 4K Ultra HD, Dolby Vision, and IMAX format."
                            badge="Premium"
                            viewAllLink="/premium"
                            viewAllText="View All Premium"
                        />
                        <LoadingGrid count={6} />
                    </div>
                }
            >
                <PremiumContent premiumPromise={premiumContentPromise} maxCount={6} />
            </Suspense>

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

            {/* AI Mood & Vibe Matcher Interactive Feature Teaser */}
            <section className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl border border-fuchsia-500/30 bg-gradient-to-r from-purple-950/60 via-base-200/90 to-fuchsia-950/50 p-6 sm:p-8 backdrop-blur-xl shadow-xl">
                    {/* Ambient Glow Orbs */}
                    <div className="pointer-events-none absolute -right-10 -top-10 h-64 w-64 rounded-full bg-fuchsia-500/15 blur-3xl" />
                    <div className="pointer-events-none absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />

                    <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        <div className="space-y-2 max-w-2xl">
                            <div className="inline-flex items-center gap-1.5 rounded-full bg-fuchsia-500/20 border border-fuchsia-500/30 px-3 py-0.5 text-[11px] font-black uppercase tracking-wider text-fuchsia-400">
                                <HiSparkles className="h-3.5 w-3.5 animate-pulse" />
                                <span>Smart Discovery Engine</span>
                            </div>

                            <h2 className="font-display text-2xl sm:text-3xl font-black tracking-tight text-base-content">
                                Not sure what to watch tonight?
                            </h2>

                            <p className="text-xs sm:text-sm text-base-content/75 leading-relaxed">
                                Launch our interactive Mood & Vibe Matcher. Pick your current mood, time budget, and audio/video preferences for an instant algorithmic match.
                            </p>

                            <div className="flex flex-wrap gap-2 pt-1">
                                {['🌌 Mind-Bending', '⚡ High Stakes', '☕ Cozy Comfort', '🎨 IMAX Grandeur'].map((tag) => (
                                    <span
                                        key={tag}
                                        className="rounded-lg bg-base-300/60 border border-base-300 px-2.5 py-1 text-[11px] font-bold text-base-content/80"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <Link
                            to="/matcher"
                            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-primary via-fuchsia-600 to-pink-600 px-6 py-3.5 text-xs font-black text-white shadow-lg shadow-fuchsia-500/25 hover:shadow-fuchsia-500/40 hover:scale-102 transition-all shrink-0 cursor-pointer"
                        >
                            <span>Launch Mood Matcher</span>
                            <FiArrowRight className="h-4 w-4" />
                        </Link>
                    </div>
                </div>
            </section>

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
                            title="Popular Animation"
                            description="Discover iconic anime, animated adventures, and visually stunning storytelling."
                            badge="Animation"
                            viewAllLink="/animation"
                        />
                        <LoadingGrid count={6} />
                    </div>
                }
            >
                <PopularAnimationContent popularAnimationPromise={popularAnimationPromise} />
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