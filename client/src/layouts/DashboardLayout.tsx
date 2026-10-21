import { Outlet } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

function DashboardLayout() {
    return (
        <div className="min-h-screen flex bg-gray-100">
            <Sidebar />

            <div className="min-w-0 flex-1 flex flex-col min-h-screen">
                <main className="min-w-0 flex-1 p-4 sm:p-6">
                    <Outlet />
                </main>

                <Footer />
            </div>
        </div>
    );
}

export default DashboardLayout;
