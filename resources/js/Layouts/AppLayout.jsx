import Header from '@/Components/Header';
import AppSidebar from '@/Components/AppSidebar';
import { SidebarProvider } from '@/Components/ui/sidebar';
import { usePage } from '@inertiajs/react';

export default function AppLayout({ children }) {
    const { auth } = usePage().props;
    
    return (
        <SidebarProvider>
            <div className="flex h-screen bg-gray-100">
                <AppSidebar />
                <div className="flex-1 flex flex-col overflow-hidden">
                    <Header user={auth.user} />
                    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
                        {children}
                    </main>
                </div>
            </div>
        </SidebarProvider>
    );
}
