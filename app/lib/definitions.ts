import { Nullable } from "primereact/ts-helpers"

export type Order = {
    id: string,
    orderedAt: Date,
    deliveryAt: Date,
    isPaid: boolean,
    orderStatus: { status: string },
    customer: { id: string, name: string },
    orderlist: OrderProduct[],
}


export type OrderProduct = {
    id: string,
    quantity: number,
    product: { id: string, name: string }
}

export type NewOrder = {
    orderedAt: Date,
    deliveryAt: Date,
    // isPaid: boolean,
    orderStatus: string,
    customer: { id: string, name: string },
    orderlist: FormattedOrderProduct[],
}

export type FormattedOrder = {
    'id': string,
    'customer': {
        'id': string,
        'name': string,
    }
    'status': string,
    'payment': string,
    'orderlist': FormattedOrderProduct[],
    'orderedAt': Date,
    'deliveryAt': Date
}

export type FormattedOrderProduct = {
    'productId': string,
    'productName': string,
    'quantity': number
}
export type Product = {
    'id': string,
    'name': string,
    'gramPerUnit': number,
    'unitPerPack': number
}

export type Customer = {
    'id': string,
    'name': string
}

export type OrderItem = {
    "id": string,
    "productId": string,
    "productName": string,
    "quantity": number,
    "customer_id": string,
    "customer_name": string,
    "order_id": string
}