function TeacherSubjectsPage() {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">
                    Teacher Subject Assignment
                </h1>

                <button className="bg-blue-600 text-white px-4 py-2 rounded">
                    Assign Teacher
                </button>
            </div>

            <div className="bg-white rounded shadow overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-3">
                                Teacher
                            </th>
                            <th className="text-left p-3">
                                Subject
                            </th>
                            <th className="text-left p-3">
                                Subject Code
                            </th>
                            <th className="text-left p-3">
                                Actions
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr>
                            <td
                                colSpan={4}
                                className="p-4 text-center text-gray-500"
                            >
                                No assignments available.
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default TeacherSubjectsPage;