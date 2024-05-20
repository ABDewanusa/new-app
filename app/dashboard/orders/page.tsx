import { Metadata } from "next";
import { Card } from 'primereact/card';
import OrdersTable from "@/app/ui/orders/orders-table";
import {
    fetchOrders,
    fetchProducts,
    fetchCustomers
} from "@/app/lib/data"



export const metadata: Metadata = {
    title: "Orders",
};

export default async function Page() {

    const ordersData = await fetchOrders();

    const productsData = await fetchProducts();
    const customersData = await fetchCustomers();

    return (

        <div className="p-4">
            <Card>
                <OrdersTable initOrders={ordersData} products={productsData} customers={customersData} />
            </Card>
        </div>
    );
}