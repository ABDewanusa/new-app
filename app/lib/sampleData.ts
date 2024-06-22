import { FormattedOrder, Order } from '@/app/lib/definitions';
let defaultOrderDate = new Date();
let defaultDeliveryDate = (() => {
    let twoDaysLater = new Date();
    twoDaysLater.setDate(twoDaysLater.getDate() + 2);
    return twoDaysLater
})();

let sampleOrders: FormattedOrder[] = [
    {
        id: "001",
        customer: {
            id: "001",
            name: "sampleCustomer1"
        },
        status: "Queued",
        payment: "",
        orderlist: [
            {
                productId: "001",
                productName: "sampleProduct1",
                quantity: 10
            },
            {
                productId: "002",
                productName: "sampleProduct2",
                quantity: 10
            },
        ],
        orderedAt: defaultOrderDate,
        deliveryAt: defaultDeliveryDate
    },
    {
        id: "002",
        customer: {
            id: "002",
            name: "sampleCustomer2"
        },
        status: "Queued",
        payment: "",
        orderlist: [
            {
                productId: "001",
                productName: "sampleProduct1",
                quantity: 5
            },
        ],
        orderedAt: defaultOrderDate,
        deliveryAt: defaultDeliveryDate
    },

]
