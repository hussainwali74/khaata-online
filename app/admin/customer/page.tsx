'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { CustomerInterface } from '../../models/interfaces';

export default function Customer() {
  const [customerData, setCustomerData] = useState<CustomerInterface | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:40/api/customer');
        setCustomerData(response.data);
      } catch (error) {
        console.error('Error fetching customer data', error);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (customerData) {
      setCustomerData({ ...customerData, [name]: value });
    }
  };

  const handleUpdate = async () => {
    try {
      await axios.put('http://localhost:40/api/customer', customerData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating customer data', error);
    }
  };

  if (!customerData) return <div>Loading...</div>;

  return (
    <>
      <div className="px-4 sm:px-0 justify-between flex">
        <div>
          <h3 className="text-base font-semibold leading-7 text-gray-900">Customer Information</h3>
          <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500">Personal details and bill details.</p>
        </div>
        <div className="bg-green-200 text-amber-50 font- p-2 w-1/4 rounded">
          <h3 className="text-base font-semibold leading-7 text-gray-600">Amount Due</h3>
          {isEditing ? (
            <input
              type="text"
              name="amountDue"
              value={customerData.amountDue}
              onChange={handleInputChange}
              className="mt-1 max-w-2xl text-sm font-medium leading-6 text-black"
            />
          ) : (
            <p className="mt-1 max-w-2xl text-sm font-medium leading-6 text-black">{customerData.amountDue}</p>
          )}
        </div>
      </div>
      <div className="mt-6 border-t border-gray-100">
        <dl className="divide-y divide-gray-100">
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Name</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={customerData.name}
                  onChange={handleInputChange}
                  className="w-full"
                />
              ) : (
                customerData.name
              )}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Address</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={customerData.address}
                  onChange={handleInputChange}
                  className="w-full"
                />
              ) : (
                customerData.address
              )}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">CNIC</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {isEditing ? (
                <input
                  type="text"
                  name="cnic"
                  value={customerData.cnic}
                  onChange={handleInputChange}
                  className="w-full"
                />
              ) : (
                customerData.cnic
              )}
            </dd>
          </div>
          <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
            <dt className="text-sm font-medium leading-6 text-gray-900">Phone Number</dt>
            <dd className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0">
              {isEditing ? (
                <input
                  type="text"
                  name="phoneNumber"
                  value={customerData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full"
                />
              ) : (
                customerData.phoneNumber
              )}
            </dd>
          </div>
        </dl>
        <div className="px-4 py-6 sm:px-0">
          {isEditing ? (
            <button
              onClick={handleUpdate}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            >
              Update
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            >
              Edit
            </button>
          )}
        </div>
      </div>
    </>
  );
}
