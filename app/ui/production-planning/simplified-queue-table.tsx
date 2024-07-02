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
    const [disable, setDisable] = useState<boolean>(false)

    const toast = useRef<Toast>(null);
    const loadOrders = () => {
        setDisable(true)
        fetchOrders().then((data) => {
            setQueuedOrders([]);
            clearSelected();
            setTimeout(function () {
                setQueuedOrders(data.filter(function (el) {
                    return (el.orderStatus.status != "Delivered")
                }));
                setDisable(false)
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

    function clearSelected() {
        setSelectedItems([]);
        handleSelectedItems([])
    }

    const TableHeader = () => {
        return (
            <div className="grid grid-nogutter h-4rem flex align-items-center ">
                <div className="col flex">
                    <div className="flex align-items-center">
                        <Link href="/dashboard/orders" className='p-button text font-medium p-button-text text-s py-2 px-3 rounded-full ' rel="noopener noreferrer"><i className="pi pi-arrow-left"></i>&nbsp;Daftar Pesanan</Link>
                    </div>
                </div>
                <div className="col-3 flex justify-content-end">
                    <Button disabled={disable} className='p-1 flex' onClick={loadOrders} size='large' rounded raised>
                        <i className='pi pi-refresh text-xl m-2' />
                    </Button>
                </div>
            </div>

        )
    }


    return (
        <div>
            <Toast ref={toast} />
            <TableHeader />
            <DataTable
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
            <div className="flex align-items-center justify-content-center mt-3 ml-2 p-0 ">
                <Button className='justify-content-center w-12rem' severity='info' onClick={handleSelected} size='large' rounded raised>Buat Resep&nbsp;<i className='pi pi-file-import'></i></Button>
            </div>
            <div className="flex align-items-center justify-content-center mt-3 ml-2 p-0 ">
                <Button className='justify-content-center w-12rem' severity='danger' onClick={clearSelected} size='large' rounded raised><i className='pi pi-trash'></i>&nbsp;Buang Resep</Button>
            </div>

        </div>
    )
}
