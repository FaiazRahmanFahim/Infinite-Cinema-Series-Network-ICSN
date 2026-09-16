/**
 * Episode and Season Progress Tracker Utility for ICSN
 * Manages episode status, season progression, and auto-generates realistic episode metadata
 */

const STORAGE_KEY = 'icsn_series_episodes_v1'
export const EPISODE_UPDATE_EVENT = 'icsn_episode_update'

// Realistic episode title thematic words based on genres
const EPISODE_THEMES = [
    'The Beginning of the End', 'Shadows in the Mist', 'The Signal', 'Fractured Reality',
    'Point of No Return', 'The Long Dark', 'Echoes of the Past', 'Midnight Rendezvous',
    'The Turning Tide', 'Convergence', 'Ascension', 'The Hidden Truth',
    'Breaking Point', 'The Final Frontier', 'A Whisper in the Noise', 'Ghosts in the Machine',
    'Lost Horizon', 'The Reckoning', 'Edge of Oblivion', 'Resurrection',
    'The Grand Illusion', 'Nexus', 'Zero Hour', 'Legacy of Kings'
]

/**
 * Retrieve all episode tracking data from localStorage
 */
export function getAllEpisodeProgress() {
    try {
        const data = localStorage.getItem(STORAGE_KEY)
        return data ? JSON.parse(data) : {}
    } catch {
        return {}
    }
}

/**
 * Save tracking data to localStorage and emit custom update event
 */
function saveAllEpisodeProgress(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
        window.dispatchEvent(new CustomEvent(EPISODE_UPDATE_EVENT, { detail: data }))
    } catch (e) {
        console.error('Failed to save episode progress:', e)
    }
}

/**
 * Parse runtime string like "4 Seasons • 34 Episodes" or "10 Episodes" into numbers
 */
export function parseSeriesSpecs(seriesItem) {
    if (!seriesItem) return { seasons: 1, totalEpisodes: 10 }
    
    const runtimeStr = seriesItem.runtime || ''
    let seasons = 1
    let totalEpisodes = 10

    // Match "X Seasons" or "X Season"
    const seasonMatch = runtimeStr.match(/(\d+)\s*Seasons?/i)
    if (seasonMatch) {
        seasons = Math.max(1, parseInt(seasonMatch[1], 10))
    }

    // Match "Y Episodes" or "Y Episode"
    const epMatch = runtimeStr.match(/(\d+)\s*Episodes?/i)
    if (epMatch) {
        totalEpisodes = Math.max(1, parseInt(epMatch[1], 10))
    } else if (seasonMatch) {
        // Estimate approx 8-10 episodes per season if not specified
        totalEpisodes = seasons * 8
    }

    return { seasons, totalEpisodes }
}

/**
 * Generate full season and episode catalog for any series item
 */
export function getSeriesCatalog(seriesItem) {
    if (!seriesItem) return []
    
    const { seasons: seasonCount, totalEpisodes } = parseSeriesSpecs(seriesItem)
    const baseYear = seriesItem.year || 2024
    
    // Distribute total episodes across seasons
    const epsPerSeason = Math.max(1, Math.floor(totalEpisodes / seasonCount))
    const remainder = totalEpisodes % seasonCount

    const seasons = []

    for (let s = 1; s <= seasonCount; s++) {
        const count = epsPerSeason + (s <= remainder ? 1 : 0)
        const seasonYear = baseYear + (s - 1)
        const episodes = []

        for (let e = 1; e <= count; e++) {
            const epIndex = (s - 1) * epsPerSeason + (e - 1)
            const titleTemplate = EPISODE_THEMES[epIndex % EPISODE_THEMES.length]
            const runtimeMinutes = 45 + ((s * 3 + e * 7) % 20) // 45m - 64m
            
            episodes.push({
                id: `s${s}e${e}`,
                seasonNumber: s,
                episodeNumber: e,
                code: `S${String(s).padStart(2, '0')}E${String(e).padStart(2, '0')}`,
                title: `${titleTemplate}`,
                overview: `As tensions escalate in Season ${s}, unexpected revelations challenge everything the team believed about their mission and alliances.`,
                runtime: `${runtimeMinutes}m`,
                airDate: `${seasonYear}-${String((e % 12) + 1).padStart(2, '0')}-${String(((e * 3) % 28) + 1).padStart(2, '0')}`,
                rating: (Math.min(9.8, (seriesItem.rating || 8.0) + ((e % 5) - 2) * 0.15)).toFixed(1),
            })
        }

        seasons.push({
            seasonNumber: s,
            title: `Season ${s}`,
            year: seasonYear,
            episodeCount: episodes.length,
            episodes,
        })
    }

    return seasons
}

/**
 * Get detailed progress for a given series item
 */
export function getSeriesProgress(seriesId, seriesItem) {
    if (!seriesId) return { totalEpisodes: 0, watchedCount: 0, percentage: 0, nextEpisode: null, isCompleted: false, seasonProgress: [], watchedMap: {} }
    
    const allProgress = getAllEpisodeProgress()
    const seriesData = allProgress[seriesId] || { watched: {} }
    const watchedMap = seriesData.watched || {}

    const seasons = getSeriesCatalog(seriesItem)
    let totalEpisodes = 0
    let watchedCount = 0
    let nextEpisode = null
    const seasonProgress = []

    for (const season of seasons) {
        let seasonWatched = 0
        for (const ep of season.episodes) {
            totalEpisodes++
            const isWatched = !!watchedMap[ep.id]
            if (isWatched) {
                watchedCount++
                seasonWatched++
            } else if (!nextEpisode) {
                nextEpisode = ep
            }
        }
        seasonProgress.push({
            seasonNumber: season.seasonNumber,
            title: season.title,
            totalEpisodes: season.episodes.length,
            watchedCount: seasonWatched,
            percentage: season.episodes.length > 0 ? Math.round((seasonWatched / season.episodes.length) * 100) : 0,
        })
    }

    const percentage = totalEpisodes > 0 ? Math.round((watchedCount / totalEpisodes) * 100) : 0
    const isCompleted = totalEpisodes > 0 && watchedCount >= totalEpisodes

    return {
        totalEpisodes,
        watchedCount,
        percentage,
        nextEpisode: isCompleted ? null : nextEpisode,
        isCompleted,
        lastWatched: seriesData.lastWatched || null,
        seasonProgress,
        watchedMap,
    }
}

/**
 * Toggle a single episode watched status
 */
export function toggleEpisodeWatched(seriesId, seriesItem, seasonNum, epNum) {
    if (!seriesId) return false
    
    const epId = `s${seasonNum}e${epNum}`
    const allProgress = getAllEpisodeProgress()
    const current = allProgress[seriesId] || { watched: {} }
    const wasWatched = !!current.watched[epId]
    
    const updatedWatched = { ...current.watched }
    if (wasWatched) {
        delete updatedWatched[epId]
    } else {
        updatedWatched[epId] = true
    }

    allProgress[seriesId] = {
        ...current,
        watched: updatedWatched,
        lastWatched: !wasWatched ? { season: seasonNum, episode: epNum, at: new Date().toISOString() } : current.lastWatched,
    }

    saveAllEpisodeProgress(allProgress)
    return !wasWatched
}

/**
 * Mark all episodes of a season as watched or unwatched
 */
export function markSeasonWatched(seriesId, seriesItem, seasonNum, markWatched = true) {
    if (!seriesId) return
    
    const seasons = getSeriesCatalog(seriesItem)
    const targetSeason = seasons.find((s) => s.seasonNumber === seasonNum)
    if (!targetSeason) return

    const allProgress = getAllEpisodeProgress()
    const current = allProgress[seriesId] || { watched: {} }
    const updatedWatched = { ...current.watched }

    for (const ep of targetSeason.episodes) {
        if (markWatched) {
            updatedWatched[ep.id] = true
        } else {
            delete updatedWatched[ep.id]
        }
    }

    allProgress[seriesId] = {
        ...current,
        watched: updatedWatched,
        lastWatched: markWatched && targetSeason.episodes.length > 0
            ? { season: seasonNum, episode: targetSeason.episodes[targetSeason.episodes.length - 1].episodeNumber, at: new Date().toISOString() }
            : current.lastWatched,
    }

    saveAllEpisodeProgress(allProgress)
}

/**
 * Mark an entire series as completely watched or unwatched
 */
export function markEntireSeriesWatched(seriesId, seriesItem, markWatched = true) {
    if (!seriesId) return
    
    const seasons = getSeriesCatalog(seriesItem)
    const allProgress = getAllEpisodeProgress()
    const current = allProgress[seriesId] || { watched: {} }
    const updatedWatched = markWatched ? {} : {}

    if (markWatched) {
        for (const season of seasons) {
            for (const ep of season.episodes) {
                updatedWatched[ep.id] = true
            }
        }
    }

    allProgress[seriesId] = {
        ...current,
        watched: updatedWatched,
        lastWatched: markWatched ? { at: new Date().toISOString(), completed: true } : null,
    }

    saveAllEpisodeProgress(allProgress)
}

/**
 * Advance to next unwatched episode (1-click increment)
 */
export function advanceNextEpisode(seriesId, seriesItem) {
    const progress = getSeriesProgress(seriesId, seriesItem)
    if (progress.nextEpisode) {
        toggleEpisodeWatched(
            seriesId,
            seriesItem,
            progress.nextEpisode.seasonNumber,
            progress.nextEpisode.episodeNumber
        )
        return progress.nextEpisode
    }
    return null
}

/**
 * Get aggregate TV stats across all watched series for Profile/Analytics
 */
export function getOverallTvStats(allMediaList = []) {
    const allProgress = getAllEpisodeProgress()
    let totalEpisodesWatched = 0
    let totalSeriesStarted = 0
    let totalSeriesCompleted = 0
    const activeSeriesList = []

    for (const [seriesId, data] of Object.entries(allProgress)) {
        const watchedCount = Object.keys(data.watched || {}).length
        if (watchedCount > 0) {
            totalEpisodesWatched += watchedCount
            totalSeriesStarted++
            
            const media = allMediaList.find((m) => String(m.id || m._id) === String(seriesId))
            if (media) {
                const progress = getSeriesProgress(seriesId, media)
                if (progress.isCompleted) {
                    totalSeriesCompleted++
                } else {
                    activeSeriesList.push({
                        media,
                        progress,
                    })
                }
            }
        }
    }

    // Average episode runtime is ~48 minutes
    const totalMinutes = totalEpisodesWatched * 48
    const totalHours = Math.round(totalMinutes / 60)

    return {
        totalEpisodesWatched,
        totalHours,
        totalSeriesStarted,
        totalSeriesCompleted,
        activeSeriesList,
    }
}
