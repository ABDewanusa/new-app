import { Metadata } from "next";
import { Card } from 'primereact/card';
import OrdersTable from "@/app/ui/orders/orders-table";
import { fetchOrders } from "@/app/lib/data"



export const metadata: Metadata = {
    title: "Orders",
};

export default async function Page() {

    const ordersData = await fetchOrders();

    return (

        <div>
            <Card title="All Orders">
                <OrdersTable orders={ordersData} />
            </Card>
        </div>
    );
}