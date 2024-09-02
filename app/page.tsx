'use client'
// import { getUsers } from '@/lib/db';
import { Search } from './search';
// import { useState, useEffect } from 'react'
import { UserInterface } from './models/interfaces';
import { useRouter } from 'next/navigation';
import TopNav from 'my_components/admin/top_nav';
import UsersTable from './users-table';
import { CustomerInterface } from './models/customer.models';

export default function IndexPage({
    searchParams
}: {
    searchParams: { q: string; offset: string };
}) {
    // const search = searchParams.q ?? '';
    // const offset = searchParams.offset ?? 0;
    // const [users, setUsers] = useState<UserInterface[]>([]);
    const router = useRouter()

    return (
        <main className="flex flex-1 flex-col p-4 md:p-6 ">
            <TopNav />

            <UsersTable />
        </main>
    );
}
