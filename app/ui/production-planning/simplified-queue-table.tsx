'use client'

import { DataTable, DataTableSelectEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Button } from "primereact/button";
import {
    fetchOrders,
} from "@/app/lib/raw_data"

import {
    FormattedOrder,
} from '@/app/lib/definitions';

import {
    formatOrders
} from "@/app/lib/utils";

interface Props {
    handleSelectedOrders: (data: FormattedOrder[]) => void;
}

export default function QueueTable(
    { handleSelectedOrders }: Props
) {


    const [queuedOrders, setQueuedOrders] = useState<FormattedOrder[]>([]);
    const [selectedOrders, setSelectedOrders] = useState<FormattedOrder[]>([]);

    const toast = useRef<Toast>(null);
    const loadOrders = () => {
        fetchOrders().then((data) => formatOrders(data)).then((data) => {
            setQueuedOrders([]);
            setTimeout(function () {
                setQueuedOrders(data.filter(function (el) {
                    return (el.status != "Delivered")
                }));
            }, 50);
        });
    }

    useEffect(() => {
        loadOrders();
    }, []);

    const orderListTemplate = (rowData: FormattedOrder) => {
        return (
            <>
                <p className="font-medium">{rowData.customer.name}</p>
                {rowData.orderlist.map((a) => {
                    return (
                        <p
                            className='flex align-items-center'
                            key={a.productId.toString()}
                        >
                            &#9642; {a.quantity.toString()} x {a.productName}
                        </p>
                    )
                })}
            </>
        )
    }

    const handleSelected = () => {
        handleSelectedOrders(selectedOrders)

    }

    const TableHeader = () => {
        return (
            <div className="flex justify-content-end flex-wrap mr-1 mb-2 ">
                <div className="flex align-items-center justify-content-center m-0 p-0">
                    <Button onClick={loadOrders} size='small' rounded raised icon="pi pi-refresh"></Button>
                </div>
                <div className="flex align-items-center justify-content-center ml-2 p-0">
                    <Button severity='info' onClick={handleSelected} size='small' rounded raised>Buat Resep&nbsp;<i className='pi pi-file-import'></i></Button>
                </div>
            </div>
        )
    }

    return (
        <div>
            <Toast ref={toast} />
            <TableHeader />
            <DataTable
                className='w-20rem'
                size='small'
                scrollable scrollHeight='300px'
                value={queuedOrders} dataKey="id"
                // header={tableHeader}
                selectionMode='multiple' selection={selectedOrders!}
                onSelectionChange={(e) => setSelectedOrders(e.value)}
                sortField='deliveryAt' sortOrder={1}
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                {/* <Column field='deliveryAt' header='Tanggal Kirim' dataType="date" body={orderDateBodyTemplate} style={{ minWidth: '10rem' }} sortable /> */}
                {/* <Column field='customer.name' header='Pemesan' style={{ minWidth: '15rem' }} /> */}
                <Column body={orderListTemplate} header='Pilih pesanan:' style={{ minWidth: '15rem' }} />
                {/* <Column field='status' header='Status' style={{ minWidth: '5rem' }} /> */}
            </DataTable>
        </div>
    )
}
