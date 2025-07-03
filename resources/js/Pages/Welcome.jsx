import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome({ auth }) {
    const { app_settings } = usePage().props;
    return (
        <>
            <Head title="Welcome" />
            <div className="bg-gray-50 text-black/50 dark:bg-black dark:text-white/50">
                <div className="relative flex min-h-screen flex-col items-center justify-center selection:bg-[#FF2D20] selection:text-white px-4">
                    <div className="max-w-2xl text-center space-y-6">
                        <h1 className="text-4xl font-bold text-black dark:text-white">{app_settings?.app_name || 'App'}</h1>
                        <p className="text-lg">Smart Property & Rent Management System.</p>

                        <div className="space-x-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="inline-block rounded-md px-5 py-2 bg-green-600 text-white hover:bg-green-700"
                                >
                                    Go to Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="inline-block rounded-md px-5 py-2 bg-green-600 text-white hover:bg-green-700"
                                    >
                                        Log in
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}