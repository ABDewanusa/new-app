'use client'

import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Order, Product, OrderProduct, Customer } from '@/app/lib/definitions';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Toolbar } from 'primereact/toolbar';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import { formatDateTime, formatDate } from "@/app/lib/utils"
import 'primeicons/primeicons.css';
import '/node_modules/primeflex/primeflex.css';
import { createOrder, deleteOrder, updateOrder } from '@/app/lib/action'
import {
    fetchOrders,
} from "@/app/lib/data"
import { json } from 'stream/consumers';

const requestOrders = async () => {
    return await fetchOrders()
}

export default function OrdersTable({ initOrders, products, customers }: { initOrders: Order[], products: Product[], customers: Customer[] }) {
    let defaultOrderDate = new Date();
    let defaultDeliveryDate = (() => {
        let twoDaysLater = new Date();
        twoDaysLater.setDate(twoDaysLater.getDate() + 2);
        return twoDaysLater
    })();

    let emptyOrder: Order = {
        id: "",
        customer: {
            id: "",
            name: ""
        },
        status: "",
        payment: "",
        orderlist: [],
        orderedAt: defaultOrderDate,
        deliveryAt: defaultDeliveryDate
    };

    let emptyProduct: Product = {
        id: "",
        product_name: ""
    };

    const [orders, setOrders] = useState<Order[]>(initOrders)
    const [orderDialog, setOrderDialog] = useState<boolean>(false);
    const [order, setOrder] = useState<Order>(emptyOrder);
    const [product, setProduct] = useState<Product>(emptyProduct)
    const [productQuantity, setProductQuantity] = useState<number>(0)
    const [create, setCreate] = useState<Boolean>(false)




    const openNew = () => {
        setOrder(emptyOrder);
        setCreate(true)
        setOrderDialog(true);

    };

    const hideDialog = () => {
        setProductQuantity(0);
        setProduct(emptyProduct);
        setOrderDialog(false);
        setCreate(false);
    };

    const openEdit = (order: Order) => {
        setOrder({ ...order });
        setCreate(false)
        setOrderDialog(true);
    };

    const rightToolbarTemplate = () => {
        return (
            <div className="flex flex-wrap gap-2">
                <Button label="New Order" icon="pi pi-plus" severity="success" onClick={openNew} />
                {/* <Button className="" severity="success" icon="pi pi-plus" onClick={toastOrderProductExist}></Button> */}
            </div>
        );
    };

    const leftToolbarTemplate = () => {
        return (
            <div>
                <h1 style={{ fontSize: '2rem' }}>Orders</h1>
            </div>
        )
    }

    const actionBodyOrders = (rowData: Order) => {
        return (
            <>
                <Button className='m-1' icon="pi pi-bars" style={{ color: 'orange' }} rounded outlined onClick={() => openEdit(rowData)} />
                <Button className='m-1' icon="pi pi-trash" style={{ color: 'red' }} rounded outlined severity='danger' onClick={() => confirmDeleteDialog(rowData.id)} />
            </>
        );
    };


    const orderListTemplate = (rowData: Order) => {
        return (
            <>
                {rowData.orderlist.map((a) => {
                    return (
                        <p><i className="pi pi-at" style={{ fontSize: '0.75rem' }}></i> {a.quantity.toString()} x {a.product_name}</p>
                    )
                })}
            </>
        )
    }

    const orderDateBodyTemplate = (rowData: Order) => {
        return rowData.orderedAt ? formatDate(rowData.orderedAt) : "?"
    }

    const toast = useRef<Toast>(null);
    const toastInvalidCustomer = () => {
        toast.current?.show({ severity: 'warn', summary: 'Invalid customer', detail: 'Please select a customer.', life: 3000 });
    }

    const toastInvalidOrderProduct = () => {
        toast.current?.show({ severity: 'warn', summary: 'Invalid quantity/product', detail: 'Please select quantity / product.', life: 3000 });
    }

    const toastOrderProductExist = () => {
        toast.current?.show({ severity: 'warn', summary: 'Product already listed.', detail: 'Please delete previous ordered product or select other product.', life: 3000 });
    }

    const addOrderProduct = () => {
        if (order.customer.id) {
            if (product.id && productQuantity > 0) {
                const isExist = order.orderlist.reduce((acc, o) => {
                    return acc || Object.values(o).includes(product.id)
                }, false);

                if (!isExist) {

                    const newOrderList = [...order.orderlist, {

                        product_id: product.id,
                        product_name: product.product_name,
                        quantity: productQuantity
                    }]
                    setOrder({ ...order, orderlist: newOrderList })
                    // setOrderProducts(newOrderProducts);

                } else {
                    toastOrderProductExist();
                }
            } else {
                toastInvalidOrderProduct();
            }
        } else {
            toastInvalidCustomer();
        }
    };



    const confirmDeleteDialog = (orderId: String) => {
        const accept = async () => {
            const feedback = await deleteOrder(orderId);
            toastSubmitFeedback(feedback.message, feedback.severity)
            setOrders(await requestOrders())
        }
        confirmDialog({
            message: 'Do you want to delete this order?',
            header: 'Delete Confirmation',
            icon: 'pi pi-info-circle',
            defaultFocus: 'reject',
            acceptClassName: 'p-button-danger',
            accept,
        });
    };

    const deleteOrderProduct = (orderProduct: OrderProduct) => {
        let removed = order.orderlist.filter(op => op.product_id !== orderProduct.product_id)
        setOrder({ ...order, orderlist: removed });
    }

    const actionBodyDeleteOrderProduct = (rowData: OrderProduct) => {
        return (
            <>
                <Button className='m-1' icon="pi pi-trash" style={{ color: 'red' }} rounded outlined severity='danger'
                    onClick={() => deleteOrderProduct(rowData)} />
            </>
        );
    };

    const toastSubmitFeedback = (message: String, severity: "info" | "warn" | "error" | "success") => {
        toast.current?.show({ severity: severity ?? "info", summary: 'Feedback Message:', detail: message, life: 3000 });
    }

    const toastInvalidOrderlist = () => {
        toast.current?.show({ severity: 'warn', summary: 'Invalid Orderlist', detail: 'Please add at least one product the order-list.', life: 3000 });
    }



    const submitButtonLabel = create ? "Create" : "Update"
    const submitButtonIcon = create ? "pi pi-plus-circle" : "pi pi-pen-to-square"


    const handleSubmit = async (e: any) => {
        e.preventDefault()
        if (order.customer.id) {
            if (order.orderlist.length > 0) {
                if (create) {
                    const feedback = await createOrder(order);
                    toastSubmitFeedback(feedback.message, feedback.severity)
                    setOrders(await requestOrders())

                } else {
                    const feedback = await updateOrder(order);
                    toastSubmitFeedback(feedback.message, feedback.severity)
                    setOrders(await requestOrders())
                }


            } else {
                toastInvalidOrderlist();
            }

        } else {
            toastInvalidCustomer();
        }
    }

    return (
        <div>
            <Toast ref={toast} />

            <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>

            {/* Orders table */}
            <DataTable value={orders} dataKey="id" tableStyle={{ minWidth: '50rem' }}
                paginator rows={5}
            >
                <Column field='deliveryAt' header='Tanggal Kirim' dataType="date" body={orderDateBodyTemplate} style={{ minWidth: '12rem' }} sortable />
                <Column field='customer.name' header='Pemesan' style={{ minWidth: '10rem' }} />
                <Column body={orderListTemplate} header='Pesanan' style={{ minWidth: '10rem' }} />
                <Column field='status' header='Status' style={{ minWidth: '5rem' }} />
                <Column body={actionBodyOrders} style={{ minWidth: '8rem' }}></Column>
            </DataTable>

            {/* order dialogue */}

            <Dialog visible={orderDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header={create ? "Create Order" : "Edit Order"} modal className="p-fluid" onHide={hideDialog}>

                <div className='mb-2'>
                    <p>{JSON.stringify(order)}</p>
                    <p>{JSON.stringify(productQuantity)}</p>
                    <label>Pemesan:</label>
                    <Dropdown id='customer' value={order.customer}
                        onChange={(e) => setOrder({ ...order, customer: e.value })}
                        options={customers} optionLabel="name"
                        placeholder="Select a customer" className="w-full"
                    />
                </div>

                <div className='mb-2'>
                    <label>Tanggal Pesan:</label>
                    <Calendar id='orderedAt' value={order.orderedAt}
                        onChange={(e) => setOrder({ ...order, orderedAt: e.value })}
                    />
                </div>

                <div className='mb-2'>
                    <label>Pesanan:</label>
                    <div className='grid grid-nogutter'>
                        <div className="col-fixed mr-3" style={{ "width": "100px" }}>
                            <InputNumber id='productQuantity' inputId="minmax-buttons" value={productQuantity}
                                onValueChange={(e: InputNumberValueChangeEvent) => setProductQuantity(e.value ?? 0)}
                                mode="decimal" showButtons min={0} max={100}
                                incrementButtonClassName='p-button-success'
                                decrementButtonClassName='p-button-success'
                            />
                        </div>
                        <div className='col mr-3'>
                            <Dropdown id="product" value={product} onChange={(e) => setProduct(e.value)}
                                options={products} optionLabel="product_name"
                                placeholder="Select a Product" className="w-full"
                            />
                        </div>
                        <div className="col-fixed float-right mr-3" style={{ "width": "25px" }}>
                            <Button id='addProductQty' className="" severity="success"
                                icon="pi pi-plus" onClick={addOrderProduct}></Button>
                        </div>
                    </div>
                    {order.orderlist.length > 0 && (
                        <div className='card my-3'>

                            <DataTable value={order.orderlist} size='small'>
                                <Column field="quantity" header="Qty"></Column>
                                <Column field="product_name" header="Product"></Column>
                                <Column body={actionBodyDeleteOrderProduct} style={{ minWidth: '8rem' }}></Column>
                            </DataTable>
                        </div>
                    )}

                </div>
                <div className='mb-2'>
                    <label>Deadline pengiriman:</label>
                    <Calendar value={order.deliveryAt}
                        minDate={defaultOrderDate}
                        onChange={(e) => setOrder({ ...order, deliveryAt: e.value })}
                    />
                </div>
                <div className="float-right my-3">

                    <form onSubmit={handleSubmit}>
                        <Button type='submit' label={submitButtonLabel} id="submitButton" value="submit"
                            severity="success" icon={submitButtonIcon} />
                    </form>
                </div>
            </Dialog>

            <ConfirmDialog />
        </div>
    )
}