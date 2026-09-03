import { useState, useMemo } from 'react'
import { Link } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FiHelpCircle,
    FiSearch,
    FiChevronDown,
    FiFilm,
    FiTv,
    FiShield,
    FiZap,
    FiSliders,
    FiSend,
    FiCheckCircle,
    FiX,
    FiMessageSquare,
    FiMail,
    FiAward,
} from 'react-icons/fi'
import { pageVariants, containerVariants, itemVariants, modalVariants } from '../../animations/motionVariants'

const FAQ_DATA = [
    {
        id: 'faq-1',
        category: 'vip',
        question: 'What video quality formats are supported on ICSN VIP?',
        answer: 'ICSN VIP Premiere delivers native 4K Ultra HD (3840x2160) master transfers with HDR10+ and Dolby Vision dynamic metadata. On supported IMAX releases, we provide expanded 1.43:1 and 1.90:1 aspect ratios with enhanced multi-plane depth mapping.',
    },
    {
        id: 'faq-2',
        category: 'vip',
        question: 'How do I enable Dolby Atmos 7.1 spatial audio?',
        answer: 'Dolby Atmos is enabled automatically when connecting an eARC/ARC compatible soundbar, AV receiver, or spatial audio headphones. You can also configure audio passthrough directly in your Profile Settings under the Playback & Preferences tab.',
    },
    {
        id: 'faq-3',
        category: 'watchlist',
        question: 'How does the ICSN Watchlist sync across devices?',
        answer: 'Your library is maintained in real-time. When logged in, your watch status (Plan to Watch, Watching, Completed) and custom progress notes automatically sync to your cloud profile.',
    },
    {
        id: 'faq-4',
        category: 'watchlist',
        question: 'Can I export or share my personal cinema library?',
        answer: 'Yes! From your Profile dashboard, click the "Share" button to copy a direct link to your public cinephile profile and showcase your top genre affinity charts and completed hall of fame.',
    },
    {
        id: 'faq-5',
        category: 'devices',
        question: 'Which devices and browsers are fully supported?',
        answer: 'ICSN is optimized for all modern evergreen browsers (Chrome, Edge, Firefox, Safari) as well as Apple TV, Google TV, Smart TVs with web capability, and iOS/Android mobile and tablet devices.',
    },
    {
        id: 'faq-6',
        category: 'devices',
        question: 'How much internet bandwidth is needed for 4K streaming?',
        answer: 'We recommend a stable broadband connection of at least 25 Mbps for smooth 4K Ultra HD HDR playback. If your bandwidth fluctuates, our adaptive player seamlessly adjusts between 1080p and 4K without buffering pauses.',
    },
    {
        id: 'faq-7',
        category: 'account',
        question: 'How do I change my cinema avatar or display name?',
        answer: 'Navigate to your Profile page and click "Edit Profile". You can choose from 6 signature avatars (Cinema Director, Cosmic Pilot, Neon Rebel, Anime Sensei, Noir Detective, Master Critic) and update your bio tagline.',
    },
    {
        id: 'faq-8',
        category: 'account',
        question: 'Is my data and viewing history private?',
        answer: 'Yes. We strictly adhere to user privacy standards. Your viewing history and personal preferences are token-encrypted and never sold to third-party ad networks.',
    },
]

const CATEGORIES = [
    { id: 'all', label: 'All Topics', icon: FiHelpCircle },
    { id: 'vip', label: 'VIP 4K & Audio Specs', icon: FiZap },
    { id: 'watchlist', label: 'Watchlist & Sync', icon: FiFilm },
    { id: 'devices', label: 'Device Compatibility', icon: FiTv },
    { id: 'account', label: 'Account & Security', icon: FiShield },
]

const Help = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('all')
    const [openFaqId, setOpenFaqId] = useState(FAQ_DATA[0].id)
    const [ticketModalOpen, setTicketModalOpen] = useState(false)
    const [submittedTicket, setSubmittedTicket] = useState(false)

    // Form state
    const [ticketForm, setTicketForm] = useState({
        name: '',
        email: '',
        category: 'Film Request',
        message: '',
    })

    const filteredFaqs = useMemo(() => {
        return FAQ_DATA.filter((item) => {
            if (selectedCategory !== 'all' && item.category !== selectedCategory) return false
            if (searchQuery.trim()) {
                const q = searchQuery.toLowerCase().trim()
                const matchQ = item.question.toLowerCase().includes(q)
                const matchA = item.answer.toLowerCase().includes(q)
                if (!matchQ && !matchA) return false
            }
            return true
        })
    }, [selectedCategory, searchQuery])

    const handleFormSubmit = (e) => {
        e.preventDefault()
        setSubmittedTicket(true)
        setTimeout(() => {
            setSubmittedTicket(false)
            setTicketModalOpen(false)
            setTicketForm({ name: '', email: '', category: 'Film Request', message: '' })
        }, 2200)
    }

    return (
        <motion.div
            variants={pageVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="min-h-screen bg-base-100 pb-24 text-base-content"
        >
            {/* Hero Header */}
            <section className="relative overflow-hidden border-b border-base-300 bg-gradient-to-b from-base-200/80 via-base-100 to-base-100 py-14 sm:py-20 text-center">
                <div className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />

                <div className="mx-auto max-w-4xl px-4 sm:px-6 relative z-10 space-y-4">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 border border-primary/30 px-3 py-1 text-xs font-black uppercase tracking-wider text-primary">
                        <FiHelpCircle className="h-3.5 w-3.5" />
                        <span>ICSN Support & Knowledge Base</span>
                    </span>

                    <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-base-content">
                        How can we help your cinema experience?
                    </h1>

                    <p className="text-xs sm:text-sm md:text-base text-base-content/70 max-w-2xl mx-auto">
                        Find instant answers about 4K HDR playback, Dolby Atmos spatial audio, library backups, or submit a custom movie request.
                    </p>

                    {/* Live Search Input */}
                    <div className="pt-4 max-w-xl mx-auto relative">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-base-content/40" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search questions (e.g. 4K specs, Dolby Atmos, Watchlist sync)..."
                            className="h-12 w-full rounded-2xl border border-base-300 bg-base-200/60 pl-11 pr-10 text-xs sm:text-sm font-semibold focus:border-primary focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm transition-all"
                        />
                        {searchQuery && (
                            <button
                                type="button"
                                onClick={() => setSearchQuery('')}
                                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-base-content/40 hover:text-base-content"
                            >
                                <FiX className="h-4 w-4" />
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 pt-10 space-y-10">
                {/* Category Selector Tabs */}
                <div className="flex flex-wrap items-center justify-center gap-2">
                    {CATEGORIES.map(({ id, label, icon: Icon }) => (
                        <button
                            key={id}
                            type="button"
                            onClick={() => setSelectedCategory(id)}
                            className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition-all cursor-pointer ${
                                selectedCategory === id
                                    ? 'bg-primary text-primary-content shadow-sm shadow-primary/25'
                                    : 'bg-base-200/60 text-base-content/70 hover:bg-base-200 hover:text-base-content border border-base-300'
                            }`}
                        >
                            <Icon className="h-3.5 w-3.5" />
                            <span>{label}</span>
                        </button>
                    ))}
                </div>

                {/* FAQ Accordion List */}
                <div className="max-w-4xl mx-auto space-y-3">
                    {filteredFaqs.length === 0 ? (
                        <div className="rounded-3xl border border-dashed border-base-300 p-12 text-center space-y-3">
                            <span className="grid h-12 w-12 mx-auto place-items-center rounded-2xl bg-base-200 text-base-content/60">
                                <FiHelpCircle className="h-6 w-6" />
                            </span>
                            <h4 className="font-display text-base font-bold text-base-content">
                                No questions found matching &ldquo;{searchQuery}&rdquo;
                            </h4>
                            <p className="text-xs text-base-content/60 max-w-sm mx-auto">
                                Can&apos;t find what you are looking for? Submit a ticket directly to our cinema engineering team.
                            </p>
                            <button
                                type="button"
                                onClick={() => setTicketModalOpen(true)}
                                className="btn btn-primary btn-sm rounded-xl font-bold"
                            >
                                Submit Inquiry / Film Request
                            </button>
                        </div>
                    ) : (
                        filteredFaqs.map((faq) => {
                            const isOpen = openFaqId === faq.id
                            return (
                                <div
                                    key={faq.id}
                                    className="overflow-hidden rounded-2xl border border-base-300 bg-base-200/50 transition-all shadow-xs hover:border-primary/40"
                                >
                                    <button
                                        type="button"
                                        onClick={() => setOpenFaqId(isOpen ? null : faq.id)}
                                        className="flex w-full items-center justify-between p-4 sm:p-5 text-left font-display text-sm sm:text-base font-bold text-base-content gap-4 cursor-pointer"
                                    >
                                        <span>{faq.question}</span>
                                        <FiChevronDown
                                            className={`h-4 w-4 shrink-0 text-base-content/60 transition-transform duration-300 ${
                                                isOpen ? 'rotate-180 text-primary' : ''
                                            }`}
                                        />
                                    </button>

                                    <AnimatePresence>
                                        {isOpen && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.25 }}
                                            >
                                                <div className="border-t border-base-300/60 p-4 sm:p-5 pt-3 text-xs sm:text-sm text-base-content/75 leading-relaxed bg-base-100/60">
                                                    {faq.answer}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )
                        })
                    )}
                </div>

                {/* Direct Support & Film Request Banner */}
                <div className="max-w-4xl mx-auto rounded-3xl border border-base-300 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
                    <div className="space-y-1.5 text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-2">
                            <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-content">
                                <FiMessageSquare className="h-4 w-4" />
                            </span>
                            <h3 className="font-display text-lg font-bold text-base-content">
                                Have a specific film request or technical inquiry?
                            </h3>
                        </div>
                        <p className="text-xs text-base-content/70 max-w-lg">
                            Request high-bitrate master transfers, report playback bugs, or send suggestions to our curators.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={() => setTicketModalOpen(true)}
                        className="btn btn-primary btn-sm rounded-xl font-bold shrink-0 shadow-md"
                    >
                        <span>Submit Film Request</span>
                    </button>
                </div>
            </div>

            {/* TICKET / REQUEST MODAL */}
            <AnimatePresence>
                {ticketModalOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setTicketModalOpen(false)}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
                    >
                        <motion.div
                            variants={modalVariants}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-lg rounded-3xl border border-base-300 bg-base-100 p-6 sm:p-8 shadow-2xl space-y-5"
                        >
                            <div className="flex items-center justify-between border-b border-base-300 pb-3">
                                <div className="flex items-center gap-2">
                                    <span className="grid h-8 w-8 place-items-center rounded-xl bg-primary/15 text-primary">
                                        <FiMail className="h-4 w-4" />
                                    </span>
                                    <h3 className="font-display text-lg font-bold text-base-content">
                                        Submit Ticket / Film Request
                                    </h3>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => setTicketModalOpen(false)}
                                    className="btn btn-ghost btn-circle btn-xs text-base-content/70"
                                >
                                    <FiX className="h-4 w-4" />
                                </button>
                            </div>

                            {submittedTicket ? (
                                <div className="py-8 text-center space-y-3">
                                    <span className="grid h-14 w-14 mx-auto place-items-center rounded-full bg-emerald-500/20 text-emerald-500">
                                        <FiCheckCircle className="h-8 w-8" />
                                    </span>
                                    <h4 className="font-display text-lg font-bold text-base-content">
                                        Inquiry Dispatched Successfully!
                                    </h4>
                                    <p className="text-xs text-base-content/60 max-w-xs mx-auto">
                                        Our cinema engineering team has received your ticket. We will review your request promptly.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleFormSubmit} className="space-y-4">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-bold text-base-content/70">Your Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={ticketForm.name}
                                                onChange={(e) => setTicketForm({ ...ticketForm, name: e.target.value })}
                                                placeholder="e.g. Alex Nolan"
                                                className="h-10 w-full rounded-xl border border-base-300 bg-base-200/50 px-3 text-xs font-semibold focus:border-primary focus:outline-none"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[11px] font-bold text-base-content/70">Email Address</label>
                                            <input
                                                type="email"
                                                required
                                                value={ticketForm.email}
                                                onChange={(e) => setTicketForm({ ...ticketForm, email: e.target.value })}
                                                placeholder="name@example.com"
                                                className="h-10 w-full rounded-xl border border-base-300 bg-base-200/50 px-3 text-xs font-semibold focus:border-primary focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-base-content/70">Inquiry Type</label>
                                        <select
                                            value={ticketForm.category}
                                            onChange={(e) => setTicketForm({ ...ticketForm, category: e.target.value })}
                                            className="h-10 w-full rounded-xl border border-base-300 bg-base-200/50 px-3 text-xs font-semibold focus:border-primary focus:outline-none"
                                        >
                                            <option value="Film Request">Film / Series Request (4K HDR)</option>
                                            <option value="Audio/Video Issue">Audio / Video Playback Issue</option>
                                            <option value="VIP Premiere Inquiry">VIP Membership & Streaming</option>
                                            <option value="General Feedback">General Platform Feedback</option>
                                        </select>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-base-content/70">Message / Movie Details</label>
                                        <textarea
                                            rows={3}
                                            required
                                            value={ticketForm.message}
                                            onChange={(e) => setTicketForm({ ...ticketForm, message: e.target.value })}
                                            placeholder="Provide movie title, director, or details of your inquiry..."
                                            className="w-full rounded-xl border border-base-300 bg-base-200/50 p-3 text-xs font-medium focus:border-primary focus:outline-none"
                                        />
                                    </div>

                                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-base-300">
                                        <button
                                            type="button"
                                            onClick={() => setTicketModalOpen(false)}
                                            className="btn btn-ghost btn-sm rounded-xl font-bold"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-sm rounded-xl font-bold gap-1.5"
                                        >
                                            <FiSend className="h-3.5 w-3.5" />
                                            <span>Send Request</span>
                                        </button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default Help
