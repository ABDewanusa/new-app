'use client'

import { DataTable, DataTableSelectEvent } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React, { useState, useEffect, useRef, use } from 'react';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { Button } from "primereact/button";
import { InputSwitch } from 'primereact/inputswitch';
import { Calendar } from 'primereact/calendar';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Dropdown } from 'primereact/dropdown';

import {
    fetchOrders,
    fetchProducts,
    fetchCustomers
} from "@/app/lib/raw_data"

import {
    FormattedOrder,
    FormattedOrderProduct,
    Product,
    Customer,
} from '@/app/lib/definitions';

import {
    formatDate,
    formatDateTime,
    formatOrders
} from "@/app/lib/utils";

import {
    updateDeliveryDate,
    updateStatus,
    updateOrderList,
    createOrder
} from '@/app/lib/action'



export default function OrdersTable() {
    let defaultOrderDate = new Date();
    let defaultDeliveryDate = (() => {
        let twoDaysLater = new Date();
        twoDaysLater.setDate(twoDaysLater.getDate() + 2);
        return twoDaysLater
    })();

    const [orders, setOrders] = useState<FormattedOrder[]>([]);
    const [showAll, setShowAll] = useState<boolean>(false)
    const [filteredOrders, setFilteredOrders] = useState<FormattedOrder[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<FormattedOrder | null>(null)
    const [detailsDialog, setDetailsDialog] = useState<boolean>(false);
    const [createDialog, setCreateDialog] = useState<boolean>(false);

    const [editDeliveryDate, setEditDeliveryDate] = useState<boolean>(false)
    const [editStatus, setEditStatus] = useState<boolean>(false)
    const [editOrderProduct, setEditOrderProduct] = useState<boolean>(false)

    const [selectedStatus, setSelectedStatus] = useState<string>("Queued")
    const [newDeliveryDate, setNewDeliveryDate] = useState<Date>(defaultDeliveryDate)
    const [newOrderList, setNewOrderList] = useState<FormattedOrderProduct[]>([])
    const [product, setProduct] = useState<Product | null>(null);
    const [productQuantity, setProductQuantity] = useState<number>(0);
    const [newOrderDate, setNewOrderDate] = useState<Date>(defaultOrderDate)
    const [customer, setCustomer] = useState<Customer | null>(null)

    const [products, setProducts] = useState<Product[]>([])
    const [customers, setCustomers] = useState<Customer[]>([])

    const toast = useRef<Toast>(null);

    const loadOrders = () => {
        fetchOrders().then((data) => formatOrders(data)).then((data) => {
            setOrders([]);
            setTimeout(function () {
                setOrders(data);
                setFilteredOrders(data.filter(function (el) {
                    return (el.status != "Delivered")
                }));
            }, 50);
        });
    }

    useEffect(() => {
        loadOrders();
        fetchProducts().then((data) => setProducts(data));
        fetchCustomers().then((data) => setCustomers(data));
    }, []);

    const orderListTemplate = (rowData: FormattedOrder) => {
        return (
            <>
                <p className="font-medium">{rowData.customer.name}</p>
                {rowData.orderlist.map((a) => {
                    return (
                        <p key={a.productId.toString()}><i className="pi pi-at" style={{ fontSize: '0.75rem' }}></i> {a.quantity.toString()} x {a.productName}</p>
                    )
                })}
            </>
        )
    }

    const orderDateBodyTemplate = (rowData: FormattedOrder) => {
        return (
            <>
                <p>{rowData.deliveryAt ? formatDate(rowData.deliveryAt) : "?"}</p>
                <p className="font-medium">({rowData.status})</p>
            </>
        )
    }

    const tableHeader = () => {
        return (
            <div className="grid">
                <div className="col flex justify-content-start flex-wrap">
                    <div className="flex align-items-center justify-content-center">
                        <p className="text-2xl w-10">Orders</p>
                    </div>
                </div>
                <div className="col flex justify-content-end flex-wrap">
                    <div className="grid">
                        <div className="col flex align-items-center justify-content-center m-0 p-0">
                            <label htmlFor="filter">all orders&nbsp;</label>
                            <InputSwitch inputId="filter" checked={showAll} onChange={(e) => setShowAll(e.value)} />

                        </div>
                        <div className="col flex align-items-center justify-content-center m-0 p-0">
                            <Button onClick={loadOrders} size='small' rounded text raised><i className="pi pi-refresh" style={{ fontSize: '1rem' }}></i></Button>
                        </div>
                        <div className="col flex align-items-center justify-content-center m-0 p-0">
                            <Button onClick={openCreateDialog} severity="info" size='small' rounded text raised><i className="pi pi-plus" style={{ fontSize: '1rem' }}></i></Button>
                        </div>
                    </div>

                </div>
            </div>
        )
    }

    const openCreateDialog = () => {
        setSelectedOrder(null)
        setCustomer(null)
        setSelectedStatus("Queued")
        setNewOrderList([]);
        setProductQuantity(0);
        setProduct(null);
        setNewDeliveryDate(defaultDeliveryDate)
        setNewOrderDate(defaultOrderDate)
        setEditStatus(false)
        setCreateDialog(true)
    }

    const closeCreateDialog = () => {
        setCreateDialog(false)

    }
    const openDetailsDialog = () => {
        setDetailsDialog(true)
        setEditDeliveryDate(false)
        setEditStatus(false)
    }

    const closeDetailsDialog = () => {
        setDetailsDialog(false)
    }

    const onRowSelect = (event: DataTableSelectEvent) => {
        setSelectedOrder(event.data)
        openDetailsDialog();
    };

    const toastFeedback = (message: String, severity: "info" | "warn" | "error" | "success") => {
        toast.current?.show({ severity: severity ?? "info", summary: 'Feedback Message:', detail: message, life: 3000 });
    }

    const submitDeliveryDate = async (e: any) => {
        e.preventDefault()
        if (selectedOrder) {
            const feedback = await updateDeliveryDate(selectedOrder.id, newDeliveryDate)
            if (feedback.severity == "success") {
                setSelectedOrder({ ...selectedOrder, deliveryAt: newDeliveryDate })
            }
            toastFeedback(feedback.message, feedback.severity)
            loadOrders()
        }

        setEditDeliveryDate(false)
    }

    const submitStatus = async (e: any) => {
        e.preventDefault()
        if (selectedOrder) {
            const feedback = await updateStatus(selectedOrder.id, selectedStatus)
            if (feedback.severity == "success") {
                setSelectedOrder({ ...selectedOrder, status: selectedStatus })
            }
            toastFeedback(feedback.message, feedback.severity)
            loadOrders()

        }

        setEditStatus(false)
    }

    const submitOrderList = async (e: any) => {
        e.preventDefault()
        if (selectedOrder) {
            if (JSON.stringify(selectedOrder.orderlist) == JSON.stringify(newOrderList)) {
                toastFeedback("No change has been made.", "warn")
            } else {
                const feedback = await updateOrderList(selectedOrder.id, newOrderList)
                if (feedback.severity == "success") {
                    setSelectedOrder({ ...selectedOrder, orderlist: newOrderList })
                }
                toastFeedback(feedback.message, feedback.severity)
                loadOrders()
            }
        }
        setEditOrderProduct(false)
    }

    const submitNewOrder = async (e: any) => {
        e.preventDefault()
        if (customer) {
            if (newOrderList.length > 0) {
                const newOrder = {
                    orderedAt: newOrderDate,
                    deliveryAt: newDeliveryDate,
                    orderStatus: selectedStatus,
                    customer: { id: customer.id, name: customer.name },
                    orderlist: newOrderList,
                }
                // toastFeedback(JSON.stringify(newOrder), "info")

                const feedback = await createOrder(newOrder)
                toastFeedback(feedback.message, feedback.severity)
                loadOrders()
                closeCreateDialog()

            } else {
                // toastFeedback("Please add at least one product.", "warn")
                toastFeedback("Mohon masukkan sedikitnya satu produk ke dalam daftar rincian pesanan.", "warn")
            }
        } else {
            // toastFeedback("Please select a customer.", "warn")
            toastFeedback("Mohon masukkan informasi pelanggan/pemesan.", "warn")
        }

    }

    const formDeliveryDate = () => {
        return (
            <form onSubmit={submitDeliveryDate}>
                <div className="grid grid-nogutter py-2">
                    <div className="col">
                        <Calendar value={selectedOrder ? selectedOrder.deliveryAt : newDeliveryDate}
                            minDate={selectedOrder ? selectedOrder.orderedAt : newOrderDate}
                            onChange={(e) => setNewDeliveryDate(e.value ?? defaultDeliveryDate)}
                        />
                    </div>
                    {detailsDialog && (
                        <>
                            <div className="col-1 my-1 mx-2">
                                <Button className="flex align-items-center justify-content-center"
                                    rounded outlined type="submit"
                                ><i className="pi pi-check" style={{ fontSize: '1rem' }}></i>
                                </Button>
                            </div>
                            <div className="col-1 my-1 mx-2" >
                                <Button className="flex align-items-center justify-content-center"
                                    severity="danger" rounded outlined
                                    onClick={function () { setEditDeliveryDate(false) }}>
                                    <i className="pi pi-times" style={{ fontSize: '1rem' }}></i>
                                </Button>
                            </div>
                        </>
                    )}

                </div>
            </form>
        )
    }

    const formStatus = () => {
        return (
            <form onSubmit={submitStatus}>
                <div className="grid mt-1 p-1">
                    <div className="col ml-2">
                        <div className="flex flex-wrap gap-2">
                            <div className="flex align-items-center">
                                <RadioButton inputId="status1" name="queued" value="Queued"
                                    onChange={(e: RadioButtonChangeEvent) => setSelectedStatus(e.value)}
                                    checked={selectedStatus === "Queued"}
                                />
                                <label htmlFor="status1" className="ml-2"><b>Antrian</b> (<i>Queued</i>)</label>
                            </div>

                            <div className="flex align-items-center">
                                <RadioButton inputId="status2" name="partially-delivered" value="Partially-Delivered"
                                    onChange={(e: RadioButtonChangeEvent) => setSelectedStatus(e.value)}
                                    checked={selectedStatus === "Partially-Delivered"}
                                />
                                <label htmlFor="status2" className="ml-2"><b>Diantar-Sebagian</b> (<i>Partially-Delivered</i>)</label>
                            </div>
                            <div className="flex align-items-center">
                                <RadioButton inputId="status3" name="delivered" value="Delivered"
                                    onChange={(e: RadioButtonChangeEvent) => setSelectedStatus(e.value)}
                                    checked={selectedStatus === "Delivered"}
                                />
                                <label htmlFor="status3" className="ml-2"><b>Sudah Diantar</b> (<i>Delivered</i>)</label>
                            </div>
                        </div>
                    </div>
                    {editStatus && (
                        <div className="col-5 ">
                            <div className="my-2 ">
                                <Button className="flex align-items-center justify-content-center"
                                    rounded outlined
                                ><i className="pi pi-check" style={{ fontSize: '1rem' }}></i>
                                    &nbsp;Simpan
                                </Button>
                            </div>
                            <div className="my-2 ">
                                <Button className="flex align-items-center justify-content-center"
                                    severity="danger" rounded outlined
                                    onClick={function () { setEditStatus(false) }}>
                                    <i className="pi pi-times" style={{ fontSize: '1rem' }}></i>
                                    &nbsp;Batal
                                </Button>
                            </div>

                        </div>
                    )}

                </div >
            </form>
        )
    }

    const deleteOrderProduct = (orderProduct: FormattedOrderProduct) => {
        let removed = newOrderList.filter(op => op.productId !== orderProduct.productId)
        setNewOrderList(removed)
    }

    const actionBodyDeleteOrderProduct = (rowData: FormattedOrderProduct) => {
        return (
            <>
                {/* <p>{JSON.stringify(rowData)}</p> */}
                <Button className='' icon="pi pi-trash" style={{ color: 'red' }} rounded outlined severity='danger'
                    onClick={() => deleteOrderProduct(rowData)} />
            </>
        );
    };

    const addOrderProduct = () => {
        if (product) {
            if (product.id && productQuantity > 0) {

                const isExist = newOrderList.reduce((acc, o) => {
                    return acc || Object.values(o).includes(product.id)
                }, false);

                if (!isExist) {
                    let added = [...newOrderList, {
                        productId: product.id,
                        productName: product.name,
                        quantity: productQuantity
                    }]

                    setNewOrderList(added)

                } else {
                    // toastFeedback("That product has already exist. Remove the existing product first, before adding the same product.", "warn")
                    toastFeedback("Produk tersebut sudah ada. Hapus produk tersebut dari daftar sebelum menambahkan produk yang sama.", "warn")
                }


            } else {
                // toastFeedback("Please input correct 'quantity' and 'product' to add.", "warn")
                toastFeedback("Mohon masukkan jumlah dan produk yang sesuai untuk ditambah ke daftar", "warn")
            }
        } else {
            // toastFeedback("Please input correct 'quantity' and 'product' to add.", "warn")
            toastFeedback("Mohon masukkan jumlah dan produk yang sesuai untuk ditambah ke daftar", "warn")
        }

    }

    const formAddOrderProduct = () => {
        return (
            <div className="flex mt-1 mb-2 y-1 ">
                <div className='grid grid-nogutter'>
                    <div className="col-fixed mr-1" style={{ "width": "75px" }}>
                        <InputNumber name='productQuantity' inputId='ProductQuantity' value={productQuantity}
                            onValueChange={(e: InputNumberValueChangeEvent) => setProductQuantity(e.value ?? 0)}
                            mode="decimal" showButtons min={0} max={100}

                        />
                    </div>
                    <div className='col-fixed mr-1' style={{ "width": "195px" }}>
                        <Dropdown name="product" inputId="Product" value={product} onChange={(e) => setProduct(e.value)}
                            options={products} optionLabel="name"
                            placeholder="Select a Product" className="w-full"
                        />
                    </div>
                    <div className="col-fixed float-right " style={{ "width": "25px" }}>
                        <Button name='addProductQty' id='addProductQty'
                            icon="pi pi-plus" onClick={addOrderProduct}></Button>
                    </div>
                </div>
            </div>
        )
    }

    const orderListTable = () => {
        return (
            <div className='border my-1'>
                <DataTable dataKey="productId" value={(editOrderProduct || createDialog) ? newOrderList : selectedOrder?.orderlist}
                    size='small' tableStyle={{ height: '0.5rem' }}>
                    <Column field="quantity" header="Qty"></Column>
                    <Column field="productName" header="Product"></Column>
                    {(editOrderProduct || createDialog) && (
                        <Column body={actionBodyDeleteOrderProduct} style={{ minWidth: '2rem' }}></Column>
                    )
                    }

                </DataTable>
            </div >
        )
    }

    const editOrderListButtons = () => {
        return (
            <form onSubmit={submitOrderList}>
                <Button
                    severity="danger" onClick={function () {
                        setEditOrderProduct(false);
                        setNewOrderList([]);
                        setProductQuantity(0);
                        setProduct(null);
                    }}
                    className="flex-end w-5 align-items-center justify-content-center py-1 mr-2"
                >Batal</Button>
                <Button
                    className="flex-end w-5 align-items-center justify-content-center py-1"
                    type="submit"
                >Simpan</Button>
            </form>
        )
    }

    const bodyDetailsDialog = () => {
        return (
            <div className="grid">
                <div className="col">
                    {/* <p>{JSON.stringify(selectedOrder)}</p> */}
                    <div className="mb-2">
                        <p>Pemesan:</p>
                        <p className="font-medium">{selectedOrder?.customer.name}</p>
                    </div>
                    <div className="mb-2">
                        <p>Tanggal Pesan:</p>
                        <p className="font-medium">{selectedOrder?.orderedAt ? formatDateTime(selectedOrder.orderedAt) : ""}</p>
                    </div>
                    <div className="mb-2">
                        <p>Tanggal Kirim:</p>
                        <p className="font-medium flex align-items-center ">
                            {selectedOrder?.deliveryAt ? formatDateTime(selectedOrder.deliveryAt) : ""}
                            <Button onClick={function () { setEditDeliveryDate(true); setEditStatus(false); setEditOrderProduct(false) }} icon="pi pi-pen-to-square" size="small" text rounded />
                        </p>
                        <div className="flex">
                            {editDeliveryDate ? formDeliveryDate() : ""}
                        </div>
                    </div>
                    <div className="mb-2">
                        <p>Status:</p>
                        <p className="font-medium flex align-items-center">
                            {selectedOrder?.status}
                            <Button onClick={function () { setEditStatus(true); setEditDeliveryDate(false); setEditOrderProduct(false) }} icon="pi pi-pen-to-square" size="small" text rounded />
                        </p>
                        <div className="flex">
                            {editStatus ? formStatus() : ""}
                        </div>
                    </div>
                    <div className="mb-2">
                        <p>Rincian Pesanan:</p>
                        {editOrderProduct && formAddOrderProduct()}

                        {orderListTable()}

                        <div className="flex justify-content-end">
                            {editOrderProduct == false && (
                                <Button
                                    onClick={function () {
                                        setEditOrderProduct(true);
                                        setEditDeliveryDate(false);
                                        setEditStatus(false);
                                        setNewOrderList(selectedOrder ? selectedOrder.orderlist : []);
                                    }}
                                    className="flex-end w-3 align-items-center justify-content-center py-1"
                                >Ubah</Button>
                            )}
                            {editOrderProduct && editOrderListButtons()}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    const bodyCreateDialog = () => {
        return (
            <div className="grid">
                <div className="col">
                    <div className="mb-2">
                        <p>Pemesan:</p>
                        <Dropdown name='customer' inputId='Customer'
                            value={customer}
                            onChange={(e) => setCustomer(e.value)}
                            options={customers} optionLabel="name"
                            placeholder="Pilih pelanggan" className="w-full"
                        />
                    </div>
                    <div className="mb-2">
                        <p>Tanggal Pesan:</p>
                        <div className="grid grid-nogutter py-2 ">
                            <div className="col">
                                <Calendar value={newOrderDate}
                                    onChange={(e) => setNewOrderDate(e.value ?? defaultDeliveryDate)}
                                />
                            </div>
                        </div>

                    </div>
                    <div className="mb-2">
                        <p>Tanggal Kirim:</p>
                        <div className="grid mt-1">
                            <div className="col">
                                {formDeliveryDate()}
                            </div>
                        </div>

                    </div>
                    <div className="mb-2">
                        <p>Status:</p>
                        <div className="flex">
                            {formStatus()}
                        </div>
                    </div>
                    <div className="mb-2">
                        <p>Rincian Pesanan:</p>
                        {formAddOrderProduct()}
                        {orderListTable()}
                    </div>
                    <div className="flex justify-content-end mt-5 ">
                        <Button
                            severity="danger" onClick={closeCreateDialog}
                            className="flex-end w-3 align-items-center justify-content-center py-1 mr-2"
                        >Batal</Button>
                        <form onSubmit={submitNewOrder}>
                            <Button
                                className="flex-end w-12 align-items-center justify-content-center py-1"
                                type="submit"
                            >Simpan</Button>
                        </form>
                    </div>

                </div>
            </div >
        )
    }

    return (
        <div>
            <Toast ref={toast} />

            {/* <p>{JSON.stringify(products)}</p> */}

            {/* Orders table */}
            <DataTable
                size='small'
                value={showAll ? orders : filteredOrders} dataKey="id" header={tableHeader}
                selection={selectedOrder!} selectionMode="single"
                onRowSelect={(e) => onRowSelect(e)} onSelectionChange={(e) => setSelectedOrder(e.value)}
                paginator rows={15} sortField='deliveryAt' sortOrder={1}
            >
                <Column field='deliveryAt' header='Tanggal Kirim' dataType="date" body={orderDateBodyTemplate} style={{ minWidth: '10rem' }} sortable />
                {/* <Column field='customer.name' header='Pemesan' style={{ minWidth: '15rem' }} /> */}
                <Column body={orderListTemplate} header='Pesanan' style={{ minWidth: '15rem' }} />
                {/* <Column field='status' header='Status' style={{ minWidth: '5rem' }} /> */}
            </DataTable>
            <Dialog modal className="p-fluid" style={{ width: '380px' }}
                visible={detailsDialog} header={"Order Details"} onHide={closeDetailsDialog}>
                {bodyDetailsDialog()}
            </Dialog>
            <Dialog modal className="p-fluid" style={{ width: '380px' }}
                visible={createDialog} header={"Create Order"} onHide={closeCreateDialog}>
                {bodyCreateDialog()}
            </Dialog>


        </div >
    )

}