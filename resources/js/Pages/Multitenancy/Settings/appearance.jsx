import { Head } from '@inertiajs/react';


import LandlordAppLayout from '@/Layouts/Landlord/landlordlayout';


const breadcrumbs = [
    {
        title: 'Appearance settings',
        href: '/settings/appearance',
    },
];

export default function Appearance() {
    return (
        <LandlordAppLayout breadcrumbs={breadcrumbs}>
            <Head title="Appearance settings" />


        </LandlordAppLayout>
    );
}