import { Link } from '@inertiajs/react';
import {
    Sidebar,
    SidebarContent,
    SidebarMenu,
    SidebarMenuItem,
    useSidebar,
} from '@/Components/ui/sidebar';
import { CreditCard, FileText, LayoutDashboard, Settings, Users } from 'lucide-react';

const menuItems = [
    { title: "Dashboard", href: route('dashboard'), icon: LayoutDashboard, name: 'dashboard' },
    { title: "Tenants", href: route('tenants.index'), icon: Users, name: 'tenants.index' },
    { title: "Payments", href: route('payments.index'), icon: CreditCard, name: 'payments.index' },
    { title: "Reports", href: route('reports.index'), icon: FileText, name: 'reports.index' },
    { title: "Settings", href: route('settings.index'), icon: Settings, name: 'settings' },
];

export default function AppSidebar() {
    const { state: sidebarState } = useSidebar();
    const isCollapsed = sidebarState === 'collapsed';

    return (
        <Sidebar className="flex flex-col border-r bg-gray-50">
            <div className={`flex items-center h-16 border-b px-4 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                {!isCollapsed && (
                    <Link href={route('dashboard')}>
                        <h1 className="text-2xl font-bold text-green-600">Kodipap</h1>
                    </Link>
                )}
            </div>
            <SidebarContent className="flex-1">
                <SidebarMenu className="p-2">
                    {menuItems.map((item) => (
                        <SidebarMenuItem key={item.name}>
                            <Link 
                                href={item.href} 
                                className={`flex items-center p-3 rounded-lg text-gray-700 hover:bg-gray-200 transition-colors duration-200 ${route().current(item.name) ? 'bg-green-100 text-green-700 font-semibold' : ''} ${isCollapsed ? 'justify-center' : ''}`}
                            >
                                <item.icon className={`w-5 h-5 flex-shrink-0 ${route().current(item.name) ? 'text-green-600' : 'text-gray-500'}`} />
                                {!isCollapsed && <span className="ml-3">{item.title}</span>}
                            </Link>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarContent>
        </Sidebar>
    );
}