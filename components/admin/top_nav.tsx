'use client'
import { Button } from "@/components/ui/button";

export default function TopNav() {
    const addCustomer = () => {
        console.log('add customer')
    }
    return (
        <>
            <div className="flex items-center mb-4  justify-between ">
                <h1 className="font-semibold text-lg md:text-2xl">Users</h1>
                <Button
                    className="mt-4 w-40"
                    variant="secondary"
                    onClick={() => addCustomer()}
                >
                    Add Customer
                </Button>

            </div>
        </>
    )
}