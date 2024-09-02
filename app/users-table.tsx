import { useState, useEffect, useCallback, useRef } from 'react';
import { CustomerInterface } from './models/customer.models';
import CustomerDeleteConfirmationModal from '@/components/user_table.modal';

interface SortConfig {
    key: keyof CustomerInterface;
    direction: 'ascending' | 'descending';
}

const UsersTable = () => {
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
    const [customers, setCustomers] = useState<CustomerInterface[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<CustomerInterface | null>(null);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [openDropdown, setOpenDropdown] = useState<number | null>(null); // Track which dropdown is open
    const itemsPerPage = 10;

    useEffect(() => {
        fetchCustomers();
    }, []);

    const toggleDropdown = (index: number) => {
        setOpenDropdown(openDropdown === index ? null : index);
    };

    const fetchCustomers = useCallback(async () => {
        const response = await fetch('/api/customers');
        const resp_body = await response.json();
        if (resp_body.data) {
            setCustomers(resp_body.data);
        }
    }, []);

    const removeCustomer = useCallback(async (id: number | undefined) => {
        try {
            if (id) {
                const resp = await fetch('/api/customers?id=' + id, { method: 'delete' });
                const resp_data = await resp.json();
                await fetchCustomers();
            }
        } catch (error) {
            console.error('Error removing customer:', error);
        }
    }, [fetchCustomers]);

    const handleSort = useCallback((key: keyof CustomerInterface) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    }, [sortConfig]);

    const handleEdit = useCallback(async (updatedCustomer: CustomerInterface) => {
        const response = await fetch(`/api/customers/${updatedCustomer.id}/`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedCustomer),
        });

        if (response.ok) {
            setCustomers((prev) =>
                prev.map((customer) =>
                    customer.id === updatedCustomer.id ? updatedCustomer : customer
                )
            );
            setSelectedCustomer(null);
        }
    }, []);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handleDeleteClick = useCallback((customer: CustomerInterface) => {
        setSelectedCustomer(customer);
        setShowModal(true);
        setIsEditMode(false);
    }, []);

    const handleEditClick = useCallback((customer: CustomerInterface) => {
        setSelectedCustomer(customer);
        setShowModal(true);
        setIsEditMode(true);
    }, []);

    const handleConfirmDelete = useCallback(async () => {
        if (selectedCustomer) {
            await removeCustomer(selectedCustomer.id);
        }
        setShowModal(false);
    }, [removeCustomer, selectedCustomer]);

    const handleCloseModal = useCallback(() => {
        setShowModal(false);
        setSelectedCustomer(null);
    }, []);

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const paginatedCustomers = customers.slice(startIndex, endIndex);
    const tableRef = useRef<HTMLDivElement>(null);
    const getDropdownPosition = (index: number) => {
        if (!tableRef.current) return {};

        const tableRect = tableRef.current.getBoundingClientRect();
        const rowCount = paginatedCustomers.length;
        const isLastThreeRows = index >= rowCount - 3;

        if (isLastThreeRows) {
            return { bottom: '100%', top: 'auto' };
        } else {
            return { top: '100%', bottom: 'auto' };
        }
    };
    return (
        <div>
            <div className="shadow-lg rounded-lg overflow-hidden border border-gray-200">
                <div className="p-4">
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <CustomerDeleteConfirmationModal
                    show={showModal}
                    onClose={handleCloseModal}
                    onConfirm={handleConfirmDelete}
                    customer={isEditMode ? selectedCustomer : null}
                    onSave={isEditMode ? handleEdit : undefined}
                />

                <div className="relative overflow-x-auto shadow-md">
                    <table className="w-full text-sm text-left rtl:text-right border text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3" onClick={() => handleSort('name')}>Name</th>
                                <th scope="col" className="px-6 py-3" onClick={() => handleSort('address')}>Address</th>
                                <th scope="col" className="px-6 py-3" onClick={() => handleSort('amount')}>Amount</th>
                                <th scope="col" className="px-6 py-3" onClick={() => handleSort('paymentStatus')}>Payment Status</th>
                                <th scope="col" className="px-6 py-3">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedCustomers.map((customer, index) => (
                                <tr key={customer.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                                    <th scope="row" className="flex items-center px-6 py-4 text-gray-900 whitespace-nowrap dark:text-white">
                                        <div className="ps-3">
                                            <div className="text-base font-semibold">{customer.name}</div>
                                        </div>
                                    </th>
                                    <td className="px-6 py-4">{customer.address}</td>
                                    <td className="px-6 py-4">{customer.amount}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            <span className="bg-lime-200 text-green-600 text-xs font-medium me-2 px-3.5 py-1 rounded-full dark:bg-green-700 dark:text-lime-300">{customer.paymentStatus}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="relative">
                                            <button
                                                type="button"
                                                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                                                onClick={() => toggleDropdown(index)}
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                </svg>
                                            </button>
                                            {openDropdown === index && (
                                                <div
                                                    className="absolute right-0 w-48 bg-white rounded-md shadow-lg z-10"
                                                    style={getDropdownPosition(index)}
                                                >
                                                    <div className="py-1" role="menu" aria-orientation="vertical">
                                                        <button
                                                            onClick={() => handleEditClick(customer)}
                                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            role="menuitem"
                                                        >
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteClick(customer)}
                                                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                                            role="menuitem"
                                                        >
                                                            Remove
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <nav className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-3 md:space-y-0 p-4" aria-label="Table navigation">
                    <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
                        Showing
                        <span className="font-semibold text-gray-900 dark:text-white"> {startIndex + 1} - {Math.min(endIndex, customers.length)} </span>
                        of
                        <span className="font-semibold text-gray-900 dark:text-white"> {customers.length} </span>
                    </span>
                    <ul className="inline-flex items-stretch -space-x-px">
                        {Array.from({ length: Math.ceil(customers.length / itemsPerPage) }, (_, index) => (
                            <li key={index}>
                                <button onClick={() => handlePageChange(index + 1)} className={`flex items-center justify-center text-sm py-2 px-3 leading-tight ${currentPage === index + 1 ? 'text-primary-600 bg-primary-50 border-primary-300' : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-100 hover:text-gray-700'} dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`}>
                                    {index + 1}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </div>
    );
};

export default UsersTable;
