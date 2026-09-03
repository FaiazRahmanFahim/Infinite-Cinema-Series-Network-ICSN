import { Link } from 'react-router'
import { motion } from 'framer-motion'
import { FiShield, FiFileText, FiAward, FiCheck, FiArrowLeft } from 'react-icons/fi'
import { pageVariants } from '../../animations/motionVariants'

const Terms = () => {
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
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 border border-primary/30 px-3 py-1 text-xs font-black uppercase tracking-wider text-primary">
                        <FiFileText className="h-3.5 w-3.5" />
                        <span>Legal Documentation</span>
                    </span>
                    <h1 className="font-display text-3xl sm:text-4xl font-black text-base-content">
                        Terms of Service & Usage
                    </h1>
                    <p className="text-xs sm:text-sm text-base-content/65">
                        Last updated: September 2026 • Infinite Cinema & Series Network (ICSN)
                    </p>
                </div>
            </section>

            {/* Document Content */}
            <main className="mx-auto max-w-4xl px-4 sm:px-6 pt-10 space-y-8 text-xs sm:text-sm leading-relaxed text-base-content/80">
                <section className="space-y-3 rounded-2xl border border-base-300 bg-base-200/40 p-6 backdrop-blur-sm">
                    <h2 className="font-display text-lg font-bold text-base-content flex items-center gap-2">
                        <FiShield className="h-4 w-4 text-primary" />
                        <span>1. Platform Overview & Acceptance of Terms</span>
                    </h2>
                    <p>
                        By accessing, browsing, or utilizing the Infinite Cinema Series Network (ICSN), you agree to be bound by these Terms of Service. ICSN grants you a non-exclusive, non-transferable personal streaming preview license for high-definition and master-grade audio/video previews.
                    </p>
                </section>

                <section className="space-y-3 rounded-2xl border border-base-300 bg-base-200/40 p-6 backdrop-blur-sm">
                    <h2 className="font-display text-lg font-bold text-base-content flex items-center gap-2">
                        <FiAward className="h-4 w-4 text-secondary" />
                        <span>2. VIP Premiere Pass & High-Fidelity Streaming</span>
                    </h2>
                    <p>
                        VIP Premiere features, including uncompressed 4K HDR10+ transfers, IMAX Enhanced expanded screen aspect ratios, and Dolby Atmos 7.1 spatial audio feeds, are provided for certified personal playback devices. Redistribution, public retransmission, or unauthorized scraping of stream assets is strictly prohibited.
                    </p>
                </section>

                <section className="space-y-3 rounded-2xl border border-base-300 bg-base-200/40 p-6 backdrop-blur-sm">
                    <h2 className="font-display text-lg font-bold text-base-content flex items-center gap-2">
                        <FiCheck className="h-4 w-4 text-emerald-500" />
                        <span>3. User Accounts & Watchlist Syncing</span>
                    </h2>
                    <p>
                        Users are responsible for maintaining the confidentiality of their credentials. ICSN provides local and cloud watchlist backup capabilities. You retain ownership of your personal library curation and review submissions.
                    </p>
                </section>

                <section className="space-y-3 rounded-2xl border border-base-300 bg-base-200/40 p-6 backdrop-blur-sm">
                    <h2 className="font-display text-lg font-bold text-base-content flex items-center gap-2">
                        <FiFileText className="h-4 w-4 text-accent" />
                        <span>4. Intellectual Property & Studio Rights</span>
                    </h2>
                    <p>
                        All film trailers, promotional artworks, key visual posters, and trademark logos displayed on ICSN remain the sole intellectual property of their respective production studios and distributors (Warner Bros., Universal, Legendary, A24, MAPPA, Paramount, MGM).
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
                        to="/privacy"
                        className="text-xs font-bold text-base-content/70 hover:text-base-content hover:underline"
                    >
                        Read Privacy Policy &rarr;
                    </Link>
                </div>
            </main>
        </motion.div>
    )
}

export default Terms
