'use client'

import { DataTable, DataTableSelectEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Button } from "primereact/button";
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';

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
    selectedOrderId: string | undefined;
}

export default function QueueTable(
    { handleSelectedItems, selectedOrderId }: Props

) {

    // const [orders, setOrders] = useState<Order[]>([])
    const [queuedOrders, setQueuedOrders] = useState<Order[]>([]);
    const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
    const [disable, setDisable] = useState<boolean>(false);
    const [splitOrderDialogOpen, setSplitOrderDialogOpen] = useState<boolean>(false);
    const [selectedSplit, setSelectedSplit] = useState<OrderItem | null>()

    const toast = useRef<Toast>(null);
    const loadOrders = () => {
        setDisable(true)
        fetchOrders().then((data) => {
            setQueuedOrders([]);
            setTimeout(function () {
                setQueuedOrders(data.filter(function (el) {
                    return (el.orderStatus.status != "Delivered")
                }));
                setDisable(false)

                if (selectedOrderId) {
                    const selectedOrder = (data.filter(function (el) {
                        return (el.id == selectedOrderId)
                    }))[0]
                    const selected = selectedOrder.orderlist.map((o) => ({
                        id: o.id, productId: o.product.id,
                        productName: o.product.name,
                        quantity: o.quantity,
                        customer_id: selectedOrder.customer.id,
                        customer_name: selectedOrder.customer.name,
                        order_id: selectedOrder.id
                    }));
                    setSelectedItems(selected)

                }

            }, 50);

        });


    }

    useEffect(() => {
        loadOrders();

    }, []);

    const orderListBody = (rowData: OrderItem) => {
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

    const handleSelected = (eventValue: OrderItem[]) => {
        setSelectedItems(eventValue)
        handleSelectedItems(eventValue)
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

    const splitOrderBody = (rowData: OrderItem) => {
        return (
            <Button className='flex h-2rem' onClick={function () {
                setSplitOrderDialogOpen(true);
                setSelectedSplit(rowData)
            }}>
                Bagi
            </Button>
        )
    }

    const toastFeedback = (message: String, severity: "info" | "warn" | "error" | "success") => {
        toast.current?.show({ severity: severity ?? "info", summary: 'Feedback Message:', detail: message, life: 3000 });
    }

    const splitOrderDialogBody = () => {
        return (
            <>
            </>
        )
    }

    return (
        <div>
            <Toast ref={toast} />
            <TableHeader />

            <DataTable
                size='small'
                scrollable
                value={getOrderList(queuedOrders)} dataKey="id"
                selectionMode='multiple' selection={selectedItems!}
                onSelectionChange={(e) => handleSelected(e.value)}
                sortField='deliveryAt' sortOrder={1}
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                <Column body={orderListBody} header='Pilih pesanan:' style={{ minWidth: '15rem' }} />
                <Column body={splitOrderBody} style={{ minWidth: '3rem' }} />

            </DataTable>

            <Dialog modal className="p-fluid" style={{ width: '380px' }}
                visible={splitOrderDialogOpen} header={"Order Details"}
                onHide={function () { setSplitOrderDialogOpen(false) }}>
                {splitOrderDialogBody()}
            </Dialog>
        </div>
    )
}
