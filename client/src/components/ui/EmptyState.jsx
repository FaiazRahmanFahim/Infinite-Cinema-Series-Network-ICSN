import { FiFilm } from 'react-icons/fi'

function EmptyState({ message = 'No content available right now.' }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-base-300 bg-base-200/40 p-12 text-center">
            <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-base-300/80 text-base-content/40">
                <FiFilm className="h-6 w-6" />
            </div>
            <p className="text-sm font-medium text-base-content/70">{message}</p>
        </div>
    )
}

export default EmptyState