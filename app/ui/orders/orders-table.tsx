import React, { useState, useEffect } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Order } from '@/app/lib/definitions';
import { Button } from 'primereact/button';

import 'primeicons/primeicons.css';




export default function OrdersTable({ orders }: { orders: Order[] }) {

    const actionBodyTemplate = () => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" style={{ color: 'orange' }} rounded outlined />
                <Button icon="pi pi-trash" style={{ color: 'red' }} rounded severity='danger' />
            </React.Fragment>
        );
    };

    return (

        <DataTable value={orders} dataKey="id" rows={10} paginator tableStyle={{ minWidth: '50rem' }}>

            <Column field='orderedAt' header='Tanggal Pesan' sortable />
            <Column field='customer_name' header='Pemesan' style={{ minWidth: '10rem' }} />
            <Column field='status' header='Status' />
            <Column field='orderlist' header='Pesanan' style={{ minWidth: '10rem' }} />
            <Column field='deliveryAt' header='Deadline' sortable />
            <Column body={actionBodyTemplate()} style={{ minWidth: '7rem' }}></Column>
        </DataTable>
    )
}