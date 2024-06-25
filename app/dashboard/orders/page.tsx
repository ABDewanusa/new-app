import { Metadata } from "next";
import OrdersTable from "@/app/ui/orders/orders-table";
import Link from 'next/link';

export const metadata: Metadata = {
    title: "Orders",
};

export default async function Page() {

    return (

        <div className="p-2">
            <div className="mx-1 p-2">
                <div className="grid flex grid-nogutter">
                    <div className="col flex align-items-center justify-content-start flex-wrap">
                        <p className="text-2xl font-medium">Daftar Pesanan</p>
                    </div>
                    <div className="col flex justify-content-end align-items-center flex-wrap ">
                        <Link href="/dashboard/production-planning" className='p-button font-medium text-xs py-2 px-3 rounded-full shadow-lg' rel="noopener noreferrer"><i className="pi pi-file-export"></i>&nbsp;Buat Resep</Link>
                    </div>
                </div>
            </div>
            <div className="mx-1 p-2">
                <OrdersTable />
            </div>
        </div>
    );
}