import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { FiShield, FiLock, FiDatabase, FiCheck, FiArrowLeft } from 'react-icons/fi'
import { pageVariants } from '../../animations/motionVariants'

const Privacy = () => {
    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen bg-base-100 pb-24 text-base-content"
        >
            {/* Header */}
            <section className="border-b border-base-300 bg-gradient-to-b from-base-200/80 via-base-100 to-base-100 py-12 text-center">
                <div className="mx-auto max-w-4xl px-4 sm:px-6 space-y-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                        <FiLock className="h-3.5 w-3.5" />
                        <span>Data Protection & Trust</span>
                    </span>
                    <h1 className="font-display text-3xl sm:text-4xl font-black text-base-content">
                        Privacy & Cookie Policy
                    </h1>
                    <p className="text-xs sm:text-sm text-base-content/65">
                        How ICSN respects your cinema viewing data and privacy standards
                    </p>
                </div>
            </section>

            {/* Document Content */}
            <main className="mx-auto max-w-4xl px-4 sm:px-6 pt-10 space-y-8 text-xs sm:text-sm leading-relaxed text-base-content/80">
                <section className="space-y-3 rounded-2xl border border-base-300 bg-base-200/40 p-6 backdrop-blur-sm">
                    <h2 className="font-display text-lg font-bold text-base-content flex items-center gap-2">
                        <FiShield className="h-4 w-4 text-emerald-500" />
                        <span>1. Zero Third-Party Tracking</span>
                    </h2>
                    <p>
                        ICSN does NOT sell, rent, or trade your personal profile data, watchlist records, or viewing history to external advertising brokerages or tracking networks.
                    </p>
                </section>

                <section className="space-y-3 rounded-2xl border border-base-300 bg-base-200/40 p-6 backdrop-blur-sm">
                    <h2 className="font-display text-lg font-bold text-base-content flex items-center gap-2">
                        <FiDatabase className="h-4 w-4 text-primary" />
                        <span>2. Local Storage & Client Encryption</span>
                    </h2>
                    <p>
                        Your theme preferences, recently viewed media reel, custom avatars, and watchlist statuses are stored securely inside your browser&apos;s local storage with token encryption. You can clear your history or delete all stored data anytime from your Profile Settings.
                    </p>
                </section>

                <section className="space-y-3 rounded-2xl border border-base-300 bg-base-200/40 p-6 backdrop-blur-sm">
                    <h2 className="font-display text-lg font-bold text-base-content flex items-center gap-2">
                        <FiLock className="h-4 w-4 text-secondary" />
                        <span>3. Essential Cookies Only</span>
                    </h2>
                    <p>
                        We only use strictly essential session cookies necessary for authenticated profile features, theme persistence, and video player controls. No tracking or profiling cookies are deployed.
                    </p>
                </section>

                <div className="pt-4 flex items-center justify-between border-t border-base-300">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-primary hover:underline"
                    >
                        <FiArrowLeft className="h-4 w-4" />
                        <span>Return to ICSN Home</span>
                    </Link>

                    <Link
                        to="/terms"
                        className="text-xs font-bold text-base-content/70 hover:text-base-content hover:underline"
                    >
                        Terms of Service &rarr;
                    </Link>
                </div>
            </main>
        </motion.div>
    )
}

export default Privacy
