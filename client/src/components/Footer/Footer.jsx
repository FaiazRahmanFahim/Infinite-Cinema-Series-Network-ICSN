import { Link } from 'react-router'
import { motion } from 'framer-motion'
import {
    FiFilm,
    FiGithub,
    FiTwitter,
    FiYoutube,
    FiInstagram,
} from 'react-icons/fi'

const Footer = () => {
    return (
        <footer className="mt-20 border-t border-base-300/80 bg-base-200/40 text-base-content/75 backdrop-blur-md transition-colors">
            <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-10">
                {/* Brand & Social Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-base-300/60 pb-6">
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-tr from-primary via-secondary to-accent text-primary-content text-sm font-bold shadow-xs transition group-hover:scale-105">
                            <FiFilm className="h-4 w-4" />
                        </span>
                        <div className="leading-tight">
                            <p className="font-display text-base font-black tracking-tight text-base-content">
                                ICSN
                            </p>
                            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-base-content/50">
                                Infinite Cinema Series Network
                            </p>
                        </div>
                    </Link>

                    {/* Social Media Links */}
                    <div className="flex items-center gap-1.5">
                        {[
                            {
                                icon: FiGithub,
                                label: 'GitHub',
                                href: 'https://github.com/FaiazRahmanFahim/Infinite-Cinema-Series-Network-ICSN',
                            },
                            {
                                icon: FiTwitter,
                                label: 'Twitter',
                                href: 'https://twitter.com',
                            },
                            {
                                icon: FiInstagram,
                                label: 'Instagram',
                                href: 'https://instagram.com',
                            },
                            {
                                icon: FiYoutube,
                                label: 'YouTube',
                                href: 'https://youtube.com',
                            },
                        ].map(({ icon: Icon, label, href }) => (
                            <motion.a
                                key={label}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="grid h-8 w-8 place-items-center rounded-lg text-base-content/60 hover:bg-base-300/60 hover:text-base-content transition-colors"
                                aria-label={label}
                                title={label}
                            >
                                <Icon className="h-4 w-4" />
                            </motion.a>
                        ))}
                    </div>
                </div>

                {/* Clean, Focused 4-Column Navigation */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-xs">
                    {/* Col 1: Explore */}
                    <div className="space-y-3">
                        <p className="font-display text-[11px] font-bold uppercase tracking-wider text-base-content">
                            Explore
                        </p>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/browse" className="hover:text-primary hover:underline transition-colors">
                                    Browse All Titles
                                </Link>
                            </li>
                            <li>
                                <Link to="/movies" className="hover:text-primary hover:underline transition-colors">
                                    Popular Movies
                                </Link>
                            </li>
                            <li>
                                <Link to="/series" className="hover:text-primary hover:underline transition-colors">
                                    TV Series
                                </Link>
                            </li>
                            <li>
                                <Link to="/animation" className="hover:text-primary hover:underline transition-colors">
                                    Anime & Animation
                                </Link>
                            </li>
                            <li>
                                <Link to="/upcoming" className="hover:text-primary hover:underline transition-colors">
                                    Release Premieres
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Col 2: Features */}
                    <div className="space-y-3">
                        <p className="font-display text-[11px] font-bold uppercase tracking-wider text-base-content">
                            Features
                        </p>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/premium" className="hover:text-primary hover:underline transition-colors">
                                    VIP 4K Cinema
                                </Link>
                            </li>
                            <li>
                                <Link to="/watchlist" className="hover:text-primary hover:underline transition-colors">
                                    Personal Watchlist
                                </Link>
                            </li>
                            <li>
                                <Link to="/trending" className="hover:text-primary hover:underline transition-colors">
                                    Trending Now
                                </Link>
                            </li>
                            <li>
                                <Link to="/profile" className="hover:text-primary hover:underline transition-colors">
                                    Cinephile Profile
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Col 3: Support */}
                    <div className="space-y-3">
                        <p className="font-display text-[11px] font-bold uppercase tracking-wider text-base-content">
                            Support
                        </p>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/help" className="hover:text-primary hover:underline transition-colors">
                                    Help Center & FAQ
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-primary hover:underline transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/help" className="hover:text-primary hover:underline transition-colors">
                                    Request a Film
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Col 4: Legal */}
                    <div className="space-y-3">
                        <p className="font-display text-[11px] font-bold uppercase tracking-wider text-base-content">
                            Legal
                        </p>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/terms" className="hover:text-primary hover:underline transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                            <li>
                                <Link to="/privacy" className="hover:text-primary hover:underline transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Minimal Copyright Bottom */}
                <div className="pt-6 border-t border-base-300/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-base-content/50">
                    <p>&copy; {new Date().getFullYear()} ICSN Entertainment. All rights reserved.</p>
                    <p className="text-[10px]">Master 4K Ultra HD & Dolby Atmos Discovery</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer