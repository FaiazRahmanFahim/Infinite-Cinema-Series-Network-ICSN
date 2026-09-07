/**
 * Curated portraits and fallback image resolver for Cast, Directors, and Creators.
 * All image data is loaded dynamically from /personImages.json.
 */

let personImagesData = {}

// Fetch and cache person portraits from personImages.json
if (typeof fetch !== 'undefined') {
    fetch('/personImages.json')
        .then((res) => res.json())
        .then((data) => {
            personImagesData = data || {}
        })
        .catch(() => {})
}

/**
 * Returns a high-res portrait image URL for any person (cast or director).
 * Falls back to an ultra-clean UI Avatars SVG generator if not explicitly found.
 */
export function getPersonImage(name) {
    if (!name) return 'https://ui-avatars.com/api/?name=ICSN&background=18181b&color=e4e4e7&bold=true&size=256'
    
    const trimmed = name.trim()
    
    // Check exact or case-insensitive match from personImagesData
    if (personImagesData[trimmed]) {
        return personImagesData[trimmed]
    }
    
    const lower = trimmed.toLowerCase()
    for (const [key, url] of Object.entries(personImagesData)) {
        if (key.toLowerCase() === lower) {
            return url
        }
    }
    
    // Fallback: Generate a high quality initials avatar with dark cinematic theme styling
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(trimmed)}&background=18181b&color=6366f1&bold=true&size=256&font-size=0.4`
}

/**
 * Checks if a custom portrait exists for a person in personImages.json
 */
export function hasCustomPortrait(name) {
    if (!name) return false
    const trimmed = name.trim().toLowerCase()
    return Object.keys(personImagesData).some((k) => k.toLowerCase() === trimmed)
}
