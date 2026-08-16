import { createBrowserRouter } from 'react-router'
import Root from '../pages/Root'
import MainLayout from '../layout/MainLayout'
import PopularMoviesContent from '../components/features/popular-movies/PopularMoviesContent'
import TrendingContent from '../components/features/trending-content/TrendingContent'
import DetailsPage from '../components/features/detailsPage/detailsPage'
import PopularSeriesContent from '../components/features/popular-series/PopularSeriesContent'
import PopularAnimationContent from '../components/features/popular-animation/PopularAnimationContent'

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
                path: '/movies',
                loader: () => fetch('/popularMovies.json').then((res) => res.json()),
                Component: PopularMoviesContent,
            },
            {
                path: '/series',
                loader: () => fetch('/popularSeries.json').then((res) => res.json()),
                Component: PopularSeriesContent,
            },
            {
                path: '/animation',
                loader: () => fetch('/popularAnimation.json').then((res) => res.json()),
                Component: PopularAnimationContent,
            },
            {
                path: '/trending',
                loader: () => fetch('/trendingContent.json').then((res) => res.json()),
                Component: TrendingContent,
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
        ]
    }
])

