'use client'
import { useState, useRef, useEffect } from 'react';
import { useReactToPrint } from 'react-to-print';
import { useRouter } from 'next/navigation';
import BillInvoiceComponent from '@/components/bill.component';

type UserDetails = {
    name: string;
    address: string;
};

const Bill = () => {
    const [userDetails, setUserDetails] = useState<UserDetails>({
        name: 'Aden Matchett',
        address: '123 Main Street, Townsville, Ontario, M4L2DY',
    });

    const componentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });

    const router = useRouter()
    useEffect(() => {
        // handlePrint()
        // router.push('/admin/bill')
    }, [])

    return (
        <div className="max-w-full pb-12 pt-2 sm:px-2">
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
            <div className=" max-w-full print-margins" ref={componentRef}>
                <div className="text-center">
                    <h1 className="text-2xl font-bold">Company Name</h1>
                    <p>Example invoice</p>
                </div>
                <div className="mt-6 text-right">
                    <p className="text-xl font-bold">Amount Due (CAD): $5,500.00</p>
                </div>
                <div className="mt-6 flex justify-between">
                    <div>
                        <p className="font-bold">Billed To</p>
                        <p>{userDetails.name}</p>
                        <p>{userDetails.address}</p>
                    </div>
                    <div>
                        <p className="font-bold">Date of Issue</p>
                        <p>06/03/2019</p>
                        <p className="font-bold">Due Date</p>
                        <p>07/03/2019</p>
                    </div>
                </div>
                <BillInvoiceComponent />
                <div className="px-4 py-6 sm:px-0">
                    <button
                        onClick={handlePrint}
                        className="mt-4 ml-0 sm:ml-4 bg-blue-500 text-white py-2 px-4 rounded no-print w-full sm:w-auto"
                    >
                        Print Bill
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Bill;
