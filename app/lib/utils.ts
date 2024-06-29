import {
    Order,
    FormattedOrder,
    OrderItem
} from '@/app/lib/definitions';

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

export function formatOrders(res: Order[]) {
    const formatted = res.map((o) => ({
        id: o.id,
        customer: {
            id: o.customer?.id || "?",
            name: o.customer?.name || "?",
        },
        status: o.orderStatus.status,
        payment: o.isPaid ? "Paid" : "Not Paid",
        orderlist: o.orderlist.map((op) => ({ id: op.id, productId: op.product?.id || "?", productName: op.product?.name || "?", quantity: op.quantity || 0, })),
        orderedAt: o.orderedAt || new Date(),
        deliveryAt: o.deliveryAt || new Date()
    }))

    return formatted
}

export function getOrderList(orders: Order[]): Array<OrderItem> {
    const formatted = orders.flatMap(order =>
        order.orderlist.map(item => ({
            id: item.id,
            productId: item.product.id,
            productName: item.product.name,
            quantity: item.quantity,
            customer_id: order.customer.id,
            customer_name: order.customer.name,
            order_id: order.id
        }))
    );

    return formatted
}