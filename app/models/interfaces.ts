import { ColumnDef } from "@tanstack/react-table";

export interface UserInterface {
    id: number,
    name: string,
    contact_no: string,
    cnic: string,
    address: string
}

export interface DataTablePropsInterface<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
}