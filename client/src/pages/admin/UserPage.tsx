import PageHeader from '../../components/PageHeader';
import CreateUserForm from '../../components/admin/CreateUserForm';

function UserPage() {
    return (
        <div>
            <PageHeader title={<>
                    Users
                </>} description={<>
                    Create student, teacher, or admin accounts.
                </>} />

            <CreateUserForm />
        </div>
    );
}

export default UserPage;