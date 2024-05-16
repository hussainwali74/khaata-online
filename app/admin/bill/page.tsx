'use client'
import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import { useRouter } from 'next/navigation';
import { Input } from "@/components/ui/input"
import { Plus } from 'lucide-react';


type UserDetails = {
    fullName: string;
    applicationFor: string;
    emailAddress: string;
    salaryExpectation: string;
};

type Item = {
    id: number;
    detail: string;
    rate: number;
    quantity: number;
    price: number;
};

export default function Bill() {
    const [userDetails, setUserDetails] = useState<UserDetails>({
        fullName: 'Margot Foster',
        applicationFor: 'Backend Developer',
        emailAddress: 'margotfoster@example.com',
        salaryExpectation: '$120,000',
    });

    const [items, setItems] = useState<Item[]>([
        { id: 1, detail: '', rate: 0, quantity: 0, price: 0 },
    ]);

    const [totalAmount, setTotalAmount] = useState(0);
    const [discount, setDiscount] = useState(0);
    const [receivedAmount, setReceivedAmount] = useState(0);
    const [remainingAmount, setRemainingAmount] = useState(0);

    const componentRef = useRef<HTMLDivElement>(null);

    const router = useRouter()
    const handlePrint = () => {
        // content: () => componentRef.current,/
        router.push('bill/bill2')

    };

    useEffect(() => {
        calculateTotalAmount();
    }, [items, discount, receivedAmount]);

    const handleInputChange = (index: number, e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const newItems = [...items];
        newItems[index] = {
            ...newItems[index],
            [name]: name === 'rate' || name === 'quantity' ? parseFloat(value) : value,
        };
        newItems[index].price = newItems[index].rate * newItems[index].quantity;
        setItems(newItems);
    };

    const calculateTotalAmount = () => {
        const total = items.reduce((acc, item) => acc + item.price, 0);
        setTotalAmount(total);
        setRemainingAmount(total - discount - receivedAmount);
    };

    const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const discountValue = parseFloat(e.target.value);
        setDiscount(discountValue);
    };

    const handleReceivedAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const receivedValue = parseFloat(e.target.value);
        setReceivedAmount(receivedValue);
    };

    const addItem = () => {
        setItems([...items, { id: items.length + 1, detail: '', rate: 0, quantity: 0, price: 0 }]);
    };

    const handleSave = async () => {
        try {
            const billData = {
                userDetails,
                items,
                totalAmount,
                discount,
                receivedAmount,
                remainingAmount,
            };
            await axios.post('http://localhost:40/api/bill', billData);
            // Handle success (e.g., show a success message)
        } catch (error) {
            console.error('Error saving bill data', error);
        }
    };

    return (
        <div className="mx-auto max-w-7xl pb-12 pt-2 sm:px-2 lg:px-2">
            <style>
                {`
          @media print {
            body {
              -webkit-print-color-adjust: exact;
            }
            .print-margins {
              margin: 20px;
            }
            .no-print {
              display: none;
            }
            .shopkeeper-info {
              text-align: center;
              display: block;
            }
            @page {
              margin-top:10mm;
            }
          }
          .shopkeeper-info {
            display: none;
          }
        `}
            </style>
            <div className="mx-auto max-w-4xl print-margins" ref={componentRef}>
                <div className="hidden print:block text-center ">
                    <h3 className="text-base font-semibold leading-7 text-gray-900">Three Star Sanitory Store</h3>
                    <p className="mt-1 text-sm leading-6 text-gray-500">Main Bazar Ghotki</p>
                    <p className="text-sm leading-6 text-gray-500">Contact: 0313221212</p>
                </div>
                <div className="px-4 sm:px-0">
                    <h3 className="text-base font-semibold leading-7 text-gray-900">Customer Information</h3>
                    {/*<p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Personal details and application.</p>*/}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 pt-6">
                    <div>
                        <dt className="text-sm font-medium leading-6 text-gray-900">Name</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700">{userDetails.fullName}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium leading-6 text-gray-900">Address</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700">{userDetails.applicationFor}</dd>
                    </div>
                    <div>
                        <dt className="text-sm font-medium leading-6 text-gray-900">Contact Number</dt>
                        <dd className="mt-1 text-sm leading-6 text-gray-700">{userDetails.emailAddress}</dd>
                    </div>
                </div>

                <div className="mt-6 pt-5 border-t border-gray-100">
                    <h3 className="text-base font-semibold leading-7 text-gray-900">Bill Details</h3>
                    <table className="min-w-full divide-y divide-gray-200 mt-4">
                        <thead className="bg-gray-50 hidden sm:table-header-group">
                            <tr>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">S#
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item Detail
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rate
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity
                                </th>
                                <th scope="col"
                                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {items.map((item, index) => (
                                <tr key={item.id} className="flex flex-col sm:table-row">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{index + 1}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <Input
                                            type="text"
                                            name="detail"
                                            value={item.detail}
                                            onChange={(e) => handleInputChange(index, e)}
                                            className="w-full border-gray-300 rounded-md shadow-sm"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <Input
                                            type="number"
                                            name="rate"
                                            value={item.rate}
                                            onChange={(e) => handleInputChange(index, e)}
                                            className="w-full border-gray-300 rounded-md shadow-sm"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <Input
                                            type="number"
                                            name="quantity"
                                            value={item.quantity}
                                            onChange={(e) => handleInputChange(index, e)}
                                            className="w-full border-gray-300 rounded-md shadow-sm"
                                        />
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <Input
                                            type="number"
                                            name="price"
                                            value={item.price}
                                            readOnly
                                            className="w-full border-gray-300 rounded-md shadow-sm bg-gray-100"
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button
                        onClick={addItem}
                        className={` bg-gray-50 opacity-75 justify-center flex    
                        hover:opacity-100 hover:text-gray-500 hover:bg-slate-100 hover:shadow-md hover:transition-opacity
                         border-gray-400 border-[2px] border-dashed border-opacity-75  rounded 
                         text-gray-400  font-semibold text-[12px]  no-print 
                         py-2 mt-4 w-full lg:w-full sm:w-auto`}
                    >
                        <Plus size={14} strokeWidth={2.15} className='mr-1 mt-[3px]' />
                        Add Item
                    </button>
                </div>

                <div className="mt-8 border-t border-gray-100">
                    <dl className="">
                        <div className="px-4 py-2 space-x-2 flex flex-col sm:flex-row justify-between sm:px-0">
                            <dt className="text-sm font-medium leading-10 text-gray-900 w-full sm:w-1/2 sm:text-right">Total Amount
                                Due
                            </dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 w-full sm:w-1/2 sm:text-right">
                                <Input
                                    type="number"
                                    value={totalAmount}
                                    readOnly
                                    className="w-full border-gray-300 rounded-md shadow-sm bg-gray-100"
                                />
                            </dd>
                        </div>
                        <div className="px-4 py-2 space-x-2 flex flex-col sm:flex-row justify-between sm:px-0">
                            <dt className="text-sm font-medium leading-10 text-gray-900 w-full sm:w-1/2 sm:text-right">Discount</dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 w-full sm:w-1/2 sm:text-right">
                                <Input
                                    type="number"
                                    value={discount}
                                    onChange={handleDiscountChange}
                                    className="w-full border-gray-300 rounded-md shadow-sm"
                                />
                            </dd>
                        </div>
                        <div className="px-4 py-2 space-x-2 flex flex-col sm:flex-row justify-between sm:px-0">
                            <dt className="text-sm font-medium leading-10 text-gray-900 w-full sm:w-1/2 sm:text-right">Received
                                Amount
                            </dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 w-full sm:w-1/2 sm:text-right">
                                <Input
                                    type="number"
                                    value={receivedAmount}
                                    onChange={handleReceivedAmountChange}
                                    className="w-full border-gray-300 rounded-md shadow-sm"
                                />
                            </dd>
                        </div>
                        <div className="px-4 py-2 space-x-2 flex flex-col sm:flex-row justify-between sm:px-0">
                            <dt className="text-sm font-medium leading-10 text-gray-900 w-full sm:w-1/2 sm:text-right">Remaining
                                Amount
                            </dt>
                            <dd className="mt-1 text-sm leading-6 text-gray-700 w-full sm:w-1/2 sm:text-right">
                                <Input
                                    type="number"
                                    value={remainingAmount}
                                    readOnly
                                    className="w-full border-gray-300 rounded-md shadow-sm bg-gray-100"
                                />
                            </dd>
                        </div>
                    </dl>
                    <div className="px-4 py-6 sm:px-0">
                        <button
                            onClick={handleSave}
                            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded no-print w-full sm:w-auto"
                        >
                            Save Bill
                        </button>
                        <button
                            onClick={handlePrint}
                            className="mt-4 ml-0 sm:ml-4 bg-blue-500 text-white py-2 px-4 rounded no-print w-full sm:w-auto"
                        >
                            Print Bill
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
