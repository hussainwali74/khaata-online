import { CustomerInterface } from 'app/models/customer.models';
import React, { useState, useEffect } from 'react';

interface CustomerDeleteConfirmationModalProps {
    show: boolean;
    onClose: () => void;
    onConfirm: () => void;
    customer?: CustomerInterface | null;
    onSave?: (customer: CustomerInterface) => void;
}

const CustomerDeleteConfirmationModal: React.FC<CustomerDeleteConfirmationModalProps> = ({ show, onClose, onConfirm, customer, onSave }) => {
    const [formData, setFormData] = useState<CustomerInterface | null>(null);

    useEffect(() => {
        setFormData(customer || null);
    }, [customer]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (formData) {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSave = () => {
        if (formData && onSave) {
            onSave(formData);
        }
    };

    if (!show) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-black opacity-50 fixed inset-0"></div>
            <div className="bg-white p-6 rounded-lg shadow-lg z-10">
                <h2 className="text-lg font-semibold">{customer ? 'Edit Customer' : 'Confirm Deletion'}</h2>
                {customer ? (
                    <div className="mt-4">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData?.name || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                        <label className="block mt-4 mb-2 text-sm font-medium text-gray-900">Address</label>
                        <input
                            type="text"
                            name="address"
                            value={formData?.address || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                        <label className="block mt-4 mb-2 text-sm font-medium text-gray-900">CNIC</label>
                        <input
                            type="text"
                            name="cnic"
                            value={formData?.cnic || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                        <label className="block mt-4 mb-2 text-sm font-medium text-gray-900">Contact Number</label>
                        <input
                            type="text"
                            name="contact_number"
                            value={formData?.contact_number || ''}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        />
                        {/* Add other fields as necessary */}
                        <div className="mt-6 flex justify-end">
                            <button className="px-4 py-2 bg-gray-200 rounded-md" onClick={onClose}>Cancel</button>
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-md ml-2" onClick={handleSave}>Save</button>
                        </div>
                    </div>
                ) : (
                    <div className="mt-4">
                        <p>Are you sure you want to delete this customer?</p>
                        <div className="mt-6 flex justify-end">
                            <button className="px-4 py-2 bg-gray-200 rounded-md" onClick={onClose}>Cancel</button>
                            <button className="px-4 py-2 bg-red-600 text-white rounded-md ml-2" onClick={onConfirm}>Delete</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CustomerDeleteConfirmationModal;
