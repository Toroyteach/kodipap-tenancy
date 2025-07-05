import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import {
    Users,
    UserPlus,
    Settings,
    LogOut,
} from 'lucide-react';

const links = [
    {
        name: 'All Tenants',
        href: '/system-landlord/clients',
        icon: Users,
        current: window.location.pathname === '/system-landlord/clients',
    },
];

export default function LandlordSidebar() {
    return (
        <aside className="w-64 bg-white border-r shadow-sm">
            <div className="p-4 text-xl font-bold border-b text-gray-800">
                Landlord
            </div>
            <nav className="p-3 flex flex-col gap-1">
                {links.map(({ name, href, icon: Icon, current }) => (
                    <Link
                        key={name}
                        href={href}
                        className={cn(
                            'flex items-center gap-2 px-4 py-2 rounded-md text-sm transition hover:bg-gray-100',
                            current ? 'bg-gray-200 font-semibold' : 'text-gray-700'
                        )}
                    >
                        <Icon className="w-4 h-4" />
                        {name}
                    </Link>
                ))}
            </nav>
        </aside>
    );
}