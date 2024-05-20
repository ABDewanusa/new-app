'use server'
import prisma from "@/lib/prisma"
import { unstable_noStore as noStore } from 'next/cache';

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
                isPaid: true,
                orderStatus: { select: { status: true } },
                // orderStatus: true,
                customer: { select: { id: true, name: true } },
                orderlist: { select: { quantity: true, product: { select: { id: true, name: true, } } } },

            }
        })

        // console.log(res)
        const formatted = res.map((o) => ({
            id: o.id,
            customer: {
                id: o.customer?.id || "?",
                name: o.customer?.name || "?",
            },
            status: o.orderStatus.status,
            payment: o.isPaid ? "Paid" : "Not Paid",
            orderlist: o.orderlist.map((op) => ({ product_id: op.product?.id || "?", product_name: op.product?.name || "?", quantity: op.quantity || 0, })),
            orderedAt: o.orderedAt || new Date(),
            deliveryAt: o.deliveryAt || new Date()
        }))

        // console.log(formatted)

        console.log('Data fetch completed.');

        return formatted

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch orders data.');
    }
}

export async function fetchProducts() {
    noStore();
    try {
        console.log('Fetching products data...');
        const res = await prisma.product.findMany({
            select: {
                id: true,
                name: true
            }
        })

        const formatted = res.map((p) => ({
            id: p.id,
            product_name: p.name || "?"
        }))

        console.log('Data fetch completed.');
        return formatted

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch products data.');
    }

}

export async function fetchCustomers() {
    noStore();
    try {
        console.log('Fetching customers data...');
        const res = await prisma.customer.findMany({
            select: {
                id: true,
                name: true
            }
        })

        const formatted = res.map((c) => ({
            id: c.id,
            name: c.name || "?"
        }))

        console.log('Data fetch completed.');
        return formatted

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch customers data.');
    }

}