import { Order } from '@/app/lib/definitions';

export const formatDateTime = (
    date: Date
) => {
    const formatter = new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
    return formatter.format(date);

}
export const formatDate = (
    date: Date
) => {
    const formatter = new Intl.DateTimeFormat('id-ID', {
        dateStyle: 'medium',
        // timeStyle: 'short'
    });
    return formatter.format(date);

}

export async function formatOrders(res: Order[]) {
    'use client'
    const formatted = res.map((o) => ({
        id: o.id,
        customer: {
            id: o.customer?.id || "?",
            name: o.customer?.name || "?",
        },
        status: o.orderStatus.status,
        payment: o.isPaid ? "Paid" : "Not Paid",
        orderlist: o.orderlist.map((op) => ({ productId: op.product?.id || "?", productName: op.product?.name || "?", quantity: op.quantity || 0, })),
        orderedAt: o.orderedAt || new Date(),
        deliveryAt: o.deliveryAt || new Date()
    }))

    return formatted
}