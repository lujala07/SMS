function NoticesPage() {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    Notices
                </h1>

                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                    Add Notice
                </button>
            </div>

            <div className="bg-white rounded shadow p-4">
                <p className="text-gray-500">
                    No notices available.
                </p>
            </div>
        </div>
    );
}

export default NoticesPage;