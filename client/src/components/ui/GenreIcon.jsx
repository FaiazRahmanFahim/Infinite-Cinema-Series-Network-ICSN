import {
    FiZap,
    FiCompass,
    FiFilm,
    FiSmile,
    FiShield,
    FiFeather,
    FiStar,
    FiEye,
    FiHelpCircle,
    FiHeart,
    FiCpu,
    FiTarget,
    FiGrid,
} from 'react-icons/fi'

const iconMap = {
    FiZap: FiZap,
    FiCompass: FiCompass,
    FiFilm: FiFilm,
    FiSmile: FiSmile,
    FiShield: FiShield,
    FiFeather: FiFeather,
    FiStar: FiStar,
    FiEye: FiEye,
    FiHelpCircle: FiHelpCircle,
    FiHeart: FiHeart,
    FiCpu: FiCpu,
    FiTarget: FiTarget,
    // Genre name fallbacks
    action: FiZap,
    adventure: FiCompass,
    animation: FiFilm,
    comedy: FiSmile,
    crime: FiShield,
    drama: FiFeather,
    fantasy: FiStar,
    horror: FiEye,
    mystery: FiHelpCircle,
    romance: FiHeart,
    'sci-fi': FiCpu,
    scifi: FiCpu,
    thriller: FiTarget,
}

function GenreIcon({ name, iconName, className = 'h-4 w-4' }) {
    const key = iconName || (name ? name.toLowerCase().trim() : '')
    const IconComponent = iconMap[key] || iconMap[iconName] || FiGrid
    return <IconComponent className={className} />
}

export default GenreIcon
