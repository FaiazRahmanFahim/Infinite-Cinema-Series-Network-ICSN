const RECENT_VIEWS_KEY = 'icsn_recent_views'
const MAX_RECENT_ITEMS = 10

export const getRecentViews = () => {
    try {
        const stored = localStorage.getItem(RECENT_VIEWS_KEY)
        return stored ? JSON.parse(stored) : []
    } catch {
        return []
    }
}

export const addRecentView = (item) => {
    if (!item || (!item.id && !item._id)) return
    try {
        const itemId = item.id || item._id
        const existing = getRecentViews()

        // Filter out if already present
        const filtered = existing.filter((i) => (i.id || i._id) !== itemId)

        // Insert at beginning with timestamp
        const updated = [
            {
                id: itemId,
                title: item.title,
                poster: item.poster,
                banner: item.banner,
                type: item.type || 'Movie',
                rating: item.rating,
                year: item.year,
                genres: item.genres || [],
                runtime: item.runtime,
                isPremium: item.isPremium,
                trailerUrl: item.trailerUrl,
                director: item.director,
                description: item.description,
                viewedAt: new Date().toISOString(),
            },
            ...filtered,
        ].slice(0, MAX_RECENT_ITEMS)

        localStorage.setItem(RECENT_VIEWS_KEY, JSON.stringify(updated))
        window.dispatchEvent(new CustomEvent('icsn_recent_views_updated', { detail: updated }))
        return updated
    } catch (e) {
        console.error('Failed to save recent view:', e)
        return []
    }
}

export const removeRecentView = (id) => {
    try {
        const existing = getRecentViews()
        const updated = existing.filter((i) => (i.id || i._id) !== id)
        localStorage.setItem(RECENT_VIEWS_KEY, JSON.stringify(updated))
        window.dispatchEvent(new CustomEvent('icsn_recent_views_updated', { detail: updated }))
        return updated
    } catch {
        return []
    }
}

export const clearRecentViews = () => {
    try {
        localStorage.removeItem(RECENT_VIEWS_KEY)
        window.dispatchEvent(new CustomEvent('icsn_recent_views_updated', { detail: [] }))
    } catch {
        // ignore
    }
}
