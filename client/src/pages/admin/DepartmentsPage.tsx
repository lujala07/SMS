function DepartmentsPage() {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    Departments
                </h1>

                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                    Add Department
                </button>
            </div>

            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-3">
                                Code
                            </th>

                            <th className="text-left p-3">
                                Department
                            </th>

                            <th className="text-left p-3">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td
                                colSpan={3}
                                className="p-4 text-center text-gray-500"
                            >
                                No departments available.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DepartmentsPage;