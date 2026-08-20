import { use, useMemo } from 'react'
import { useLoaderData, useSearchParams, useLocation } from 'react-router'
import { motion } from 'framer-motion'
import SectionHeader from '../../ui/SectionHeader'
import MediaCard from '../../ui/MediaCard'
import EmptyState from '../../ui/EmptyState'
import SortBar from '../../ui/SortBar'
import { filterAndSortMedia } from '../../../utils/filterMedia'
import {
    sectionVariants,
    containerVariants,
    itemVariants,
    defaultViewport,
} from '../../../animations/motionVariants'

const PopularAnimationContent = ({ popularAnimationPromise, popularAnimation, maxCount }) => {
    const loaderData = useLoaderData()
    const [searchParams, setSearchParams] = useSearchParams()
    const location = useLocation()
    const isHomePage = location.pathname === '/'

    const target = popularAnimationPromise || popularAnimation || loaderData

    let rawAnimation = []
    if (target && typeof target.then === 'function') {
        rawAnimation = use(target)
    } else if (Array.isArray(target)) {
        rawAnimation = target
    }

    const currentSort = searchParams.get('sort') || 'popularity'
    const activeGenre = searchParams.get('genre') || ''
    const searchQuery = searchParams.get('search') || ''

    // Apply sorting & active genre/search filter
    const sortedAnimation = useMemo(() => {
        return filterAndSortMedia(rawAnimation, {
            genre: activeGenre,
            search: searchQuery,
            sort: currentSort,
        })
    }, [rawAnimation, activeGenre, searchQuery, currentSort])

    const hasActiveFilters = Boolean(activeGenre || searchQuery || (currentSort && currentSort !== 'popularity'))

    const displayAnimation = isHomePage && maxCount
        ? sortedAnimation.slice(0, maxCount)
        : isHomePage && !hasActiveFilters
        ? sortedAnimation.slice(0, 6)
        : sortedAnimation

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
        ? (hasActiveFilters ? `/animation?${searchParams.toString()}` : '/animation')
        : null

    return (
        <motion.section
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={defaultViewport}
            className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-6"
        >
            <SectionHeader
                title="Popular Animation"
                description={
                    isHomePage
                        ? "Discover iconic anime, animated adventures, and visually stunning storytelling."
                        : "Browse popular animated movies & anime series."
                }
                badge={isHomePage ? "Animation" : "Animation Catalog"}
                viewAllLink={viewAllHref}
                viewAllText="View All Animation"
            />

            {/* Individual search and sort on dedicated animation page */}
            {!isHomePage && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                >
                    <SortBar
                        searchQuery={searchQuery}
                        onSearchChange={handleSearchChange}
                        currentSort={currentSort}
                        onSortChange={handleSortChange}
                        totalCount={sortedAnimation.length}
                        activeGenre={activeGenre}
                        onClearGenre={handleClearGenre}
                        placeholder="Search animation by title, cast, director..."
                    />
                </motion.div>
            )}

            {!displayAnimation || displayAnimation.length === 0 ? (
                <EmptyState
                    message={
                        activeGenre
                            ? `No animation found in "${activeGenre}".`
                            : "No popular animation available."
                    }
                />
            ) : (
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
                >
                    {displayAnimation.map((anim) => (
                        <motion.div key={anim.id || anim._id} variants={itemVariants}>
                            <MediaCard item={anim} />
                        </motion.div>
                    ))}
                </motion.div>
            )}
        </motion.section>
    )
}

export default PopularAnimationContent
