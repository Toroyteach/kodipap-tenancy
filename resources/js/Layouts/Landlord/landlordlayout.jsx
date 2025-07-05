import Header from '@/Components/Header';
import LandlordSidebar from '@/Components/landlordSidebar';
import { SidebarProvider } from '@/Components/ui/sidebar';
import { usePage } from '@inertiajs/react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function LandlordLayout({ children }) {
    const { auth } = usePage().props;

    return (
        <SidebarProvider>
            <div className="flex h-screen bg-gray-100">
                <LandlordSidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header user={auth.user} />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                        {children}
                    </main>
                </div>
                <ToastContainer position="top-right" autoClose={3000} />
            </div>
        </SidebarProvider>
    );
}