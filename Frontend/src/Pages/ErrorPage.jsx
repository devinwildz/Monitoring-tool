export default function ErrorPage() {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-green-500">404</h1>
                <h2 className="mt-4 text-2xl font-semibold">Page Not Found</h2>
                <p className="mt-2 text-gray-400">
                    Sorry, the page you are looking for does not exist or has been moved.
                </p>
                <a
                    href="/"
                    className="mt-6 inline-block px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-400 transition duration-300"
                >
                    Go Back Home
                </a>
            </div>
        </div>
    );
}
