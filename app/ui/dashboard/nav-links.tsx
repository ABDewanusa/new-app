'use client';

import {
    InboxArrowDownIcon,
    HomeIcon,
    DocumentDuplicateIcon,
    ClockIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

// Map of links to display in the side navigation.
// Depending on the size of the application, this would be stored in a database.
const links = [
    {
        name: 'Home',
        href: '/dashboard',
        icon: HomeIcon
    },
    {
        name: 'Orders',
        href: '/dashboard/orders',
        icon: InboxArrowDownIcon,
    },
    {
        name: 'Production Plans',
        href: '/dashboard/production-logs',
        icon: DocumentDuplicateIcon
    },
    {
        name: 'Production Log',
        href: '/dashboard/production-plans',
        icon: ClockIcon
    },
];

export default function NavLinks() {
    const pathname = usePathname();
    return (
        <>
            {links.map((link) => {
                const LinkIcon = link.icon;
                return (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={clsx(
                            'flex h-[48px] grow items-center justify-center gap-2 rounded-md bg-orange-10 p-3 text-sm font-medium hover:bg-orange-50 hover:text-orange-900 md:flex-none md:justify-start md:p-2 md:px-3',
                            {
                                'bg-orange-50 text-orange-900': pathname === link.href,
                            },
                        )}
                    >
                        <LinkIcon className="w-6" />
                        <p className="hidden md:block">{link.name}</p>
                    </Link>
                );
            })}
        </>
    );
}
