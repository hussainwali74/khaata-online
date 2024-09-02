export interface CustomerInterface {
    id?: number;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
    paymentStatus?: string;
    amount?: string;
    name: string;
    address: string;
    contact_number: string;
    cnic?: string;
    photo?: string;

}