'use client'

import { DataTable, DataTableSelectEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Button } from "primereact/button";
import Link from 'next/link';
import {
    fetchOrders,
} from "@/app/lib/raw_data"

import {
    getOrderList
} from "@/app/lib/utils"

import {
    FormattedOrder,
    Order,
    OrderItem
} from '@/app/lib/definitions';

import {
    formatOrders
} from "@/app/lib/utils";
import { format } from 'path';

interface Props {
    handleSelectedItems: (data: OrderItem[]) => void;
}

export default function QueueTable(
    { handleSelectedItems }: Props
) {

    // const [orders, setOrders] = useState<Order[]>([])
    const [queuedOrders, setQueuedOrders] = useState<Order[]>([]);
    const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);

    const toast = useRef<Toast>(null);
    const loadOrders = () => {

        fetchOrders().then((data) => {
            setQueuedOrders([]);
            setTimeout(function () {
                setQueuedOrders(data.filter(function (el) {
                    return (el.orderStatus.status != "Delivered")
                }));
            }, 50);
        });
    }

    useEffect(() => {
        loadOrders();
    }, []);

    const orderListTemplate = (rowData: OrderItem) => {
        return (
            <>
                <p className="font-medium">{rowData.customer_name}</p>


                <p
                    className='flex align-items-center'
                    key={rowData.productId}
                >
                    &#9642; {rowData.quantity} x {rowData.productName}
                </p>


            </>
        )
    }

    const handleSelected = () => {
        handleSelectedItems(selectedItems)

    }

    const TableHeader = () => {
        return (
            <div className="grid grid-nogutter">
                <div className="col">
                    <div className="flex justify-content-start flex-wrap mr-1 mb-2 ">
                        <div className="flex align-items-center flex-wrap ">
                            <Link href="/dashboard/orders" className='p-button text font-medium text-xs py-2 px-3 rounded-full shadow-lg' rel="noopener noreferrer"><i className="pi pi-arrow-left"></i>&nbsp;Daftar Pesanan</Link>
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="flex justify-content-end flex-wrap mr-1 mb-2 ">
                        <div className="flex align-items-center justify-content-center m-0 p-0">
                            <Button onClick={loadOrders} size='small' rounded raised icon="pi pi-refresh"></Button>
                        </div>
                        <div className="flex align-items-center justify-content-center ml-2 p-0">
                            <Button severity='info' onClick={handleSelected} size='small' rounded raised>Buat Resep&nbsp;<i className='pi pi-file-import'></i></Button>
                        </div>
                    </div>
                </div>
            </div>

        )
    }


    return (
        <div>
            <Toast ref={toast} />
            <TableHeader />
            <DataTable
                className='w-23rem'
                size='small'
                scrollable scrollHeight='300px'
                value={getOrderList(queuedOrders)} dataKey="id"
                selectionMode='multiple' selection={selectedItems!}
                onSelectionChange={(e) => setSelectedItems(e.value)}
                sortField='deliveryAt' sortOrder={1}
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                <Column body={orderListTemplate} header='Pilih pesanan:' style={{ minWidth: '15rem' }} />
            </DataTable>

        </div>
    )
}
