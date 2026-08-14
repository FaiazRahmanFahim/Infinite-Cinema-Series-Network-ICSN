import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router'
import { FiPlay, FiStar, FiClock, FiShield, FiBookmark, FiX, FiCheck, FiChevronLeft, FiChevronRight, FiInfo } from 'react-icons/fi'

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Pagination, Navigation, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import 'swiper/css/effect-fade'

const bannerSlides = [
    {
        id: 'movie-007',
        title: 'Dune: Part Two',
        badge: 'ICSN Premiere Choice',
        backdrop: 'https://images.unsplash.com/photo-1574267496488-744fd5e19808?w=1600&q=80',
        trailerUrl: 'https://www.youtube-nocookie.com/embed/Way9Dexny3w?autoplay=1',
        synopsis: 'The saga continues as Paul Atreides unites with Chani and the Fremen people of Arrakis to wage war against the conspirators who destroyed his family.',
        criticalAcclaim: '93% Critical Acclaim',
        runtime: '2h 46m',
        rating: 'PG-13',
    },
    {
        id: 'movie-001',
        title: 'Midnight Horizon',
        badge: 'Top Sci-Fi Release',
        backdrop: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80',
        trailerUrl: 'https://www.youtube-nocookie.com/embed/zSWdZVtXT7E?autoplay=1',
        synopsis: 'A deep-space rescue mission discovers an impossible signal from beyond the event horizon that could alter humanity’s fate forever.',
        criticalAcclaim: '95% Critical Acclaim',
        runtime: '2h 49m',
        rating: 'PG-13',
    },
    {
        id: 'movie-002',
        title: 'Neon Run',
        badge: 'Action Trending',
        backdrop: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1600&q=80',
        trailerUrl: 'https://www.youtube-nocookie.com/embed/gCcx85zbxz4?autoplay=1',
        synopsis: 'A courier races through a sprawling cyberpunk metropolis while carrying a classified technology powerful enough to reshape the underworld.',
        criticalAcclaim: '89% Critical Acclaim',
        runtime: '2h 15m',
        rating: 'R-Rated',
    },
]

const Banner = () => {
    const [activeTrailerUrl, setActiveTrailerUrl] = useState(null)
    const [bookmarkedIds, setBookmarkedIds] = useState({})

    const toggleBookmark = (id) => {
        setBookmarkedIds((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    return (
        <section className="relative w-full overflow-hidden bg-base-300">
            <Swiper
                modules={[Autoplay, Pagination, Navigation, EffectFade]}
                effect="fade"
                fadeEffect={{ crossFade: true }}
                speed={800}
                autoplay={{
                    delay: 6000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    dynamicBullets: true,
                }}
                navigation={{
                    nextEl: '.banner-next',
                    prevEl: '.banner-prev',
                }}
                loop
                className="banner-swiper h-[560px] w-full"
            >
                {bannerSlides.map((slide) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative h-full w-full">
                            {/* Backdrop Image */}
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 scale-105"
                                style={{ backgroundImage: `url(${slide.backdrop})` }}
                            />

                            {/* Vignette Overlays */}
                            <div className="absolute inset-0 bg-gradient-to-r from-base-100 via-base-100/80 to-transparent" />
                            <div className="absolute inset-0 bg-gradient-to-t from-base-100 via-transparent to-base-100/40" />

                            {/* Slide Content */}
                            <div className="relative mx-auto flex h-full max-w-7xl items-center px-4 py-16 sm:px-6 lg:px-8">
                                <div className="max-w-2xl space-y-6">
                                    {/* Badge */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.5 }}
                                        className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/20 px-3.5 py-1.5 text-xs font-bold text-primary backdrop-blur-md"
                                    >
                                        <span className="relative flex h-2 w-2">
                                            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                                            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                                        </span>
                                        <span>{slide.badge}</span>
                                    </motion.div>

                                    {/* Title */}
                                    <Link to={`/details/${slide.id}`}>
                                        <motion.h1
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.6, delay: 0.1 }}
                                            className="font-display text-4xl font-extrabold tracking-tight sm:text-6xl text-base-content drop-shadow-md leading-none hover:text-primary transition-colors cursor-pointer"
                                        >
                                            {slide.title}
                                        </motion.h1>
                                    </Link>

                                    {/* Synopsis */}
                                    <motion.p
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.2 }}
                                        className="text-sm sm:text-base text-base-content/80 leading-relaxed max-w-xl font-medium"
                                    >
                                        {slide.synopsis}
                                    </motion.p>

                                    {/* Action Buttons */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.3 }}
                                        className="flex flex-wrap items-center gap-3 pt-2"
                                    >
                                        <motion.button
                                            whileHover={{ scale: 1.04 }}
                                            whileTap={{ scale: 0.96 }}
                                            type="button"
                                            onClick={() => setActiveTrailerUrl(slide.trailerUrl)}
                                            className="btn btn-primary rounded-xl px-6 font-bold shadow-lg shadow-primary/30 gap-2.5"
                                        >
                                            <FiPlay className="h-4 w-4 fill-current" />
                                            Watch Trailer
                                        </motion.button>

                                        <Link
                                            to={`/details/${slide.id}`}
                                            className="btn btn-outline rounded-xl px-5 font-semibold gap-2 border border-base-300 bg-base-100/50 backdrop-blur-md hover:bg-base-200"
                                        >
                                            <FiInfo className="h-4 w-4 text-primary" />
                                            Details
                                        </Link>

                                        <motion.button
                                            whileHover={{ scale: 1.04 }}
                                            whileTap={{ scale: 0.96 }}
                                            type="button"
                                            onClick={() => toggleBookmark(slide.id)}
                                            className={`btn rounded-xl px-5 font-semibold gap-2 border border-base-300 backdrop-blur-md transition-all ${
                                                bookmarkedIds[slide.id]
                                                    ? 'btn-success text-success-content'
                                                    : 'btn-outline text-base-content hover:bg-base-200'
                                            }`}
                                        >
                                            {bookmarkedIds[slide.id] ? (
                                                <>
                                                    <FiCheck className="h-4 w-4 stroke-[3]" />
                                                    In Watchlist
                                                </>
                                            ) : (
                                                <>
                                                    <FiBookmark className="h-4 w-4" />
                                                    Add to Watchlist
                                                </>
                                            )}
                                        </motion.button>
                                    </motion.div>

                                    {/* Feature Badges */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.4 }}
                                        className="flex flex-wrap items-center gap-4 pt-4 text-xs font-semibold"
                                    >
                                        <div className="flex items-center gap-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 text-emerald-400 backdrop-blur-md">
                                            <FiStar className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                                            <span>{slide.criticalAcclaim}</span>
                                        </div>

                                        <div className="flex items-center gap-1.5 rounded-lg bg-base-200/60 border border-base-300/80 px-2.5 py-1 text-base-content/80 backdrop-blur-md">
                                            <FiClock className="h-3.5 w-3.5 text-primary" />
                                            <span>{slide.runtime}</span>
                                        </div>

                                        <div className="flex items-center gap-1.5 rounded-lg bg-base-200/60 border border-base-300/80 px-2.5 py-1 text-base-content/80 backdrop-blur-md">
                                            <FiShield className="h-3.5 w-3.5 text-secondary" />
                                            <span>{slide.rating}</span>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Navigation Arrows */}
            <button
                type="button"
                className="banner-prev absolute left-4 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-base-300/60 bg-base-100/60 text-base-content opacity-75 backdrop-blur-md transition hover:bg-primary hover:text-primary-content hover:opacity-100"
                aria-label="Previous slide"
            >
                <FiChevronLeft className="h-6 w-6" />
            </button>

            <button
                type="button"
                className="banner-next absolute right-4 top-1/2 z-20 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-base-300/60 bg-base-100/60 text-base-content opacity-75 backdrop-blur-md transition hover:bg-primary hover:text-primary-content hover:opacity-100"
                aria-label="Next slide"
            >
                <FiChevronRight className="h-6 w-6" />
            </button>

            {/* Trailer Modal Overlay */}
            <AnimatePresence>
                {activeTrailerUrl && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setActiveTrailerUrl(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative aspect-video w-full max-w-4xl overflow-hidden rounded-2xl border border-base-300/50 bg-black shadow-2xl"
                        >
                            <button
                                type="button"
                                onClick={() => setActiveTrailerUrl(null)}
                                className="absolute right-3 top-3 z-10 grid h-8 w-8 place-items-center rounded-full bg-black/60 text-white transition hover:bg-primary hover:text-primary-content"
                                aria-label="Close trailer"
                            >
                                <FiX className="h-5 w-5" />
                            </button>

                            <iframe
                                className="h-full w-full"
                                src={activeTrailerUrl}
                                title="Trailer preview"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    )
}

export default Banner