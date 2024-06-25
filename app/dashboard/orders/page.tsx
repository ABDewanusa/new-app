import { Metadata } from "next";
import { Card } from 'primereact/card';
import { Button } from "primereact/button";
import OrdersTable from "@/app/ui/orders/orders-table";


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
                        <Button className='font-medium' size='small' rounded raised icon="pi pi-file-export">&nbsp;Buat Resep</Button>
                    </div>
                </div>
            </div>
            <div className="mx-1 p-2">
                <OrdersTable />
            </div>
        </div>
    );
}