import { Link, usePage } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    const { app_settings } = usePage().props;

    return (
        <div className="flex min-h-screen flex-col items-center bg-gray-100 pt-6 sm:justify-center sm:pt-0">
            <div className="text-center">
                <Link href="/">
                    <h1 className="mt-2 text-xl font-bold text-gray-700">{app_settings?.app_name || 'Landlord Management'}</h1>
                </Link>
            </div>

            <div className="mt-6 w-full overflow-hidden bg-white px-6 py-4 shadow-md sm:max-w-md sm:rounded-lg">
                {children}
            </div>
        </div>
    );
}