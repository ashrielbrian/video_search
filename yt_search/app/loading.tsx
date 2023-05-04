
const Loading = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-200">
            <svg className="animate-spin h-10 w-10 text-gray-800" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm12 0a8 8 0 100-16v3a5 5 0 015 5h3zM2.05 15.463A9.956 9.956 0 0112 6.033v3.013c-3.125 0-5.958 1.36-7.918 3.51l-1.032-1.093z" />
            </svg>
            <h2 className="mt-4 text-xl font-semibold text-gray-800">Loading...</h2>
        </div>
    )
}
export default Loading;