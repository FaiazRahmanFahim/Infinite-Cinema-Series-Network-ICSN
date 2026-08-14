import { Link } from 'react-router'
import { FiArrowRight } from 'react-icons/fi'

const SectionHeader = ({ title, description, badge, viewAllLink, viewAllText = 'View All' }) => {
    return (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between border-b border-base-300/40 pb-4">
            <div className="space-y-1">
                {badge && (
                    <span className="inline-block rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary tracking-wide">
                        {badge}
                    </span>
                )}

                <h2 className="font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
                    {title}
                </h2>

                {description && (
                    <p className="max-w-2xl text-xs sm:text-sm text-base-content/65 leading-relaxed">
                        {description}
                    </p>
                )}
            </div>

            {viewAllLink && (
                <Link
                    to={viewAllLink}
                    className="group inline-flex items-center gap-1.5 self-start sm:self-auto rounded-xl border border-base-300/80 bg-base-200/50 px-3.5 py-2 text-xs font-bold text-base-content/80 hover:border-primary/40 hover:bg-primary/10 hover:text-primary transition-all duration-200 shadow-xs"
                    aria-label={`${viewAllText} ${title}`}
                >
                    <span>{viewAllText}</span>
                    <FiArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                </Link>
            )}
        </div>
    )
}

export default SectionHeader