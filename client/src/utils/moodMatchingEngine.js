/**
 * Mood & Vibe Matching Engine for ICSN
 * Evaluates a media item against selected mood, time budget, and vibe tags.
 */

export const MOODS = [
    {
        id: 'mind_bending',
        title: 'Mind-Bending & Cosmic',
        subtitle: 'Sci-Fi, Psychological Twists & Infinite Realities',
        icon: '🌌',
        gradient: 'from-indigo-600 via-purple-600 to-pink-600',
        borderColor: 'border-purple-500/50',
        genres: ['Sci-Fi', 'Mystery', 'Thriller'],
        preferredKeywords: ['space', 'future', 'reality', 'mind', 'time', 'quantum', 'dimension'],
    },
    {
        id: 'adrenaline_rush',
        title: 'Adrenaline Rush & High Stakes',
        subtitle: 'Non-stop Action, Explosive Tension & Chases',
        icon: '⚡',
        gradient: 'from-amber-500 via-orange-600 to-red-600',
        borderColor: 'border-orange-500/50',
        genres: ['Action', 'Thriller', 'Crime', 'Adventure'],
        preferredKeywords: ['war', 'fight', 'chase', 'heist', 'survival', 'speed', 'mission'],
    },
    {
        id: 'cozy_comfort',
        title: 'Cozy, Heartwarming & Feel-Good',
        subtitle: 'Animation, Uplifting Comedy & Comfort Cinema',
        icon: '☕',
        gradient: 'from-emerald-500 via-teal-600 to-cyan-600',
        borderColor: 'border-emerald-500/50',
        genres: ['Animation', 'Comedy', 'Adventure', 'Family'],
        preferredKeywords: ['heart', 'friend', 'journey', 'spirit', 'magic', 'dream', 'laugh'],
    },
    {
        id: 'dark_noir',
        title: 'Dark Noir & Gritty Crime',
        subtitle: 'Shadowy Thrillers, Detectives & Underworld Sagas',
        icon: '🕵️',
        gradient: 'from-neutral-800 via-stone-800 to-amber-900',
        borderColor: 'border-amber-600/50',
        genres: ['Crime', 'Thriller', 'Drama', 'Mystery'],
        preferredKeywords: ['detective', 'murder', 'underworld', 'conspiracy', 'city', 'dark', 'secret'],
    },
    {
        id: 'visually_stunning',
        title: 'Visually Stunning Masterpieces',
        subtitle: 'IMAX 4K Grandeur, Worldbuilding & Pure Eye-Candy',
        icon: '🎨',
        gradient: 'from-cyan-500 via-blue-600 to-indigo-700',
        borderColor: 'border-cyan-500/50',
        genres: ['Sci-Fi', 'Adventure', 'Fantasy', 'Action'],
        preferredKeywords: ['visual', 'cinematic', 'epic', 'world', 'journey', 'imax', 'universe'],
    },
    {
        id: 'deep_emotion',
        title: 'Deep Emotion & Character Journey',
        subtitle: 'Profound Storytelling, Human Drama & Impact',
        icon: '🎭',
        gradient: 'from-rose-600 via-pink-600 to-amber-600',
        borderColor: 'border-rose-500/50',
        genres: ['Drama', 'Biography', 'History', 'Romance'],
        preferredKeywords: ['life', 'love', 'human', 'struggle', 'hope', 'family', 'destiny'],
    },
]

export const TIME_BUDGETS = [
    {
        id: 'quick_bite',
        title: 'Quick Watch (< 100 mins)',
        subtitle: 'Fast, snackable cinematic thrills',
        icon: '⏱️',
        maxMinutes: 105,
        typePreference: 'Movie',
    },
    {
        id: 'standard_feature',
        title: 'Standard Feature (100 - 140 mins)',
        subtitle: 'The golden classic movie night length',
        icon: '🎬',
        minMinutes: 95,
        maxMinutes: 145,
        typePreference: 'Movie',
    },
    {
        id: 'grand_epic',
        title: 'Grand Cinematic Epic (140+ mins)',
        subtitle: 'Deeply immersive, sprawling blockbusters',
        icon: '🍿',
        minMinutes: 135,
        typePreference: 'Movie',
    },
    {
        id: 'series_binge',
        title: 'Binge-Worthy Series',
        subtitle: 'Multi-episode season arcs & TV sagas',
        icon: '📺',
        typePreference: 'Series',
    },
    {
        id: 'surprise_duration',
        title: 'Any Duration / Surprise Me',
        subtitle: 'Great stories regardless of runtime',
        icon: '🎲',
        any: true,
    },
]

export const VIBE_MODIFIERS = [
    {
        id: 'critically_acclaimed',
        label: '⭐ High Rating (8.5+ IMDb)',
        desc: 'Only top-tier acclaimed masterpieces',
    },
    {
        id: 'vip_quality',
        label: '💎 VIP 4K & Dolby Atmos',
        desc: 'Master visual & audio transfers',
    },
    {
        id: 'mind_twists',
        label: '🧠 Plot Twists & Mind Games',
        desc: 'Keeps you guessing until the final minute',
    },
    {
        id: 'international_anime',
        label: '🌸 International & Anime Gems',
        desc: 'Top global and Japanese animation storytelling',
    },
    {
        id: 'popcorn_fun',
        label: '🍿 Pure Popcorn Entertainment',
        desc: 'High replay value and crowd-pleasing pacing',
    },
]

/**
 * Parses runtime string (e.g. '2h 46m', '105 min', '10 Episodes') to estimated minutes
 */
export function parseRuntimeMinutes(runtime) {
    if (!runtime) return 110
    const str = String(runtime)

    const hourMatch = str.match(/(\d+)\s*h/)
    const minMatch = str.match(/(\d+)\s*m/)
    const epMatch = str.match(/(\d+)\s*Ep/)

    let total = 0
    if (hourMatch) total += parseInt(hourMatch[1], 10) * 60
    if (minMatch) total += parseInt(minMatch[1], 10)
    if (epMatch) total += parseInt(epMatch[1], 10) * 45 // ~45 mins per episode

    return total > 0 ? total : 110
}

/**
 * Calculates match score between 0 and 100 and builds reasoning tags
 */
export function calculateMatchScore(item, { moodId, timeBudgetId, selectedModifiers = [] }) {
    let score = 50 // Base score

    const reasons = []
    const moodConfig = MOODS.find((m) => m.id === moodId)
    const timeConfig = TIME_BUDGETS.find((t) => t.id === timeBudgetId)

    // 1. MOOD & GENRE ALIGNMENT (Up to +25)
    if (moodConfig) {
        const itemGenres = item.genres || []
        const matchedGenres = itemGenres.filter((g) => moodConfig.genres.includes(g))

        if (matchedGenres.length >= 2) {
            score += 24
            reasons.push(`Strong fit for ${matchedGenres.join(' & ')} lovers`)
        } else if (matchedGenres.length === 1) {
            score += 15
            reasons.push(`Matches your ${matchedGenres[0]} mood`)
        }

        // Check description keywords
        const descLower = (item.description || '').toLowerCase()
        const keywordHit = moodConfig.preferredKeywords.some((kw) => descLower.includes(kw))
        if (keywordHit) {
            score += 5
        }
    }

    // 2. TIME BUDGET & FORMAT FIT (Up to +15)
    if (timeConfig) {
        const isSeries = (item.type || '').toLowerCase() === 'series'
        const minutes = parseRuntimeMinutes(item.runtime)

        if (timeConfig.id === 'series_binge') {
            if (isSeries) {
                score += 15
                reasons.push(`Binge-ready TV series (${item.runtime || 'Multi-episode'})`)
            } else {
                score -= 10
            }
        } else if (timeConfig.id === 'quick_bite') {
            if (!isSeries && minutes <= 105) {
                score += 15
                reasons.push(`Snackable runtime (${item.runtime || '< 100m'})`)
            } else if (!isSeries && minutes <= 115) {
                score += 8
            }
        } else if (timeConfig.id === 'grand_epic') {
            if (!isSeries && minutes >= 135) {
                score += 15
                reasons.push(`Grand immersive epic (${item.runtime})`)
            } else if (!isSeries && minutes >= 120) {
                score += 8
            }
        } else if (timeConfig.id === 'standard_feature') {
            if (!isSeries && minutes >= 95 && minutes <= 145) {
                score += 15
                reasons.push(`Perfect feature length (${item.runtime})`)
            }
        } else if (timeConfig.id === 'surprise_duration') {
            score += 12
        }
    }

    // 3. RATING BOOST (Up to +10)
    const ratingNum = Number(item.rating) || 8.0
    if (ratingNum >= 8.8) {
        score += 10
    } else if (ratingNum >= 8.4) {
        score += 7
    } else if (ratingNum >= 7.8) {
        score += 4
    }

    // 4. VIBE MODIFIERS (Up to +15)
    selectedModifiers.forEach((modId) => {
        if (modId === 'critically_acclaimed') {
            if (ratingNum >= 8.5) {
                score += 5
                reasons.push(`★ ${ratingNum.toFixed(1)} IMDb Masterpiece`)
            }
        }
        if (modId === 'vip_quality') {
            if (item.isPremium || item.videoQuality || item.audio) {
                score += 6
                reasons.push(`Master 4K UHD & ${item.audio || 'Dolby Atmos'}`)
            }
        }
        if (modId === 'international_anime') {
            const isAnime = (item.type || '').toLowerCase() === 'animation' || item.genres?.includes('Animation')
            const isIntl = item.country && !item.country.includes('United States')
            if (isAnime || isIntl) {
                score += 6
                reasons.push(isAnime ? 'Signature Animation gem' : `Acclaimed ${item.country} cinema`)
            }
        }
        if (modId === 'mind_twists') {
            const hasMystery = item.genres?.some((g) => ['Mystery', 'Sci-Fi', 'Thriller'].includes(g))
            if (hasMystery) {
                score += 5
                reasons.push('Mind-bending twists & turns')
            }
        }
        if (modId === 'popcorn_fun') {
            if (item.popularity && item.popularity >= 90) {
                score += 5
                reasons.push('Crowd-pleasing, high-energy entertainment')
            }
        }
    })

    // Random micro variance (±2%) to keep repeated rolls fresh
    const jitter = Math.floor(Math.random() * 3)
    score += jitter

    // Clamp between 70% and 99%
    const finalScore = Math.min(99, Math.max(72, score))

    return {
        score: finalScore,
        reasons: reasons.slice(0, 3),
        primaryReason: reasons[0] || 'Matches your selected mood & timing',
    }
}

/**
 * Matches and ranks all media items against wizard inputs
 */
export function rankMediaForVibe(allMedia, { moodId, timeBudgetId, selectedModifiers = [] }) {
    if (!Array.isArray(allMedia) || allMedia.length === 0) return []

    const scoredList = allMedia.map((item) => {
        const matchData = calculateMatchScore(item, { moodId, timeBudgetId, selectedModifiers })
        return {
            ...item,
            matchScore: matchData.score,
            matchReasons: matchData.reasons,
            primaryReason: matchData.primaryReason,
        }
    })

    // Sort highest score first
    return scoredList.sort((a, b) => b.matchScore - a.matchScore)
}
