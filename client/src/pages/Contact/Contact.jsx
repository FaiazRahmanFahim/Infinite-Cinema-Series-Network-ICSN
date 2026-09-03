import { useState } from 'react'
import { Link } from 'react-router'
import { motion } from 'framer-motion'
import {
    FiMail,
    FiSend,
    FiMessageSquare,
    FiCheckCircle,
    FiMapPin,
    FiClock,
    FiPhone,
    FiArrowLeft,
} from 'react-icons/fi'
import { pageVariants } from '../../animations/motionVariants'

const Contact = () => {
    const [submitted, setSubmitted] = useState(false)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'General Inquiry',
        message: '',
    })

    const handleSubmit = (e) => {
        e.preventDefault()
        setSubmitted(true)
        setTimeout(() => {
            setSubmitted(false)
            setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' })
        }, 3000)
    }

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
                        <FiMail className="h-3.5 w-3.5" />
                        <span>Get In Touch</span>
                    </span>
                    <h1 className="font-display text-3xl sm:text-4xl font-black text-base-content">
                        Contact the ICSN Network Team
                    </h1>
                    <p className="text-xs sm:text-sm text-base-content/65 max-w-xl mx-auto">
                        Whether you have a partnership request, streaming issue, or feedback, our cinema support specialists are here to help.
                    </p>
                </div>
            </section>

            {/* Main Form & Info Grid */}
            <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-10">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                    {/* Left: Contact Details Cards */}
                    <div className="md:col-span-5 space-y-4">
                        <div className="rounded-2xl border border-base-300 bg-base-200/40 p-5 space-y-3 backdrop-blur-sm">
                            <h3 className="font-display text-base font-bold text-base-content">
                                Global Headquarters
                            </h3>
                            <div className="space-y-2.5 text-xs text-base-content/70">
                                <div className="flex items-start gap-2.5">
                                    <FiMapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                    <span>700 Cinema Boulevard, Studio District, Los Angeles, CA 90028</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <FiMail className="h-4 w-4 text-secondary shrink-0" />
                                    <span>press@icsn.cinema • support@icsn.cinema</span>
                                </div>
                                <div className="flex items-center gap-2.5">
                                    <FiClock className="h-4 w-4 text-emerald-500 shrink-0" />
                                    <span>24/7 VIP Global Streaming Support</span>
                                </div>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-primary/30 bg-primary/10 p-5 space-y-2">
                            <h4 className="font-display text-sm font-bold text-base-content">
                                Fast-Track Film Requests
                            </h4>
                            <p className="text-xs text-base-content/70">
                                Looking for a specific movie or series in 4K HDR? Check our{' '}
                                <Link to="/help" className="text-primary font-bold hover:underline">
                                    Help Center
                                </Link>{' '}
                                to submit an instant film request ticket.
                            </p>
                        </div>
                    </div>

                    {/* Right: Interactive Contact Form */}
                    <div className="md:col-span-7 rounded-3xl border border-base-300 bg-base-200/50 p-6 sm:p-8 backdrop-blur-md">
                        {submitted ? (
                            <div className="py-12 text-center space-y-3">
                                <span className="grid h-14 w-14 mx-auto place-items-center rounded-full bg-emerald-500/20 text-emerald-500">
                                    <FiCheckCircle className="h-8 w-8" />
                                </span>
                                <h3 className="font-display text-xl font-bold text-base-content">
                                    Message Dispatched!
                                </h3>
                                <p className="text-xs text-base-content/65 max-w-sm mx-auto">
                                    Thank you for reaching out. An ICSN representative will get back to your email within 24 hours.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <h3 className="font-display text-lg font-bold text-base-content flex items-center gap-2">
                                    <FiMessageSquare className="h-4 w-4 text-primary" />
                                    <span>Send a Direct Message</span>
                                </h3>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-base-content/70">Full Name</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="Your name"
                                            className="h-10 w-full rounded-xl border border-base-300 bg-base-100 px-3 text-xs font-semibold focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[11px] font-bold text-base-content/70">Email Address</label>
                                        <input
                                            type="email"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="you@domain.com"
                                            className="h-10 w-full rounded-xl border border-base-300 bg-base-100 px-3 text-xs font-semibold focus:border-primary focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-base-content/70">Subject Topic</label>
                                    <select
                                        value={formData.subject}
                                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                        className="h-10 w-full rounded-xl border border-base-300 bg-base-100 px-3 text-xs font-semibold focus:border-primary focus:outline-none"
                                    >
                                        <option value="General Inquiry">General Platform Inquiry</option>
                                        <option value="VIP Support">VIP Pass & Audio/Video Playback</option>
                                        <option value="Partnership">Content Creator / Studio Partnership</option>
                                        <option value="Press">Press & Media Relations</option>
                                    </select>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[11px] font-bold text-base-content/70">Your Message</label>
                                    <textarea
                                        rows={4}
                                        required
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        placeholder="Write your message here..."
                                        className="w-full rounded-xl border border-base-300 bg-base-100 p-3 text-xs font-medium focus:border-primary focus:outline-none"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary btn-sm w-full rounded-xl font-bold gap-1.5 shadow-md"
                                >
                                    <FiSend className="h-3.5 w-3.5" />
                                    <span>Transmit Message</span>
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                <div className="pt-8 mt-10 flex items-center justify-between border-t border-base-300 text-xs">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-1.5 font-bold text-primary hover:underline"
                    >
                        <FiArrowLeft className="h-4 w-4" />
                        <span>Return to ICSN Home</span>
                    </Link>

                    <Link to="/help" className="font-bold text-base-content/70 hover:text-base-content hover:underline">
                        Visit FAQ Center &rarr;
                    </Link>
                </div>
            </main>
        </motion.div>
    )
}

export default Contact
