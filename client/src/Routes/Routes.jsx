import { createBrowserRouter } from 'react-router'
import Root from '../pages/Root'
import MainLayout from '../layout/MainLayout'
import PopularMoviesContent from '../components/features/popular-movies/PopularMoviesContent'
import TrendingContent from '../components/features/trending-content/TrendingContent'
import DetailsPage from '../components/features/detailsPage/detailsPage'
import PopularSeriesContent from '../components/features/popular-series/PopularSeriesContent'
import PopularAnimationContent from '../components/features/popular-animation/PopularAnimationContent'
import BrowseContent from '../components/features/browse/BrowseContent'
import PremiumContent from '../components/features/premium/PremiumContent'
import WatchList from '../components/WatchList/WatchList'
import LogIn from '../pages/LogIn/LogIn'
import Register from '../pages/Register/Register'

// In-memory data caches to eliminate network fetch delays on tab navigation
let moviesCache = null
let seriesCache = null
let animationCache = null
let trendingCache = null
let allMediaCache = null

const getMovies = () =>
    moviesCache
        ? Promise.resolve(moviesCache)
        : fetch('/popularMovies.json')
              .then((res) => res.json())
              .then((data) => {
                  moviesCache = data
                  return data
              })

const getSeries = () =>
    seriesCache
        ? Promise.resolve(seriesCache)
        : fetch('/popularSeries.json')
              .then((res) => res.json())
              .then((data) => {
                  seriesCache = data
                  return data
              })

const getAnimation = () =>
    animationCache
        ? Promise.resolve(animationCache)
        : fetch('/popularAnimation.json')
              .then((res) => res.json())
              .then((data) => {
                  animationCache = data
                  return data
              })

const getTrending = () =>
    trendingCache
        ? Promise.resolve(trendingCache)
        : fetch('/trendingContent.json')
              .then((res) => res.json())
              .then((data) => {
                  trendingCache = data
                  return data
              })

// Extract all items marked with the special identifier (isPremium) from existing datasets
const getPremium = async () => {
    const [movies, series, animation, trending] = await Promise.all([
        getMovies(),
        getSeries(),
        getAnimation(),
        getTrending(),
    ])
    const map = new Map()
    for (const item of [...movies, ...series, ...animation, ...trending]) {
        if (item.isPremium && !map.has(item.id)) {
            map.set(item.id, item)
        }
    }
    return Array.from(map.values())
}

const loadAllMedia = async () => {
    if (allMediaCache) return allMediaCache
    const [movies, series, animation] = await Promise.all([
        getMovies(),
        getSeries(),
        getAnimation(),
    ])
    // Deduplicate by ID
    const map = new Map()
    for (const item of [...movies, ...series, ...animation]) {
        if (!map.has(item.id)) {
            map.set(item.id, item)
        }
    }
    allMediaCache = Array.from(map.values())
    return allMediaCache
}

export const router = createBrowserRouter([
    {
        path: '/',
        Component: Root,
        children: [
            {
                index: true,
                Component: MainLayout,
            },
            {
                path: '/browse',
                loader: loadAllMedia,
                Component: BrowseContent,
            },
            {
                path: '/explore',
                loader: loadAllMedia,
                Component: BrowseContent,
            },
            {
                path: '/movies',
                loader: getMovies,
                Component: PopularMoviesContent,
            },
            {
                path: '/series',
                loader: getSeries,
                Component: PopularSeriesContent,
            },
            {
                path: '/animation',
                loader: getAnimation,
                Component: PopularAnimationContent,
            },
            {
                path: '/trending',
                loader: getTrending,
                Component: TrendingContent,
            },
            {
                path: '/premium',
                loader: getPremium,
                Component: PremiumContent,
            },
            {
                path: '/details/:id',
                Component: DetailsPage,
            },
            {
                path: '/movies/:id',
                Component: DetailsPage,
            },
            {
                path: '/series/:id',
                Component: DetailsPage,
            },
            {
                path: '/animation/:id',
                Component: DetailsPage,
            },
            {
                path: '/premium/:id',
                Component: DetailsPage,
            },
            {
                path: '/watchlist',
                Component: WatchList,
            },
            {
                path: '/login',
                Component: LogIn,
            },
            {
                path: '/register',
                Component: Register,
            },
        ],
    },
])
