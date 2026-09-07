/**
 * ICSN Community Reviews & Ratings Manager
 * Handles local persistence, helpful upvotes, spoiler flags, and mock initial seed reviews.
 */

const STORAGE_KEY = 'icsn_reviews_v1'
const HELPFUL_VOTES_KEY = 'icsn_helpful_votes_v1'

const INITIAL_SEED_REVIEWS = [
    {
        id: 'rev-seed-1',
        mediaId: 'movie-007', // Dune: Part Two
        mediaTitle: 'Dune: Part Two',
        mediaPoster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
        author: 'Elena Rostova',
        avatarId: 'director',
        avatarIcon: '🎬',
        avatarBg: 'from-red-600 to-amber-600',
        badge: 'Verified Critic',
        rating: 10,
        title: 'A monumental sci-fi triumph of modern cinema',
        body: 'Denis Villeneuve has crafted what might be the definitive science-fiction masterpiece of our generation. The sound design in Dolby Atmos shakes you to the core, and Greig Fraser’s cinematography in IMAX format is pure art. Timothée Chalamet and Zendaya carry immense emotional gravity.',
        hasSpoiler: false,
        tags: ['IMAX Masterpiece', 'Sound Design', 'Stunning Visuals'],
        helpfulCount: 42,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    },
    {
        id: 'rev-seed-2',
        mediaId: 'movie-007', // Dune: Part Two
        mediaTitle: 'Dune: Part Two',
        mediaPoster: 'https://image.tmdb.org/t/p/w500/1pdfLvkbY9ohJlCjQH2CZjjYVvJ.jpg',
        author: 'Marcus Vance',
        avatarId: 'noir',
        avatarIcon: '🕵️',
        avatarBg: 'from-neutral-700 to-stone-900',
        badge: 'VIP Cinephile',
        rating: 9,
        title: 'The third act battle and betrayal will leave you speechless',
        body: 'WARNING: The culmination of Paul drinking the Water of Life and challenging the Emperor is executed with unbelievable intensity. Feyd-Rautha’s black-and-white gladiatorial combat scene alone is worth watching three times in a row.',
        hasSpoiler: true,
        tags: ['Plot Twist', 'Must-Watch in 4K', 'Epic Climax'],
        helpfulCount: 29,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    },
    {
        id: 'rev-seed-3',
        mediaId: 'movie-001', // Midnight Horizon / Interstellar-style
        mediaTitle: 'Midnight Horizon',
        mediaPoster: 'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
        author: 'Dr. Arthur Sterling',
        avatarId: 'scifi',
        avatarIcon: '🚀',
        avatarBg: 'from-blue-600 to-indigo-600',
        badge: 'Master Reviewer',
        rating: 10,
        title: 'Transcends science fiction into pure philosophical awe',
        body: 'The depiction of gravitational time dilation near the singularity is terrifyingly beautiful. Zimmer-level organ score and emotional gut-punches make this a film you will remember for decades.',
        hasSpoiler: false,
        tags: ['Mind-Bending', 'Emotional Journey', 'Philosophical'],
        helpfulCount: 38,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 5).toISOString(),
    },
    {
        id: 'rev-seed-4',
        mediaId: 'series-001', // Cyberpunk: Edgerunners
        mediaTitle: 'Cyberpunk: Edgerunners',
        mediaPoster: 'https://image.tmdb.org/t/p/w500/7jEPnvh6vdzPkWk1ip7vdFfPknE.jpg',
        author: 'Kira Neo',
        avatarId: 'cyberpunk',
        avatarIcon: '⚡',
        avatarBg: 'from-fuchsia-600 to-pink-600',
        badge: 'Anime Curator',
        rating: 10,
        title: 'An emotional freight train with breathtaking Studio Trigger animation',
        body: 'I Really Want to Stay at Your House playing in the final moon sequence broke me completely. David’s descent into cyberpsychosis and his sacrifice for Lucy is legendary storytelling.',
        hasSpoiler: true,
        tags: ['Heart-Wrenching', 'Insane Pacing', 'Masterpiece Animation'],
        helpfulCount: 51,
        createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 12).toISOString(),
    },
]

export function getAllReviews() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) {
            return JSON.parse(saved)
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_SEED_REVIEWS))
        return INITIAL_SEED_REVIEWS
    } catch {
        return INITIAL_SEED_REVIEWS
    }
}

export function getReviewsForMedia(mediaId) {
    if (!mediaId) return []
    const all = getAllReviews()
    return all.filter((r) => String(r.mediaId) === String(mediaId))
}

export function saveReview(reviewData) {
    const all = getAllReviews()
    const newReview = {
        id: `rev-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        helpfulCount: 0,
        createdAt: new Date().toISOString(),
        ...reviewData,
    }
    const updated = [newReview, ...all]
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch (e) {
        console.error('Failed to save review:', e)
    }
    return newReview
}

export function deleteReview(reviewId) {
    const all = getAllReviews()
    const updated = all.filter((r) => r.id !== reviewId)
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch (e) {
        console.error('Failed to delete review:', e)
    }
    return updated
}

export function getUserVotes() {
    try {
        const saved = localStorage.getItem(HELPFUL_VOTES_KEY)
        return saved ? JSON.parse(saved) : {}
    } catch {
        return {}
    }
}

export function toggleHelpfulVote(reviewId) {
    const votes = getUserVotes()
    const hasVoted = Boolean(votes[reviewId])
    votes[reviewId] = !hasVoted

    try {
        localStorage.setItem(HELPFUL_VOTES_KEY, JSON.stringify(votes))
    } catch (e) {
        console.error('Failed to save helpful vote state:', e)
    }

    const all = getAllReviews()
    const updated = all.map((r) => {
        if (r.id === reviewId) {
            const currentHelpful = r.helpfulCount || 0
            return {
                ...r,
                helpfulCount: hasVoted ? Math.max(0, currentHelpful - 1) : currentHelpful + 1,
            }
        }
        return r
    })

    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch (e) {
        console.error('Failed to update review helpful count:', e)
    }

    return { hasVoted: !hasVoted, reviews: updated }
}

export function getUserReviews(authorName) {
    const all = getAllReviews()
    if (!authorName) return []
    return all.filter((r) => r.author?.toLowerCase() === authorName.toLowerCase() || r.isCurrentUser)
}

export function getAggregateStats(mediaId, fallbackRating = 8.5) {
    const reviews = getReviewsForMedia(mediaId)
    if (reviews.length === 0) {
        return {
            avgRating: Number(fallbackRating).toFixed(1),
            totalReviews: 0,
            distribution: { 10: 0, 9: 0, 8: 0, 7: 0, 6: 0, low: 0 },
        }
    }

    const total = reviews.reduce((sum, r) => sum + Number(r.rating || 8), 0)
    const avg = (total / reviews.length).toFixed(1)

    const distribution = { 10: 0, 9: 0, 8: 0, 7: 0, 6: 0, low: 0 }
    reviews.forEach((r) => {
        const score = Math.round(Number(r.rating))
        if (score >= 10) distribution[10]++
        else if (score === 9) distribution[9]++
        else if (score === 8) distribution[8]++
        else if (score === 7) distribution[7]++
        else if (score === 6) distribution[6]++
        else distribution.low++
    })

    return {
        avgRating: avg,
        totalReviews: reviews.length,
        distribution,
    }
}
