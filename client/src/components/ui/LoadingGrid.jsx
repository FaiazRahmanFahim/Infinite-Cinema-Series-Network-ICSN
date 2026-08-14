const LoadingGrid = ({ count = 6 }) => {
    return (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {Array.from({ length: count }).map((_, index) => (
                <div
                    key={index}
                    className="overflow-hidden rounded-2xl border border-base-300/40 bg-base-200/50 p-0 shadow-xs"
                >
                    <div className="relative aspect-[2/3] w-full animate-pulse bg-gradient-to-br from-base-300 to-base-200" />

                    <div className="space-y-2.5 p-3.5">
                        <div className="h-4 w-3/4 animate-pulse rounded-md bg-base-300" />
                        <div className="h-3 w-1/2 animate-pulse rounded-md bg-base-300/70" />
                    </div>
                </div>
            ))}

        </div>
    )
}

export default LoadingGrid