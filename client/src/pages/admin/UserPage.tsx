import CreateUserForm from '../../components/admin/CreateUserForm';

function UserPage() {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">
                    Users
                </h1>

                <p className="text-gray-500 mt-1">
                    Create student, teacher, or admin accounts.
                </p>
            </div>

            <CreateUserForm />
        </div>
    );
}

export default UserPage;