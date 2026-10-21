import { Outlet, useLocation } from 'react-router-dom';
import { useCallback, useState } from 'react';
import { Menu } from 'lucide-react';

import Sidebar from '../components/Sidebar';
import NotificationCenter from '../components/NotificationCenter';

function DashboardLayout() {
    const location = useLocation();
    const [mobileOpen, setMobileOpen] = useState(false);
    const closeMobile = useCallback(() => setMobileOpen(false), []);
    return (
        <div className="min-h-screen flex bg-gray-100">
            <Sidebar mobileOpen={mobileOpen} onMobileClose={closeMobile} />

            <div className="min-w-0 flex-1 flex flex-col min-h-screen">
                <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 md:justify-end">
                    <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open navigation" aria-expanded={mobileOpen} className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 md:hidden"><Menu size={22} aria-hidden="true" /></button>
                    <NotificationCenter />
                </header>
                <main className="min-w-0 flex-1 p-4 sm:p-6">
                    <Outlet key={location.key} />
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;
