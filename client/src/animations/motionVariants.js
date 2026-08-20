/**
 * Ultra-Smooth Framer Motion Variants for ICSN Cinema Web App
 * Tuned with cinematic quintic-bezier curves and spring physics for fluid 60fps animations.
 */

// Silky quintic deceleration easing curve
export const SMOOTH_EASE = [0.16, 1, 0.3, 1]
export const SMOOTH_SPRING = { type: 'spring', stiffness: 320, damping: 24, mass: 0.8 }

// Full page transitions
export const pageVariants = {
    initial: {
        opacity: 0,
        y: 12,
    },
    animate: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.45,
            ease: SMOOTH_EASE,
        },
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: {
            duration: 0.25,
            ease: 'easeIn',
        },
    },
}

// Section scroll reveals (used with whileInView)
export const sectionVariants = {
    hidden: {
        opacity: 0,
        y: 20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: SMOOTH_EASE,
        },
    },
}

// Staggered container for grids & lists
export const containerVariants = {
    hidden: {
        opacity: 0,
    },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.04,
            delayChildren: 0.05,
        },
    },
}

// Fast staggered container for quick lists
export const fastContainerVariants = {
    hidden: {
        opacity: 0,
    },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.025,
            delayChildren: 0.02,
        },
    },
}

// Media Card / Grid Item animation
export const itemVariants = {
    hidden: {
        opacity: 0,
        y: 16,
        scale: 0.97,
    },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.45,
            ease: SMOOTH_EASE,
        },
    },
}

// Slide down for dropdowns, active filter alerts, search bars
export const slideDownVariants = {
    hidden: {
        opacity: 0,
        y: -14,
        height: 0,
    },
    visible: {
        opacity: 1,
        y: 0,
        height: 'auto',
        transition: {
            duration: 0.4,
            ease: SMOOTH_EASE,
        },
    },
    exit: {
        opacity: 0,
        y: -12,
        height: 0,
        transition: {
            duration: 0.25,
            ease: 'easeIn',
        },
    },
}

// Modal dialog entrance (e.g. video trailer player)
export const modalVariants = {
    hidden: {
        opacity: 0,
        scale: 0.94,
        y: 16,
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.35,
            ease: SMOOTH_EASE,
        },
    },
    exit: {
        opacity: 0,
        scale: 0.96,
        y: 10,
        transition: {
            duration: 0.2,
            ease: 'easeIn',
        },
    },
}

// Fade in with scale (for badges, chips, hero highlights)
export const scaleInVariants = {
    hidden: {
        opacity: 0,
        scale: 0.96,
        y: 8,
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            duration: 0.5,
            ease: SMOOTH_EASE,
        },
    },
}

// Card hover spring animation
export const cardHoverTransition = {
    type: 'spring',
    stiffness: 350,
    damping: 25,
    mass: 0.6,
}

// Standard viewport trigger settings
export const defaultViewport = {
    once: true,
    margin: '-40px',
    amount: 0.1,
}
