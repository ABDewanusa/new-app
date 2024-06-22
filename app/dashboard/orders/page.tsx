import { Metadata } from "next";
import { Card } from 'primereact/card';
import OrdersTable from "@/app/ui/orders/orders-table";


export const metadata: Metadata = {
    title: "Orders",
};

export default async function Page() {

    return (

        <div className="p-2">
            <Card>
                {/* <OrdersTable initOrders={ordersData} products={productsData} customers={customersData} /> */}
                <OrdersTable />
            </Card>
        </div>
    );
}