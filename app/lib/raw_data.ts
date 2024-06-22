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
                customer: { select: { id: true, name: true } },
                orderlist: { select: { quantity: true, product: { select: { id: true, name: true, } } } },

            }
        })

        // console.log(res)
        console.log('Data fetch completed.');

        return res

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



        console.log('Data fetch completed.');
        return res

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
        console.log('Data fetch completed.');
        return res

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch customers data.');
    }

}