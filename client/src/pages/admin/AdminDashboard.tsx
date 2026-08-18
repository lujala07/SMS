function AdminDashboard() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">
                Admin Dashboard
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded shadow">
                    <p className="text-gray-500">
                        Students
                    </p>

                    <h2 className="text-2xl font-bold mt-2">
                        0
                    </h2>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <p className="text-gray-500">
                        Teachers
                    </p>

                    <h2 className="text-2xl font-bold mt-2">
                        0
                    </h2>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <p className="text-gray-500">
                        Subjects
                    </p>

                    <h2 className="text-2xl font-bold mt-2">
                        0
                    </h2>
                </div>
            </div>

            <div className="bg-white p-4 rounded shadow mt-6">
                <h2 className="text-lg font-semibold mb-3">
                    Recent Notices
                </h2>

                <p className="text-gray-500">
                    No notices available.
                </p>
            </div>
        </div>
    );
}

export default AdminDashboard;