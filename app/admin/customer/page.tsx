'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { toast } from "sonner"
import axios from 'axios';
import { useRouter } from 'next/navigation';

import {
    Form, FormItem, FormField, FormLabel,
    FormControl,
    FormDescription,
    FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Toaster } from "@/components/ui/sonner"

const formSchema = z.object({
    name: z.string().min(5).max(50, { message: "name cannot be more than 50 characters.", }),
    address: z.string().min(5).max(50),
    contact_number: z.string().min(11).max(13),
    cnic: z.string().max(14).optional(),
})

export default function Customer() {
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            address: "",
            contact_number: "",
            cnic: "",
        },
    })

    const router = useRouter()
    function onCancel() {
        router.back()
    }

    async function onSubmitHandler(values: z.infer<typeof formSchema>) {
        try {
            console.log(`customerDetails :>>`, values)
            console.log('-----------------------------------------------------')
            const res = await axios.post('http://localhost:8000/api/shop/customers/', values);
            console.log('-----------------------------------------------------')
            console.log(`res :>>`, res)
            console.log('-----------------------------------------------------')
            toast.info("Customer details added", {
                description: "you can now create invoices for the customer",
                action: {
                    label: "x",
                    onClick: () => toast.dismiss(),
                },
            })
        } catch (error) {
            console.error('Error saving bill data', error);
        }
    }


    return (
        <div className="mx-auto max-w-6xl print-margins">
            <div className="px-4 sm:px-0">
                <h3 className="text-base font-semibold leading-7 text-gray-900">Add new Customer </h3>
                <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Customer Personal details.</p>
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="enter customer name here" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Customer full name.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="address"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="enter customer address here" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Customer Address.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="cnic"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>CNIC</FormLabel>
                                    <FormControl>
                                        <Input placeholder="enter customer cnic here" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Customer cnic.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="contact_number"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Contact Number</FormLabel>
                                    <FormControl>
                                        <Input placeholder="enter customer Contact Number here" {...field} />
                                    </FormControl>
                                    <FormDescription>
                                        Customer Contact Number.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="gap-2 flex  w-full">
                            <Button type="submit" className="w-1/2 bg-green-500">Submit</Button>
                            <Button type="button" onClick={() => onCancel()} className="w-1/2 bg-slate-400">Cancel</Button>
                        </div>
                    </form>
                </Form>
            </div>
            <Toaster richColors />
        </div>
    );
};
