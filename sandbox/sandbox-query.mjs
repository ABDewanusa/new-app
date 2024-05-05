import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    const res = await prisma.order.findMany({
        orderBy: {
            orderedAt: 'desc',
        },
        select: {
            id: true,
            orderedAt: true,
            deliveryAt: true,
            isMade: true,
            isDelivered: true,
            isPaid: true,
            customer: { select: { name: true } },
            orderlist: { select: { quantity: true, product: { select: { name: true, } } } }
        }
    })
    console.log(res)
    const simplified = res.map((a) => ({
        id: a.id,
        customer_name: a.customer?.name,
        status: a.isPaid ? "Paid" : a.isDelivered ? "Delivered" : a.isMade ? "Made" : "in Production",
        orderlist: a.orderlist.map((p) => ("<p> " + p.quantity + " x " + p.product?.name + "; </p>")),
        orderedAt: a.orderedAt.toLocaleDateString(),
        deliveryAt: a.deliveryAt?.toLocaleDateString()
    }))
    console.log(simplified)
}


main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })



// import React, { useState, useEffect } from 'react';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { ProductService } from './service/ProductService';

// export default function BasicDemo() {
//     const [products, setProducts] = useState([]);

//     useEffect(() => {
//         ProductService.getProductsMini().then(data => setProducts(data));
//     }, []);

//     return (
//         <div className="card">
//             <DataTable value={products} tableStyle={{ minWidth: '50rem' }}>
//                 <Column field="code" header="Code"></Column>
//                 <Column field="name" header="Name"></Column>
//                 <Column field="category" header="Category"></Column>
//                 <Column field="quantity" header="Quantity"></Column>
//             </DataTable>
//         </div>
//     );
// }
