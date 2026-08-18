import CreateUserForm from '../../components/admin/CreateUserForm';

function UsersPage() {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-2">
                Users
            </h1>

            <p className="text-gray-500 mb-6">
                Create student, teacher, or admin accounts.
            </p>

            <CreateUserForm />
        </div>
    );
}

export default UsersPage;