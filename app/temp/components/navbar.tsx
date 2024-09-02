'use client'

import Link from 'next/link';

const NavBar = () => {
    const links = [
        { href: '/examples/mail', label: 'Mail' },
        { href: '/examples/dashboard', label: 'Dashboard' },
        { href: '/examples/cards', label: 'Cards' },
        { href: '/examples/tasks', label: 'Tasks' },
        { href: '/examples/playground', label: 'Playground' },
        { href: '/examples/forms', label: 'Forms', active: true },
        { href: '/examples/music', label: 'Music' },
        { href: '/examples/authentication', label: 'Authentication' },
    ];

    return (
        <div className="mb-4 flex items-center overflow-x-auto">
            {links.map((link) => (
                <Link key={link.href} href={link.href}
                    className={`flex h-7 items-center justify-center rounded-full px-4 text-center text-sm transition-colors hover:text-primary text-muted-foreground ${link.active ? 'bg-muted font-medium text-primary' : ''}`
                    }
                >
                    Aoa Sir, Thank you for contacting me I am interested in the opportunity. I am sharing my resume here. can you please tell me if this is a remote role

                    {link.label}

                </Link>
            ))}
        </div>
    );
};

export default NavBar;
