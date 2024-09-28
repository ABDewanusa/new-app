'use server';
import prisma from "@/lib/prisma"
import {
    FormattedOrderProduct,
    NewOrder
} from '@/app/lib/definitions';

import { signIn } from '@/auth';
import { AuthError } from 'next-auth';
import { signOut } from '@/auth'




const feedback: {
    message: String,
    data: Object,
    severity: "info" | "warn" | "error" | "success"
} = { message: "()", data: {}, severity: "warn" }



export async function deleteOrder(orderId: string) {
    try {
        const deleteOrderProducts = prisma.orderProduct.deleteMany({
            where: {
                orderId: orderId
            }
        })
        const deleteOrder = prisma.order.delete({
            where: {
                id: orderId
            }
        })

        const transaction = await prisma.$transaction([deleteOrderProducts, deleteOrder])

        feedback.message = "Order deleted successfully."
        feedback.severity = "info"
    } catch {
        feedback.message = "Failed to delete order."
        feedback.message += " Changes: " + orderId
        feedback.severity = "error"
    }
    return feedback
}

export async function createOrder(data: NewOrder) {
    try {
        const statId = { 'Queued': 1, 'Partially-Delivered': 2, 'Delivered': 3 }

        const newOrder = await prisma.order.create({
            data: {
                customer: { connect: { id: data.customer.id } },
                orderlist: {
                    createMany: {
                        data: data.orderlist.map((o) => ({ quantity: o.quantity, productId: o.productId }))
                    }
                },
                orderStatus: { connect: { id: statId[data.orderStatus as keyof typeof statId] } },
                orderedAt: data.orderedAt,
                deliveryAt: data.deliveryAt
            }
        })

        feedback.message = "New order created successfully."
        feedback.severity = "success"

        const eBakeryId = "-1002266113223" //eBakery group chat
        const MyId = "7950865751" // myId
        const BobId = "6458283705" // bob
        var teleMessage = "[New Order]%0A%0A"
        teleMessage += `<blockquote><b>${data.customer.name}</b> just ordered:%0A`
        for (var order of data.orderlist) {

            teleMessage += `@ ${order.quantity} x ${order.productName},%0A`
        }
        teleMessage += `to be delivered at <b>${data.deliveryAt.toDateString()}</b></blockquote>`
        // const res = await sendTele(teleMessage, eBakeryId)
        // const res2 = await sendTele(teleMessage, BobId)
        const res3 = await sendTele(teleMessage, MyId)
        // feedback.message += ` ${res.message}`
        // feedback.message += ` ${res2.message}`
        feedback.message += ` ${res3.message}`
    } catch {
        feedback.message = "Failed to create new order."
        feedback.severity = "error"
    }

    return feedback
}

export async function updateOrderList(id: string, newOrderList: FormattedOrderProduct[]) {

    try {
        const formatted = newOrderList.map((o: any) => ({ quantity: o.quantity, productId: o.productId }))

        const deleteOrderProduct = prisma.orderProduct.deleteMany({
            where: { orderId: id }
        })

        const updateOrder = prisma.order.update({
            where: { id: id },
            data: {
                orderlist: {
                    createMany: {
                        data: formatted
                    }
                }
            }
        })

        const transaction = await prisma.$transaction([deleteOrderProduct, updateOrder])
        console.log(transaction)

        feedback.message = "Order's list updated successfully."
        feedback.severity = "success"

    } catch {
        feedback.message = "Failed to update order's list."
        feedback.severity = "error"
    }

    return feedback
}

export async function updateStatus(id: string, status: string) {
    const statId = { 'Queued': 1, 'Partially-Delivered': 2, 'Delivered': 3 }

    try {
        const updateOrder = await prisma.order.update({
            where: { id: id },
            data: {
                orderStatus: { connect: { id: statId[status as keyof typeof statId] } }
            }
        })

        console.log(updateOrder)

        feedback.message = "Order's status updated successfully."
        feedback.message += " Changes: " + status
        feedback.severity = "success"

    } catch {
        feedback.message = "Failed to update order's status."
        feedback.severity = "error"
    }

    return feedback
}

export async function updateDeliveryDate(id: string, newDate: Date) {

    try {
        const updateOrder = await prisma.order.update({
            where: { id: id },
            data: {
                deliveryAt: newDate
            }
        })

        console.log(updateOrder)

        feedback.message = "Order's delivery-date updated successfully."
        feedback.message += " Changes: " + newDate.toDateString()
        feedback.severity = "success"

    } catch {
        feedback.message = "Failed to update order's delivery-date."
        feedback.severity = "error"
    }

    return feedback
}

export async function fetchUser(email: string) {
    try {
        console.log('Fetching user...');
        const user = await prisma.user.findUnique({
            where: {
                email: email
            },
            select: {
                email: true,
                password: true,
                name: true,
                roleId: true
            }
        })
        console.log('Data fetch completed.');
        return user

    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch user.');
    }

}

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export async function logOut() {
    await signOut();
}

export async function http<T>(
    request: RequestInfo
): Promise<T> {
    const response = await fetch(request);
    const body = await response.json();
    return body;
}



export async function sendTele(message: string, chatId: string) {
    interface teleResponse {
        ok: boolean,
        result: {
            chat: {
                type: string
                title: string
                first_name: string
            }
        }
    }
    const token = "7987562686:AAGVOaVQrxT4lSuXe2v9xnbC8FU5cXpSDLo"
    const url = "https://api.telegram.org/bot" + token + "/sendMessage?chat_id=" + chatId + "&text=" + message + "&parse_mode=HTML"

    const fb: {
        message: String,
        data: Object,
        severity: "info" | "warn" | "error" | "success"
    } = { message: "()", data: {}, severity: "warn" }
    console.log(url)

    try {

        const res = await http<teleResponse>(url)
        var name: string = "unknown"
        if (res.result.chat.type == "supergroup") {
            name = res.result.chat.title
        } else if (res.result.chat.type == "private") {
            name = res.result.chat.first_name
        } else {
            name = "unknown"
        }
        fb.message = `Message sent to ${name}`
        fb.severity = "success"


    } catch (error) {
        fb.message = "Something went wrong."
        fb.severity = "error"
    }
    return fb


}