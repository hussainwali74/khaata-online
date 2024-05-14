'use client';

import {
    TableHead,
    TableRow,
    TableHeader,
    TableCell,
    TableBody,
    Table
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
// import { SelectUser } from '@/lib/db';
// import { deleteUser } from './actions';
import { useRouter } from 'next/navigation';
import { UserInterface } from './models/interfaces';

export function UsersTable({
    users,
    offset
}: {
        users: UserInterface[];
        offset: number | null;
}) {
    const router = useRouter();

    function onClick() {
        router.replace(`/?offset=${offset}`);
    }

    return (
        <>
            <form className="border shadow-sm rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="max-w-[150px]">Name</TableHead>
                            <TableHead className="hidden md:table-cell">Address</TableHead>
                            <TableHead className="hidden md:table-cell">CNIC</TableHead>
                            <TableHead className="hidden md:table-cell">Contact Number</TableHead>
                            <TableHead></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <UserRow key={user.id} user={user} />
                        ))}
                    </TableBody>
                </Table>
            </form>
            {offset !== null && (
                <Button
                    className="mt-4 w-40"
                    variant="secondary"
                    onClick={() => onClick()}
                >
                    Next Page
                </Button>
            )}
        </>
    );
}

function UserRow({ user }: { user: UserInterface }) {
    const userId = user.id;
    //   const deleteUserWithId = deleteUser.bind(null, userId);

    return (
        <TableRow>
            <TableCell className="font-medium">{user.name}</TableCell>
            <TableCell className="hidden md:table-cell">{user.address}</TableCell>
            <TableCell className='hidden md:table-cell'>{user.cnic}</TableCell>
            <TableCell className='hidden md:table-cell'>{user.contact_no}</TableCell>
            <TableCell>
                <Button
                    className="w-full"
                    size="sm"
                    variant="outline"
                    //   formAction={deleteUserWithId}
                    disabled
                >
                    Delete
                </Button>
            </TableCell>
        </TableRow>
    );
}
