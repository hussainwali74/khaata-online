'use client'
import { Button } from "my_components/ui/button";
import { useRouter } from "next/navigation";

export default function TopNav() {
    const router = useRouter()
    const addCustomer = () => {
        console.log('add customer')
        router.push('/admin/customer')
    }
    return (
        <>
            <div className="flex items-center mb-4 justify-between ">
                <h1 className="font-semibold text-lg md:text-2xl">Users</h1>
                <Button
                    className="mt-4 w-40 shadow hover:shadow-md b"
                    variant="secondary"
                    onClick={() => addCustomer()}
                >
                    Add Customer
                </Button>

            </div>
        </>
    )
}