'use server';
import prisma from "@/lib/prisma"
import { Order } from "@/app/lib/definitions"
import { OrderList } from "primereact/orderlist";



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

export async function editOrder(data: Order) {
    const feedback: {
        message: String,
        data: Object,
        severity: "info" | "warn" | "error" | "success"
    } = { message: "", data: {}, severity: "info" }

    const formatted = {
        customer: { connect: { id: data.customer.id } },
        orderlist: {
            createMany: {
                data: data.orderlist.map((o) => ({ quantity: o.quantity, productId: o.product_id }))
            }
        },
        orderedAt: data.orderedAt,
        deliveryAt: data.deliveryAt
    }

    try {

        const updateOrder = await prisma.order.update({

            where: { id: data.id.toString() },
            data: formatted
        })

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

    const formatted = {
        customer: { connect: { id: data.customer.id } },
        orderlist: {
            createMany: {
                data: data.orderlist.map((o) => ({ quantity: o.quantity, productId: o.product_id }))
            }
        },
        orderedAt: data.orderedAt,
        deliveryAt: data.deliveryAt
    }

    try {
        const createOrder = await prisma.order.create({
            include: {
                orderlist: true
            },
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
