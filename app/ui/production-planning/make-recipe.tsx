'use client'

import { useState, useEffect, useRef } from 'react';
import {
    FormattedOrder,
    Product,
    OrderItem
} from '@/app/lib/definitions';
import {
    fetchProducts,
} from "@/app/lib/raw_data"
import { Card } from 'primereact/card';
import QueueTable from "@/app/ui/production-planning/simplified-queue-table";
import { Divider } from 'primereact/divider';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from "primereact/button";

export default function MakeRecipe() {

    const [selectedItems, setSelectedItems] = useState<OrderItem[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    useEffect(() => {
        fetchProducts().then((data) => setProducts(data))
    }, []);

    const handleSelectedItems = (data: OrderItem[]): void => {
        setSelectedItems(data)
    }

    const RecipeBody = () => {

        const productMap = products.reduce((map, product) => {
            map[product.id] = { name: product.name, gram: product.gramPerUnit * product.unitPerPack };
            return map;
        }, {} as { [key: string]: { name: string, gram: number } });

        const quantityMap = selectedItems.flat().reduce((map, item) => {
            if (!map[item.productId]) {
                map[item.productId] = 0;
            }
            map[item.productId] += item.quantity;
            return map;
        }, {} as { [key: string]: number });

        const result = Object.keys(quantityMap).reduce((obj, productId) => {
            // obj[productName] = quantityMap[productId];
            obj[productId] = { name: productMap[productId].name, quantity: quantityMap[productId], gramSubTotal: quantityMap[productId] * productMap[productId].gram }
            return obj;
        }, {} as { [key: string]: { name: string, quantity: number, gramSubTotal: number } });

        const totalGrams = Object.values(result).reduce((total, item) => {
            return total + item.gramSubTotal;
        }, 0);

        const round = (number: number, n_decimal: number) => {
            let digit = Math.pow(10, n_decimal)
            let rounded = Math.round(number * digit).toString()
            let whole = rounded.slice(0, rounded.length - 1)
            let frac = rounded.slice(rounded.length - 1)
            return whole + "." + frac
        }

        const recipeMap = {
            "Tepung": totalGrams * 0.558763271,
            "Gula": totalGrams * 0.040230955,
            "Susu": totalGrams * 0.005587633,
            "Improver": totalGrams * 0.00167629,
            "Garam": totalGrams * 0.006705159,
            "Niacet": totalGrams * 0.00167629,
            "Ragi": totalGrams * 0.010057739,
            "Lesitin": totalGrams * 0.002793816,
            "BOS": totalGrams * 0.055876327,
            "Air+Telur": totalGrams * 0.204879866,
            "Es": totalGrams * 0.111752654
        }
        const recipe = Object.entries(recipeMap).map(([ingredient, amount]) => ({ ingredient: ingredient, amount: round(amount, 1) }))
        const amount = (rowData: typeof recipe[0]) => {
            return (
                <div className="flex justify-content-end mr-5">
                    <p className='flex'>{rowData.amount}</p>
                </div>
            )
        }

        return (
            <>
                <>
                    <div className="flex flex-column flex-wrap  px-3">
                        {(selectedItems.length > 0) && (
                            Object.entries(result).map(([id, { name, quantity, gramSubTotal }]) => (
                                <div className='grid flex flex-wrap grid-nogutter' key={id}>
                                    <div className='col-fixed flex justify-content-start' style={{ "width": "200px" }}>{name}</div>
                                    <div className='col-fixed ' style={{ "width": "10px" }}>&nbsp;:</div>
                                    <div className='col-fixed flex justify-content-end font-medium' style={{ "width": "40px" }}>{quantity}</div>
                                    <div className='col-fixed flex justify-content-end ' style={{ "width": "100px" }}>&nbsp; ({gramSubTotal} gram)</div>
                                </div>
                            ))
                        )
                        }
                    </div>
                    <div className="flex justify-content-end flex-wrap ">
                        {(Object.keys(quantityMap).length > 1) && (

                            <div className="flex justify-content-center w-6rem border-top-2 border-black-alpha-40 mr-2">
                                {totalGrams} gram
                            </div>
                        )}
                    </div>
                </>

                <Divider />

                <DataTable
                    size='small'
                    value={recipe} key='ingredient'
                >
                    <Column field='ingredient' header='Bahan' style={{ minWidth: '10rem' }} />
                    <Column field='amount' header='Jumlah (gram)' body={amount} />
                </DataTable>


                <div className="flex justify-content-center mt-4">
                    <Button severity='info' size='large' rounded raised>Buat Rencana Produksi&nbsp;<i className='pi pi-file-import'></i></Button>
                </div>



            </>
        )
    }
    return (
        <div className="flex justify-content-center flex-wrap max-w-full">

            <Card className="flex justify-content-center my-2 md:mr-2 lg:mr-2 shadow-6 w-26rem">
                <QueueTable
                    handleSelectedItems={handleSelectedItems}
                />
            </Card>

            <Card className="my-2 md:ml-2 lg:ml-2 shadow-6 bg-red-50 w-26rem">
                <div className="flex justify-content-center flex-wrap">
                    <p className='flex justify-content-center text-xl font-medium mb-2'>Kartu Rencana Produksi</p>
                </div>
                <RecipeBody />
            </Card>
        </div >


    )
}