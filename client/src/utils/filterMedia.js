/**
 * Utility to filter and sort media items across multiple criteria:
 * - type (Movie, Series, Animation)
 * - country (United States, Japan, South Korea, United Kingdom, Germany, etc.)
 * - language (English, Japanese, Korean, German, etc.)
 * - year (Specific year e.g. 2026 or decade range e.g. 2010s)
 * - genre / genres (Single or multiple genres)
 * - search (Title, Cast, Director, Description, Genre)
 * - sort (latest, popularity, rating / imdb, oldest, title)
 */

export function filterAndSortMedia(items = [], options = {}) {
    if (!Array.isArray(items)) return []

    const {
        type = '',
        country = '',
        language = '',
        year = '',
        genre = '',
        genres = [],
        search = '',
        sort = 'popularity', // default to popularity
    } = options

    let result = [...items]

    // 1. Filter by Type
    if (type && type.toLowerCase() !== 'all') {
        result = result.filter(
            (item) => item.type?.toLowerCase() === type.toLowerCase()
        )
    }

    // 2. Filter by Country
    if (country && country.toLowerCase() !== 'all') {
        result = result.filter(
            (item) => item.country?.toLowerCase() === country.toLowerCase()
        )
    }

    // 3. Filter by Language
    if (language && language.toLowerCase() !== 'all') {
        result = result.filter(
            (item) => item.language?.toLowerCase() === language.toLowerCase()
        )
    }

    // 4. Filter by Year or Decade Range
    if (year && year.toLowerCase() !== 'all') {
        if (year === '2020s') {
            result = result.filter((item) => item.year >= 2020 && item.year <= 2029)
        } else if (year === '2010s') {
            result = result.filter((item) => item.year >= 2010 && item.year <= 2019)
        } else if (year === '2000s') {
            result = result.filter((item) => item.year >= 2000 && item.year <= 2009)
        } else if (year === 'classic') {
            result = result.filter((item) => item.year < 2000)
        } else {
            const numYear = Number(year)
            if (!isNaN(numYear)) {
                result = result.filter((item) => Number(item.year) === numYear)
            }
        }
    }

    // 5. Filter by Genre(s)
    // Supports single genre string or array of genres or comma-separated string
    const targetGenres = []
    if (Array.isArray(genres) && genres.length > 0) {
        targetGenres.push(...genres.map((g) => g.toLowerCase().trim()))
    } else if (typeof genres === 'string' && genres.trim()) {
        targetGenres.push(...genres.split(',').map((g) => g.toLowerCase().trim()))
    }
    if (genre && genre.toLowerCase() !== 'all') {
        const lowerG = genre.toLowerCase().trim()
        if (!targetGenres.includes(lowerG)) {
            targetGenres.push(lowerG)
        }
    }

    if (targetGenres.length > 0) {
        result = result.filter((item) => {
            if (!Array.isArray(item.genres)) return false
            const itemGenresLower = item.genres.map((g) => g.toLowerCase())
            // Item matches if it contains ALL selected genres (or any if only 1 is selected)
            return targetGenres.every((tg) => itemGenresLower.includes(tg))
        })
    }

    // 6. Filter by Search Query
    if (search && search.trim()) {
        const q = search.toLowerCase().trim()
        result = result.filter(
            (item) =>
                item.title?.toLowerCase().includes(q) ||
                item.description?.toLowerCase().includes(q) ||
                item.tagline?.toLowerCase().includes(q) ||
                item.director?.toLowerCase().includes(q) ||
                item.creator?.toLowerCase().includes(q) ||
                item.cast?.some((c) => c.toLowerCase().includes(q)) ||
                item.genres?.some((g) => g.toLowerCase().includes(q)) ||
                item.country?.toLowerCase().includes(q) ||
                item.language?.toLowerCase().includes(q) ||
                String(item.year).includes(q)
        )
    }

    // 7. Sort Media
    result.sort((a, b) => {
        switch (sort) {
            case 'latest':
            case 'newest':
                return (b.year || 0) - (a.year || 0)

            case 'oldest':
                return (a.year || 0) - (b.year || 0)

            case 'rating':
            case 'imdb':
            case 'mibd':
                return (b.rating || 0) - (a.rating || 0)

            case 'title':
            case 'az':
                return (a.title || '').localeCompare(b.title || '')

            case 'title_desc':
            case 'za':
                return (b.title || '').localeCompare(a.title || '')

            case 'popularity':
            default:
                return (b.popularity || 0) - (a.popularity || 0)
        }
    })

    return result
}
