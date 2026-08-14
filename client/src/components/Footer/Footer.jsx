import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { FiFilm, FiGlobe, FiGithub, FiTwitter, FiInstagram, FiYoutube } from 'react-icons/fi'

const Footer = () => {
    const footerLinks = [
        ['Audio Description', 'Help Center', 'Gift Cards', 'Media Center'],
        ['Investor Relations', 'Jobs', 'Terms of Use', 'Privacy Policy'],
        ['Legal Notices', 'Cookie Preferences', 'Corporate Info', 'Contact Us'],
    ]

    return (
        <footer className="mt-20 border-t border-base-300/50 bg-base-200/30 text-base-content/70 backdrop-blur-md transition-colors duration-300">
            <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
                {/* Brand & Language Selector */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-base-300/40 pb-6">
                    <Link to="/" className="flex items-center gap-3 group">
                        <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-tr from-primary to-secondary text-primary-content text-sm font-bold shadow-xs transition group-hover:scale-105">
                            <FiFilm className="h-4 w-4" />
                        </span>
                        <div className="leading-tight">
                            <p className="font-display text-base font-bold tracking-tight text-base-content">
                                ICSN
                            </p>
                            <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-base-content/50">
                                Infinite Cinema
                            </p>
                        </div>
                    </Link>

                    {/* Social Media Icons */}
                    <div className="flex items-center gap-2">
                        {[
                            { icon: FiGithub, label: 'GitHub' },
                            { icon: FiTwitter, label: 'Twitter' },
                            { icon: FiInstagram, label: 'Instagram' },
                            { icon: FiYoutube, label: 'YouTube' },
                        ].map(({ icon: Icon, label }) => (
                            <motion.a
                                key={label}
                                href="#"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.95 }}
                                className="grid h-8 w-8 place-items-center rounded-lg text-base-content/60 hover:bg-base-300/50 hover:text-base-content transition-colors"
                                aria-label={label}
                                title={label}
                            >
                                <Icon className="h-4 w-4" />
                            </motion.a>
                        ))}
                    </div>
                </div>

                {/* Minimal Quiet Link Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-y-3 gap-x-8 text-xs text-base-content/60">
                    {footerLinks.flatMap((col) =>
                        col.map((link) => (
                            <a
                                key={link}
                                href="#"
                                className="hover:underline hover:text-base-content transition-colors underline-offset-4"
                            >
                                {link}
                            </a>
                        ))
                    )}
                </div>

                {/* Bottom Copyright & Language Button */}
                <div className="pt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] text-base-content/50">
                    <button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-md border border-base-300/80 bg-base-100/50 px-3 py-1 text-xs text-base-content/70 hover:border-base-300 transition-colors"
                    >
                        <FiGlobe className="h-3.5 w-3.5 text-primary" />
                        <span>English</span>
                    </button>

                    <p>© {new Date().getFullYear()} ICSN Entertainment, Inc. All rights reserved.</p>
                </div>
            </div>
        </footer>
    )
}

export default Footer