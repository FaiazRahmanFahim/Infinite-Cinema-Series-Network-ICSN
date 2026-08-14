import { FiAlertCircle, FiRefreshCw } from 'react-icons/fi'

function ErrorState({ message = 'Something went wrong while loading content.', onRetry }) {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-error/20 bg-error/5 p-10 text-center">
            <div className="mb-3 grid h-10 w-10 place-items-center rounded-full bg-error/10 text-error">
                <FiAlertCircle className="h-5 w-5" />
            </div>
            <p className="text-sm font-medium text-error max-w-md">{message}</p>

            {onRetry && (
                <button
                    type="button"
                    onClick={onRetry}
                    className="btn btn-xs btn-outline btn-error mt-4 gap-1.5 rounded-lg font-semibold"
                >
                    <FiRefreshCw className="h-3 w-3" />
                    Try Again
                </button>
            )}
        </div>
    )
}

export default ErrorState