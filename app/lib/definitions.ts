import { Nullable } from "primereact/ts-helpers"

export type Order = {
    'id': String,
    'customer': {
        'id': String,
        'name': String,
    }
    'status': String,
    'payment': String,
    'orderlist': OrderProduct[],
    'orderedAt': Nullable<Date>,
    'deliveryAt': Nullable<Date>
}

export type OrderProduct = {
    'product_id': String,
    'product_name': String,
    'quantity': Number
}
export type Product = {
    'id': String,
    'product_name': String
}

export type Customer = {
    'id': String,
    'name': String
}