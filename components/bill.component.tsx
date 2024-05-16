import { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';

export type Item = {
    id: number;
    description: string;
    rate: number;
    quantity: number;
    lineTotal: number;
};

export default function BillInvoiceComponent() {

    const [totalAmount, setTotalAmount] = useState(0);
    const [tax, setTax] = useState(0);
    const [amountDue, setAmountDue] = useState(0);


    const [items, setItems] = useState<Item[]>([
        { id: 1, description: 'Project', rate: 5000, quantity: 1, lineTotal: 5000 },
        { id: 2, description: 'Expenses', rate: 500, quantity: 1, lineTotal: 500 },
    ]);


    useEffect(() => {
        calculateTotalAmount();
    }, [items]);

    const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const newItems = [...items];
        newItems[index] = {
            ...newItems[index],
            [name]: name === 'rate' || name === 'quantity' ? parseFloat(value) : value,
        };
        newItems[index].lineTotal = newItems[index].rate * newItems[index].quantity;
        setItems(newItems);
    };

    const calculateTotalAmount = () => {
        const total = items.reduce((acc, item) => acc + item.lineTotal, 0);
        setTotalAmount(total);
        setAmountDue(total + tax);
    };

    const handleTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const taxValue = parseFloat(e.target.value);
        setTax(taxValue);
    };

    const addItem = () => {
        setItems([...items, { id: items.length + 1, description: '', rate: 0, quantity: 0, lineTotal: 0 }]);
    };
    return (
        <>
            <div className="mt-6">
                <table className="min-w-full divide-y divide-gray-200 mt-4">
                    <thead className="bg-gray-100">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">Description</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">Rate</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">Qty</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-800 uppercase tracking-wider">Line Total</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {items.map((item, index) => (
                            <tr key={item.id} className={'even:bg-muted'}>
                                <td className="px-6 py-1 whitespace-nowrap text-sm font-normal text-gray-700">
                                    {/* <input
                                        type="text"
                                        name="description"
                                        value={item.description}
                                        onChange={(e) => handleInputChange(index, e)}
                                        className="hover:bg-blue-50 p-1  w-full bg-transparent"
                                    /> */} {item.description}
                                </td>
                                <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-500">
                                    {item.rate}
                                    {/* <input
                                        type="number"
                                        name="rate"
                                        value={item.rate}
                                        onChange={(e) => handleInputChange(index, e)}
                                        className="hover:bg-blue-50 p-1  w-full bg-transparent"
                                    /> */}
                                </td>
                                <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-500">
                                    {item.quantity}
                                </td>
                                <td className="px-6 py-1 whitespace-nowrap text-sm text-gray-500">
                                    {item.lineTotal}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="mt-8 border-t border-gray-100 justify-end flex ">
                <dl className="divide-2 divide-y-2 w-1/4 justify-start" >
                    <div className="px-4 py-2 flex justify-between lg:space-x-2 sm:px-0 divide-2 ">
                        <dt className=" font-medium  text-gray-900">Subtotal</dt>
                        <dd className="text-gray-700">
                            {totalAmount}
                        </dd>
                    </div>
                    <div className="px-4 py-2 flex justify-between lg:space-x-2 sm:px-0">
                        <dt className=" font-medium  text-gray-900">Tax</dt>
                        <dd className="text-gray-700">
                            {tax}
                        </dd>
                    </div>
                    <div className="px-4 py-2 flex justify-between lg:space-x-2 sm:px-0">
                        <dt className=" font-medium  text-gray-900">Total Amount</dt>
                        <dd className="text-gray-700">
                            {amountDue}
                        </dd>
                    </div>
                </dl>
            </div>
        </>
    )
} 