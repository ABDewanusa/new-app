"use client"
import { Menubar } from 'primereact/menubar';
import { Avatar } from 'primereact/avatar';
import Image from 'next/image';
import { logOut } from '@/app/lib/action';
// import { signOut } from '@/auth'

export default function NavBar() {
    const items = [
        {
            label: 'Overview',
            icon: 'pi pi-home',
            url: "/dashboard"
        },
        {
            label: 'Orders',
            icon: 'pi pi-list',
            url: "/dashboard/orders"
        },
        {
            label: 'Production',
            icon: 'pi pi-hammer',
            items: [
                {
                    label: 'Now',
                    icon: 'pi pi-clock',
                    url: "/dashboard/production-now"
                },
                {
                    label: 'Plans',
                    icon: 'pi pi-calendar-clock',
                    url: "/dashboard/production-plans"
                },
                {
                    label: 'Logs',
                    icon: 'pi pi-book',
                    url: "/dashboard/production-logs"
                },
            ]
        },
        {
            label: 'Log Out',
            icon: 'pi pi-sign-out',
            command: () => {
                logOut();
            }

        },
    ];

    const start = (
        <div>
            <Image alt="logo" src="https://primefaces.org/cdn/primereact/images/logo.png" />
        </div>
    );
    const end = (
        <div className="flex align-items-center gap-2">
            < Avatar image="https://primefaces.org/cdn/primereact/images/avatar/amyelsner.png" shape="circle" />
        </div >
    );
    return (
        <Menubar model={items} end={end} />
    )
}