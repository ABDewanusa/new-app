import prisma from "@/lib/prisma"
import { unstable_noStore as noStore } from 'next/cache';
import { formatDateTime } from "@/app/lib/utils"

export async function fetchOrders() {
    noStore();
    try {
        console.log('Fetching orders data...');
        const res = await prisma.order.findMany({
            orderBy: {
                orderedAt: 'desc',
            },
            select: {
                id: true,
                orderedAt: true,
                deliveryAt: true,
                isMade: true,
                isDelivered: true,
                isPaid: true,
                customer: { select: { name: true } },
                orderlist: { select: { quantity: true, product: { select: { name: true, } } } }
            }
        })
        // console.log(res)

        const formatter = new Intl.DateTimeFormat('id-ID', {
            dateStyle: 'medium',
            timeStyle: 'short'
        });

        const simplified = res.map((a) => ({
            id: a.id,
            customer_name: a.customer?.name || "n/a",
            status: a.isPaid ? "Paid" : a.isDelivered ? "Delivered" : a.isMade ? "Made" : "in Production",
            orderlist: a.orderlist.map((p) => (p.quantity + " x " + p.product?.name + "; ")),
            orderedAt: formatDateTime(a.orderedAt),
            deliveryAt: a.deliveryAt ? formatDateTime(a.deliveryAt) : "n/a"
        }))
        // console.log(simplified)

        console.log('Data fetch completed.');

        return simplified

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch orders data.');
    }
}