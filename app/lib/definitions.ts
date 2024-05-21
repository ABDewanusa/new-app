import { Nullable } from "primereact/ts-helpers"

export type Order = {
    'id': string,
    'customer': {
        'id': string,
        'name': string,
    }
    'status': string,
    'payment': string,
    'orderlist': OrderProduct[],
    'orderedAt': Nullable<Date>,
    'deliveryAt': Nullable<Date>
}

export type OrderProduct = {
    'productId': string,
    'productName': string,
    'quantity': number
}
export type Product = {
    'id': string,
    'productName': string
}

export type Customer = {
    'id': string,
    'name': string
}