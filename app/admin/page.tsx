// 'use client'
// import { getUsers } from '@/lib/db';
// import { useState, useEffect } from 'react'
import TopNav from '@/components/admin/top_nav';
import { Button } from '@/components/ui/button';
import { UserInterface } from '../models/interfaces';
import { Search } from '../search';
import { UsersTable } from '../users-table';

export default async function IndexPage({
    searchParams
}: {
    searchParams: { q: string; offset: string };
}) {
    // const search = searchParams.q ?? '';
    // const offset = searchParams.offset ?? 0;
    // const [users, setUsers] = useState<UserInterface[]>([]);
    const users_temp_data: UserInterface[] = [
        { id: 1, name: "akbar", contact_no: "031357575757", cnic: "7172727272727", address: "golodas" },
        { id: 2, name: "akbar1", contact_no: "031457575757", cnic: "7272727272727", address: "sil gol das ghiz kkaakk" },
        { id: 3, name: "akbar2", contact_no: "031557575757", cnic: "7372727272727", address: "golodas dfds" },
        { id: 4, name: "akbar3", contact_no: "031657575757", cnic: "7472727272727", address: "golodas dssds" },
        { id: 5, name: "akbar4", contact_no: "031757575757", cnic: "7572727272727", address: "golodas daaas" }
    ]
    // useEffect(() => {
    //     setUsers(users_temp_data)
    // }, [])
    // const { users, newOffset } = await getUsers(search, Number(offset));
    return (
        <main className="flex flex-1 flex-col ">
            <TopNav />
            <div className="w-full mb-4">
                <Search value={searchParams.q} />
            </div>
            <UsersTable users={users_temp_data} offset={0} />
        </main>
    );
}
