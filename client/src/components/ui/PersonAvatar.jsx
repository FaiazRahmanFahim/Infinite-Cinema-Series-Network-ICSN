import React, { useState } from 'react'
import { getPersonImage } from '../../utils/personImages'

/**
 * Reusable PersonAvatar component that renders an actor/director's portrait with
 * graceful fallback handling on image load error.
 */
const PersonAvatar = ({ name, size = 'md', className = '', showBorder = true }) => {
    const [imgError, setImgError] = useState(false)
    const initialUrl = getPersonImage(name)
    const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'ICSN')}&background=18181b&color=6366f1&bold=true&size=256&font-size=0.4`

    const sizeClasses = {
        xs: 'h-6 w-6 text-[10px]',
        sm: 'h-8 w-8 text-xs',
        md: 'h-11 w-11 text-sm',
        lg: 'h-16 w-16 text-lg',
        xl: 'h-24 w-24 text-2xl sm:h-28 sm:w-28 sm:text-3xl',
        '2xl': 'h-32 w-32 text-4xl',
    }

    const currentSize = sizeClasses[size] || sizeClasses.md

    return (
        <div
            className={`relative shrink-0 overflow-hidden rounded-full bg-base-300 ${currentSize} ${
                showBorder ? 'border border-base-300/80 shadow-sm' : ''
            } ${className}`}
        >
            <img
                src={imgError ? fallbackUrl : initialUrl}
                alt={name || 'Person avatar'}
                loading="lazy"
                onError={() => {
                    if (!imgError) setImgError(true)
                }}
                className="h-full w-full object-cover object-top transition-transform duration-300 group-hover:scale-105"
            />
        </div>
    )
}

export default PersonAvatar
