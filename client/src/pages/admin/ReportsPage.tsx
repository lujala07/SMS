function ReportsPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">
                Reports
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded shadow">
                    <h2 className="font-semibold mb-2">
                        Attendance Report
                    </h2>

                    <p className="text-gray-500">
                        View attendance summary.
                    </p>
                </div>

                <div className="bg-white p-4 rounded shadow">
                    <h2 className="font-semibold mb-2">
                        Assignment Report
                    </h2>

                    <p className="text-gray-500">
                        View assignment and submission summary.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ReportsPage;