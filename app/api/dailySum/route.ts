// To stream responses you must use Route Handlers in the App Router, even if the rest of your app uses the Pages Router.
import { sendTele } from '@/app/lib/action'
import { fetchOrders } from "@/app/lib/raw_data"
import { formatOrders } from "@/app/lib/utils";

export const dynamic = 'force-dynamic'; // static by default, unless reading the request

export async function GET(request: Request) {

    const orders = await fetchOrders()
        .then((data) => formatOrders(data))

    const filtered = orders.filter(function (el) {
        return (el.status != "Delivered")
    })


    // console.log(orders)
    // console.log(filtered)
    const eBakeryId = "-1002266113223" //eBakery group chat
    var teleMessage = "[Orders Queue]%0A%0A"

    if (filtered.length == 0) {
        teleMessage += "(... there's no new order)"
    } else {
        for (var order of filtered) {
            teleMessage += `<blockquote><b>${order.customer.name}</b> ordered:%0A`
            for (var orderitem of order.orderlist) {
                teleMessage += `@ ${orderitem.quantity} x ${orderitem.productName},%0A`
            }
            teleMessage += `to be delivered at <b>${order.deliveryAt.toDateString()}</b></blockquote>%0A`
        }
    }

    const feedback = await sendTele(teleMessage, eBakeryId)

    return new Response(`${feedback.message}`, {
        status: 200,
    })
}