import { Outlet, useLocation } from 'react-router-dom';

import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import NotificationCenter from '../components/NotificationCenter';

function DashboardLayout() {
    const location = useLocation();
    return (
        <div className="min-h-screen flex bg-gray-100">
            <Sidebar />

            <div className="min-w-0 flex-1 flex flex-col min-h-screen">
                <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-end border-b border-gray-200 bg-white px-4 sm:px-6">
                    <NotificationCenter />
                </header>
                <main className="min-w-0 flex-1 p-4 sm:p-6">
                    <Outlet key={location.key} />
                </main>

                <Footer />
            </div>
        </div>
    );
}

export default DashboardLayout;
