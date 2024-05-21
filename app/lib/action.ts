'use server';
import prisma from "@/lib/prisma"
import { Order } from "@/app/lib/definitions"



export async function deleteOrder(id: String) {
    const feedback: {
        message: String,
        data: Object,
        severity: "info" | "warn" | "error" | "success"
    } = { message: "", data: {}, severity: "info" }

    try {
        const deleteOrderProduct = prisma.orderProduct.deleteMany({
            where: { orderId: id.toString() }
        })
        const deleteOrder = prisma.order.delete({
            where: { id: id.toString() }
        })

        const deepDeleteOrder = await prisma.$transaction([deleteOrderProduct, deleteOrder])
        console.log(deepDeleteOrder)

        feedback.message = "Order deleted successfully."
        feedback.severity = "info"
    } catch {
        feedback.message = "Failed to delete order."
        feedback.severity = "error"
    }

    return feedback


}

export async function updateOrder(data: Order, prevData: Order) {
    const feedback: {
        message: String,
        data: Object,
        severity: "info" | "warn" | "error" | "success"
    } = { message: "", data: {}, severity: "info" }

    const compare = (acc: any, key: keyof Order) => {
        if (JSON.stringify(data[key]) === JSON.stringify(prevData[key])) return acc
        else return { ...acc, [key]: data[key] }
    }

    const format = (acc: any, key: keyof Order) => {
        if (key === "status") {
            const statId = { 'Queued': 1, 'Partially-Delivered': 2, 'Delivered': 3 }
            return { ...acc, orderStatus: { connect: { id: statId[changes.status as keyof typeof statId] } } }
        } else if (key === "customer") {
            return { ...acc, customer: { connect: { id: changes.customer.id } } }
        } else if (key === "orderlist") {
            return { ...acc, orderlist: { createMany: { data: changes.orderlist.map((o: any) => ({ quantity: o.quantity, productId: o.productId })) } } }
        } else {
            return { ...acc, [key]: changes[key] }
        }
    }

    const changes = Object.keys(data).reduce((acc: any, key: any) => compare(acc, key), {})
    const formatted = Object.keys(changes).reduce((acc: any, key: any) => format(acc, key), {})

    const deleteOrderProduct = prisma.orderProduct.deleteMany({
        where: { orderId: data.id }
    })

    const updateOrder = prisma.order.update({
        where: { id: data.id },
        data: formatted
    })


    try {

        if (JSON.stringify(changes) == "{}") {
            console.log("Nothing changes.")
            console.log(changes)
        }
        else if (Object.keys(changes).includes('orderlist')) {
            console.log(changes)
            const transaction = await prisma.$transaction([deleteOrderProduct, updateOrder])
            console.log(transaction)
        } else {
            console.log(changes)
            const transaction = await prisma.$transaction([updateOrder])
            console.log(transaction)
        }

        feedback.message = "Order updated successfully."
        feedback.severity = "info"
    } catch {
        feedback.message = "Failed to update order."
        feedback.severity = "error"
    }
    return feedback

}

export async function createOrder(data: Order) {
    const feedback: {
        message: String,
        data: Object,
        severity: "info" | "warn" | "error" | "success"
    } = { message: "", data: {}, severity: "info" }

    const statusId = () => {
        if (data.status === "Delivered") {
            return 3
        } else if (data.status === "Partially-Delivered") {
            return 2
        } else {
            return 1
        }
    }
    const formatted = {
        customer: { connect: { id: data.customer.id } },
        orderlist: {
            createMany: {
                data: data.orderlist.map((o) => ({ quantity: o.quantity, productId: o.productId }))
            }
        },
        orderStatus: { connect: { id: statusId() } },
        orderedAt: data.orderedAt ?? undefined,
        deliveryAt: data.deliveryAt ?? undefined
    }

    try {
        const createOrder = await prisma.order.create({
            data: formatted
        })

        feedback.message = "Order added successfully."
        feedback.severity = "info"

    } catch {
        feedback.message = "Failed to add order."
        feedback.severity = "error"
    }

    return feedback

}
