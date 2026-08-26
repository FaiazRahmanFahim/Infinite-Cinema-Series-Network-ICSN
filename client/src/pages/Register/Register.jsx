import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { motion } from 'framer-motion'
import {
    FiUser,
    FiMail,
    FiLock,
    FiEye,
    FiEyeOff,
    FiArrowRight,
    FiCheckCircle,
    FiCheck,
    FiShield,
    FiFilm,
    FiStar,
    FiAward,
    FiTv,
    FiZap,
} from 'react-icons/fi'
import { HiSparkles } from 'react-icons/hi2'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub, FaApple } from 'react-icons/fa6'
import { SMOOTH_EASE } from '../../animations/motionVariants'

const Register = () => {
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [selectedPlan, setSelectedPlan] = useState('vip') // 'free' or 'vip'
    const [agreeTerms, setAgreeTerms] = useState(true)

    // Calculate password strength
    const calculateStrength = (pass) => {
        if (!pass) return { score: 0, label: '', color: 'bg-base-300' }
        let score = 0
        if (pass.length >= 6) score += 1
        if (pass.length >= 10) score += 1
        if (/[A-Z]/.test(pass)) score += 1
        if (/[0-9]/.test(pass)) score += 1
        if (/[^A-Za-z0-9]/.test(pass)) score += 1

        if (score <= 2) return { score: 1, label: 'Weak', color: 'bg-rose-500', text: 'text-rose-500' }
        if (score <= 3) return { score: 2, label: 'Fair', color: 'bg-amber-500', text: 'text-amber-500' }
        if (score <= 4) return { score: 3, label: 'Good', color: 'bg-sky-500', text: 'text-sky-500' }
        return { score: 4, label: 'Strong', color: 'bg-emerald-500', text: 'text-emerald-500' }
    }

    const strength = calculateStrength(password)
    const passwordsMatch = password && confirmPassword && password === confirmPassword
    const passwordsMismatch = password && confirmPassword && password !== confirmPassword

    const handleSubmit = (e) => {
        e.preventDefault()
        // Pure design demonstration - navigate to login or home
        navigate('/login')
    }

    const tierPerks = [
        'Instant access to 10,000+ cinematic movies & series',
        '4K Ultra HD & Dolby Atmos spatial audio',
        'Download & stream offline on mobile & tablet',
        'Zero advertisements, uninterrupted playback',
        'Share up to 4 concurrent screens with family profiles',
    ]

    return (
        <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden py-10 px-4 sm:px-6 lg:px-8">
            {/* Ambient Lighting & Background */}
            <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[600px] w-[900px] rounded-full bg-gradient-to-br from-primary/15 via-secondary/10 to-accent/15 blur-3xl opacity-80" />
                <div className="absolute top-10 -right-20 h-96 w-96 rounded-full bg-accent/15 blur-3xl" />
                <div className="absolute -bottom-20 -left-20 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#8881_1px,transparent_1px),linear-gradient(to_bottom,#8881_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30" />
            </div>

            <div className="w-full max-w-5xl mx-auto grid lg:grid-cols-12 gap-8 items-start">
                {/* Left Side: Membership Perks & Experience Overview */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, ease: SMOOTH_EASE }}
                    className="hidden lg:flex lg:col-span-5 flex-col justify-between p-8 rounded-3xl border border-base-300/60 bg-gradient-to-b from-base-200/80 via-base-200/40 to-base-300/20 backdrop-blur-xl relative overflow-hidden shadow-2xl shadow-black/20"
                >
                    <div className="space-y-5">
                        <div className="inline-flex items-center gap-2 rounded-full border border-secondary/30 bg-secondary/10 px-3.5 py-1.5 text-xs font-bold text-secondary shadow-xs">
                            <HiSparkles className="h-3.5 w-3.5 animate-pulse" />
                            <span>JOIN THE STREAMING REVOLUTION</span>
                        </div>

                        <h1 className="font-display text-3xl font-extrabold tracking-tight text-base-content leading-tight">
                            Start streaming in seconds with{' '}
                            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                                ICSN Pass
                            </span>
                        </h1>

                        <p className="text-xs sm:text-sm text-base-content/70 leading-relaxed">
                            Create your account now and unlock the full cinematic universe with no commitments. Cancel anytime with a single tap.
                        </p>

                        {/* Selected Tier Highlight Card */}
                        <div className="rounded-2xl border border-amber-500/40 bg-gradient-to-br from-amber-500/10 via-base-100/80 to-base-200/80 p-4 shadow-xl">
                            <div className="flex items-center justify-between pb-3 border-b border-amber-500/20">
                                <div className="flex items-center gap-2.5">
                                    <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 text-black font-extrabold shadow-sm">
                                        <FiAward className="h-4 w-4" />
                                    </div>
                                    <div>
                                        <p className="font-display font-extrabold text-sm text-base-content">
                                            ICSN VIP All-Access
                                        </p>
                                        <p className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                                            30-Day Free Trial Included
                                        </p>
                                    </div>
                                </div>
                                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-extrabold text-amber-500 dark:text-amber-400">
                                    Popular
                                </span>
                            </div>

                            <ul className="mt-3 space-y-2">
                                {tierPerks.slice(0, 4).map((perk, i) => (
                                    <li key={i} className="flex items-start gap-2 text-xs text-base-content/80">
                                        <FiCheck className="h-3.5 w-3.5 text-amber-500 shrink-0 mt-0.5" />
                                        <span className="leading-tight">{perk}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="mt-8 pt-6 border-t border-base-300/50 flex items-center justify-between text-[11px] text-base-content/60 font-semibold">
                        <div className="flex items-center gap-1.5">
                            <FiShield className="h-4 w-4 text-primary" />
                            <span>256-Bit SSL Encrypted</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <FiStar className="h-4 w-4 text-amber-400 fill-amber-400" />
                            <span>4.9 / 5 Cinephile Rating</span>
                        </div>
                    </div>
                </motion.div>

                {/* Right Side: Register Form Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: SMOOTH_EASE }}
                    className="w-full lg:col-span-7 max-w-lg mx-auto"
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
                                Create your account
                            </h2>
                            <p className="text-xs sm:text-sm text-base-content/60">
                                Join millions of film fans streaming unlimited entertainment
                            </p>
                        </div>

                        {/* Social Auth Providers */}
                        <div className="grid grid-cols-3 gap-2.5 mb-6">
                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 rounded-xl border border-base-300 bg-base-200/50 hover:bg-base-200 py-2.5 px-3 text-xs font-bold text-base-content transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xs"
                                title="Sign up with Google"
                            >
                                <FcGoogle className="h-4 w-4 shrink-0" />
                                <span className="hidden sm:inline">Google</span>
                            </button>
                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 rounded-xl border border-base-300 bg-base-200/50 hover:bg-base-200 py-2.5 px-3 text-xs font-bold text-base-content transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xs"
                                title="Sign up with Apple"
                            >
                                <FaApple className="h-4 w-4 shrink-0" />
                                <span className="hidden sm:inline">Apple</span>
                            </button>
                            <button
                                type="button"
                                className="flex items-center justify-center gap-2 rounded-xl border border-base-300 bg-base-200/50 hover:bg-base-200 py-2.5 px-3 text-xs font-bold text-base-content transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xs"
                                title="Sign up with GitHub"
                            >
                                <FaGithub className="h-4 w-4 shrink-0" />
                                <span className="hidden sm:inline">GitHub</span>
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="relative flex py-1 items-center mb-5">
                            <div className="flex-grow border-t border-base-300/80"></div>
                            <span className="shrink mx-3 text-[11px] font-bold uppercase tracking-wider text-base-content/40">
                                or register with email
                            </span>
                            <div className="flex-grow border-t border-base-300/80"></div>
                        </div>

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-3.5">
                            {/* Full Name */}
                            <div className="space-y-1">
                                <label className="block text-xs font-bold text-base-content/80">
                                    Full Name
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-base-content/40">
                                        <FiUser className="h-4 w-4" />
                                    </div>
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Christopher Nolan"
                                        className="w-full rounded-xl border border-base-300 bg-base-200/40 pl-10 pr-4 py-2 text-xs sm:text-sm font-medium text-base-content placeholder:text-base-content/35 focus:border-primary focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Email Address */}
                            <div className="space-y-1">
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
                                        placeholder="director@icsn.tv"
                                        className="w-full rounded-xl border border-base-300 bg-base-200/40 pl-10 pr-4 py-2 text-xs sm:text-sm font-medium text-base-content placeholder:text-base-content/35 focus:border-primary focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                </div>
                            </div>

                            {/* Plan Selection Picker */}
                            <div className="space-y-1.5 pt-1">
                                <label className="block text-xs font-bold text-base-content/80">
                                    Choose Plan Type
                                </label>
                                <div className="grid grid-cols-2 gap-2.5">
                                    <button
                                        type="button"
                                        onClick={() => setSelectedPlan('free')}
                                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                                            selectedPlan === 'free'
                                                ? 'border-primary bg-primary/10 ring-1 ring-primary'
                                                : 'border-base-300 bg-base-200/40 hover:bg-base-200/70'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold text-xs text-base-content">Explorer</span>
                                            <span className="text-[10px] font-bold text-base-content/60">Free</span>
                                        </div>
                                        <p className="text-[10px] text-base-content/60 mt-0.5">Standard HD with Ads</p>
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => setSelectedPlan('vip')}
                                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                                            selectedPlan === 'vip'
                                                ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500'
                                                : 'border-base-300 bg-base-200/40 hover:bg-base-200/70'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-1">
                                                <span className="font-bold text-xs text-base-content">VIP Pass</span>
                                                <span className="rounded bg-amber-500 px-1 py-0.2 text-[8px] font-extrabold text-black uppercase">
                                                    Best
                                                </span>
                                            </div>
                                            <span className="text-[10px] font-extrabold text-amber-500">Free 30d</span>
                                        </div>
                                        <p className="text-[10px] text-base-content/60 mt-0.5">4K Ultra HDR, No Ads</p>
                                    </button>
                                </div>
                            </div>

                            {/* Password */}
                            <div className="space-y-1">
                                <label className="block text-xs font-bold text-base-content/80">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-base-content/40">
                                        <FiLock className="h-4 w-4" />
                                    </div>
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Min 6 characters"
                                        className="w-full rounded-xl border border-base-300 bg-base-200/40 pl-10 pr-10 py-2 text-xs sm:text-sm font-medium text-base-content placeholder:text-base-content/35 focus:border-primary focus:bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-base-content/40 hover:text-base-content transition-colors"
                                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                                    </button>
                                </div>

                                {/* Password Strength Meter */}
                                {password && (
                                    <div className="pt-1.5 space-y-1">
                                        <div className="flex items-center justify-between text-[10px]">
                                            <span className="text-base-content/60">Strength</span>
                                            <span className={`font-bold ${strength.text}`}>{strength.label}</span>
                                        </div>
                                        <div className="grid grid-cols-4 gap-1 h-1.5 w-full bg-base-300/50 rounded-full overflow-hidden">
                                            <div className={`h-full rounded-full transition-all duration-300 ${strength.score >= 1 ? strength.color : 'bg-transparent'}`} />
                                            <div className={`h-full rounded-full transition-all duration-300 ${strength.score >= 2 ? strength.color : 'bg-transparent'}`} />
                                            <div className={`h-full rounded-full transition-all duration-300 ${strength.score >= 3 ? strength.color : 'bg-transparent'}`} />
                                            <div className={`h-full rounded-full transition-all duration-300 ${strength.score >= 4 ? strength.color : 'bg-transparent'}`} />
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-1">
                                <label className="block text-xs font-bold text-base-content/80">
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-base-content/40">
                                        <FiLock className="h-4 w-4" />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="Re-enter password"
                                        className={`w-full rounded-xl border bg-base-200/40 pl-10 pr-10 py-2 text-xs sm:text-sm font-medium text-base-content placeholder:text-base-content/35 focus:outline-none focus:ring-2 transition-all ${
                                            passwordsMismatch
                                                ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
                                                : passwordsMatch
                                                ? 'border-emerald-500 focus:border-emerald-500 focus:ring-emerald-500/20'
                                                : 'border-base-300 focus:border-primary focus:bg-base-100 focus:ring-primary/20'
                                        }`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-3.5 text-base-content/40 hover:text-base-content transition-colors"
                                        aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                                    >
                                        {showConfirmPassword ? <FiEyeOff className="h-4 w-4" /> : <FiEye className="h-4 w-4" />}
                                    </button>
                                </div>
                                {passwordsMismatch && (
                                    <p className="text-[10px] text-rose-500 font-semibold">
                                        Passwords do not match
                                    </p>
                                )}
                            </div>

                            {/* Terms & Conditions Checkbox */}
                            <div className="pt-2">
                                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                                    <input
                                        type="checkbox"
                                        required
                                        checked={agreeTerms}
                                        onChange={(e) => setAgreeTerms(e.target.checked)}
                                        className="checkbox checkbox-primary checkbox-xs rounded-md mt-0.5"
                                    />
                                    <span className="text-[11px] leading-tight text-base-content/70">
                                        I agree to the{' '}
                                        <a href="#terms" className="text-primary font-bold hover:underline">
                                            Terms of Service
                                        </a>{' '}
                                        and{' '}
                                        <a href="#privacy" className="text-primary font-bold hover:underline">
                                            Privacy Policy
                                        </a>
                                        .
                                    </span>
                                </label>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                whileHover={{ scale: 1.01 }}
                                whileTap={{ scale: 0.99 }}
                                type="submit"
                                className="group w-full relative flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary via-secondary to-accent px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-200 cursor-pointer overflow-hidden mt-3"
                            >
                                <span>Create Account & Start Watching</span>
                                <FiArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                            </motion.button>
                        </form>

                        {/* Sign In Link */}
                        <div className="mt-5 pt-4 border-t border-base-300/60 text-center">
                            <p className="text-xs text-base-content/70">
                                Already have an ICSN account?{' '}
                                <Link
                                    to="/login"
                                    className="font-bold text-primary hover:text-primary/80 hover:underline transition-colors inline-flex items-center gap-1"
                                >
                                    Sign in
                                    <FiArrowRight className="h-3 w-3 inline" />
                                </Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}

export default Register
