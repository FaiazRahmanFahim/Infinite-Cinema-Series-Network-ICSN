import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion, AnimatePresence } from 'framer-motion'
import {
    FiMail,
    FiLock,
    FiEye,
    FiEyeOff,
    FiArrowRight,
    FiCheckCircle,
    FiShield,
    FiFilm,
    FiStar,
    FiPlay,
    FiZap,
    FiTv,
    FiCheck,
    FiX,
} from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi2'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub, FaApple } from 'react-icons/fa6'
import { SMOOTH_EASE } from '../../animations/motionVariants'

const LogIn = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [rememberMe, setRememberMe] = useState(true)
    const [forgotModalOpen, setForgotModalOpen] = useState(false)
    const [resetEmail, setResetEmail] = useState('')
    const [resetSent, setResetSent] = useState(false)

    // Demo form submission
    const handleSubmit = (e) => {
        e.preventDefault()
        // Pure design demonstration - navigate to home
        navigate('/')
    }

    const handleResetSubmit = (e) => {
        e.preventDefault()
        setResetSent(true)
        setTimeout(() => {
            setResetSent(false)
            setForgotModalOpen(false)
            setResetEmail('')
        }, 2000)
    }

    const perks = [
        { icon: FiFilm, text: 'Unlimited 4K HDR Streaming' },
        { icon: FiZap, text: 'Ultra-low Latency Playback' },
        { icon: FiShield, text: 'Ad-free Cinema Experience' },
    ]

    return (
        <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden py-8 px-4 sm:px-6 lg:px-8">
            {/* Ambient Background Glows & Cinematic Backdrop */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-gradient-to-br from-primary/20 via-accent/15 to-transparent blur-3xl opacity-70" />
                <div className="absolute top-1/3 -left-32 h-96 w-96 rounded-full bg-secondary/15 blur-3xl" />
                <div className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
                {/* Subtle Grid pattern overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8881_1px,transparent_1px),linear-gradient(to_bottom,#8881_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
            </div>

            <div className="w-full max-w-5xl mx-auto grid lg:grid-cols-12 gap-8 items-center">
                {/* Left Side: Cinematic Showcase (Visible on Large Screens) */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: SMOOTH_EASE }}
                    className="hidden lg:flex lg:col-span-6 flex-col justify-between h-full p-8 rounded-3xl border border-base-300/60 bg-gradient-to-b from-base-200/80 via-base-200/40 to-base-300/20 backdrop-blur-xl relative overflow-hidden shadow-2xl shadow-black/20"
                >
                    {/* Glowing highlight decorative element */}
                    <div className="absolute -top-20 -right-20 w-48 h-48 bg-primary/20 rounded-full blur-2xl pointer-events-none" />

                    {/* Brand Banner */}
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-bold text-primary shadow-xs">
                            <HiSparkles className="h-3.5 w-3.5 animate-pulse" />
                            <span>WELCOME BACK TO ICSN</span>
                        </div>

                        <h1 className="font-display text-4xl font-extrabold tracking-tight text-base-content leading-tight">
                            Your gateway to{' '}
                            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                                Infinite Cinema
                            </span>
                        </h1>

                        <p className="text-sm text-base-content/70 leading-relaxed max-w-md">
                            Stream thousands of blockbuster movies, award-winning series, and exclusive premieres anytime, anywhere in crystal clear Dolby Atmos & Vision.
                        </p>
                    </div>

                    {/* Featured Preview Card */}
                    <div className="my-8 rounded-2xl border border-base-300/80 bg-base-100/70 p-4 shadow-xl backdrop-blur-md">
                        <div className="flex items-center gap-3.5">
                            <div className="relative h-16 w-12 rounded-xl overflow-hidden shadow-md shrink-0 bg-primary/20">
                                <img
                                    src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=300&q=80"
                                    alt="Cinema preview"
                                    className="h-full w-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end justify-center p-1">
                                    <FiPlay className="h-3 w-3 text-white fill-current" />
                                </div>
                            </div>

                            <div className="min-w-0 flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[9px] font-extrabold text-amber-500 dark:text-amber-400">
                                        PREMIER VIP
                                    </span>
                                    <span className="text-[11px] font-bold text-base-content/60">4K Ultra HD</span>
                                </div>
                                <p className="font-display font-bold text-sm text-base-content truncate">
                                    Continuous Streaming Resume
                                </p>
                                <p className="text-xs text-base-content/60">
                                    Pick up right where you left off on any screen.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Perks List */}
                    <div className="space-y-3 pt-2 border-t border-base-300/50">
                        {perks.map(({ icon: Icon, text }, index) => (
                            <div key={index} className="flex items-center gap-3 text-xs font-semibold text-base-content/80">
                                <div className="grid h-6 w-6 place-items-center rounded-lg bg-primary/10 text-primary shrink-0">
                                    <Icon className="h-3.5 w-3.5" />
                                </div>
                                <span>{text}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Right Side: LogIn Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: SMOOTH_EASE }}
                    className="w-full lg:col-span-6 max-w-md mx-auto"
                >
                    <div className="rounded-3xl border border-base-300/80 bg-base-100/90 dark:bg-base-200/80 p-6 sm:p-8 shadow-2xl backdrop-blur-2xl relative">
                        {/* Header */}
                        <div className="text-center space-y-2 mb-6">
                            <div className="inline-flex items-center justify-center gap-2 mb-1">
                                <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-tr from-primary via-secondary to-accent text-white shadow-lg shadow-primary/30">
                                    <FiFilm className="h-5 w-5" />
                                </span>
                            </div>
                            <h2 className="font-display text-2xl sm:text-3xl font-extrabold tracking-tight text-base-content">
                                Sign in to your account
                            </h2>
                            <p className="text-xs sm:text-sm text-base-content/60">
                                Enter your credentials to access your watchlist & library
                            </p>
                        </div>

                        {/* Social Auth Providers */}
                        <div className="grid grid-cols-3 gap-2.5 mb-6">
                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 rounded-xl border border-base-300 bg-base-200/50 hover:bg-base-200 py-2.5 px-3 text-xs font-bold text-base-content transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xs"
                                title="Sign in with Google"
                            >
                                <FcGoogle className="h-4 w-4 shrink-0" />
                                <span className="hidden sm:inline">Google</span>
                            </button>
                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 rounded-xl border border-base-300 bg-base-200/50 hover:bg-base-200 py-2.5 px-3 text-xs font-bold text-base-content transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xs"
                                title="Sign in with Apple"
                            >
                                <FaApple className="h-4 w-4 shrink-0" />
                                <span className="hidden sm:inline">Apple</span>
                            </button>
                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 rounded-xl border border-base-300 bg-base-200/50 hover:bg-base-200 py-2.5 px-3 text-xs font-bold text-base-content transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xs"
                                title="Sign in with GitHub"
                            >
                                <FaGithub className="h-4 w-4 shrink-0" />
                                <span className="hidden sm:inline">GitHub</span>
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="relative flex py-2 items-center mb-6">
                            <div className="flex-grow border-t border-base-300/80"></div>
                            <span className="shrink mx-3 text-[11px] font-bold uppercase tracking-wider text-base-content/40">
                                or continue with email
                            </span>
                            <div className="flex-grow border-t border-base-300/80"></div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email Input */}
                            <div className="space-y-1.5">
                                <label className="block text-xs font-bold text-base-content/80">
                                    Email Address
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-base-content/40">
                                        <FiMail className="h-4 w-4" />
                                    </div>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="cinephile@icsn.tv"
                                        className="w-full rounded-xl border border-base-300 bg-base-200/40 pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium text-base-content placeholder:text-base-content/35 focus:border-primary focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div className="space-y-1.5">
                                <div className="flex items-center justify-between">
                                    <label className="block text-xs font-bold text-base-content/80">
                                        Password
                                    </label>
                                    <button
                                        type="button"
                                        onClick={() => setForgotModalOpen(true)}
                                        className="text-xs font-semibold text-primary hover:text-primary/80 hover:underline transition-colors"
                                    >
                                        Forgot password?
                                    </button>
                                </div>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-base-content/40">
                                        <FiLock className="h-4 w-4" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••••••"
                                        className="w-full rounded-xl border border-base-300 bg-base-200/40 pl-10 pr-10 py-2.5 text-xs sm:text-sm font-medium text-base-content placeholder:text-base-content/35 focus:border-primary focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-base-content/40 hover:text-base-content transition-colors"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? (
                                            <FiEyeOff className="h-4 w-4" />
                                        ) : (
                                            <FiEye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Remember Me Checkbox */}
                            <div className="flex items-center justify-between pt-1">
                                <label className="flex items-center gap-2 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        checked={rememberMe}
                                        onChange={(e) => setRememberMe(e.target.checked)}
                                        className="checkbox checkbox-primary checkbox-xs rounded-md"
                                    />
                                    <span className="text-xs font-semibold text-base-content/70">
                                        Remember this device
                                    </span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                className="group w-full relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary via-primary to-accent px-5 py-3 text-sm font-extrabold text-primary-content shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200 cursor-pointer overflow-hidden mt-2"
                            >
                                <span>Sign In to ICSN</span>
                                <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </motion.button>
                        </form>

                        {/* Sign Up Link */}
                        <div className="mt-6 pt-5 border-t border-base-300/60 text-center">
                            <p className="text-xs text-base-content/70">
                                New to Infinite Cinema?{' '}
                                <Link
                                    to="/register"
                                    className="font-bold text-primary hover:text-primary/80 hover:underline transition-colors inline-flex items-center gap-1"
                                >
                                    Create an account
                                    <FiArrowRight className="h-3 w-3 inline" />
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* Forgot Password Modal */}
            <AnimatePresence>
                {forgotModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setForgotModalOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 15 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 15 }}
                            transition={{ duration: 0.2 }}
                            className="relative w-full max-w-md rounded-3xl border border-base-300 bg-base-100 dark:bg-base-200 p-6 sm:p-7 shadow-2xl z-10 space-y-4"
                        >
                            <div className="flex items-center justify-between pb-2 border-b border-base-300/60">
                                <div className="flex items-center gap-2">
                                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
                                        <FiLock className="h-4 w-4" />
                                    </span>
                                    <h3 className="font-display font-extrabold text-lg text-base-content">
                                        Reset Password
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setForgotModalOpen(false)}
                                    className="btn btn-ghost btn-circle btn-xs text-base-content/60 hover:text-base-content"
                                >
                                    <FiX className="h-4 w-4" />
                                </button>
                            </div>

                            {resetSent ? (
                                <div className="py-4 text-center space-y-2">
                                    <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-emerald-500/10 text-emerald-500">
                                        <FiCheckCircle className="h-6 w-6" />
                                    </div>
                                    <h4 className="font-bold text-sm text-base-content">
                                        Password Reset Link Sent
                                    </h4>
                                    <p className="text-xs text-base-content/60">
                                        Please check your inbox for instructions to reset your password.
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleResetSubmit} className="space-y-4 pt-1">
                                    <p className="text-xs text-base-content/70">
                                        Enter your registered email address and we'll send you a link to reset your password.
                                    </p>
                                    <div className="relative">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-base-content/40">
                                            <FiMail className="h-4 w-4" />
                                        </div>
                                        <input
                                            type="email"
                                            required
                                            value={resetEmail}
                                            onChange={(e) => setResetEmail(e.target.value)}
                                            placeholder="cinephile@icsn.tv"
                                            className="w-full rounded-xl border border-base-300 bg-base-200/50 pl-10 pr-4 py-2.5 text-xs sm:text-sm font-medium text-base-content focus:border-primary focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                        />
                                    </div>
                                    <div className="flex gap-2 justify-end pt-2">
                                        <button
                                            type="button"
                                            onClick={() => setForgotModalOpen(false)}
                                            className="px-4 py-2 rounded-xl text-xs font-semibold text-base-content/70 hover:bg-base-300/50 transition-colors"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 rounded-xl text-xs font-bold bg-primary text-primary-content hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
                                        >
                                            Send Reset Link
                                        </button>
                                    </div>
                                </form>
                            )}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    )
}

export default LogIn
