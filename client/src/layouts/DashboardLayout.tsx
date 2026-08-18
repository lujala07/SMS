import { Outlet } from 'react-router-dom';

import Sidebar from '../components/SideBar';
import Footer from '../components/Footer';

function DashboardLayout() {
    return (
        <div className="min-h-screen flex bg-gray-100">
            <Sidebar />

            <div className="flex-1 flex flex-col min-h-screen">
                <main className="flex-1 p-6">
                    <Outlet />
                </main>

                <Footer />
            </div>
        </div>
    );
}

export default DashboardLayout;