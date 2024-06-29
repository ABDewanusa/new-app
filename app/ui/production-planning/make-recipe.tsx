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

        const recipe = {
            "Tepung": Math.round(totalGrams * 0.558763271 * 100) / 100,
            "Gula": Math.round(totalGrams * 0.040230955 * 100) / 100,
            "Susu": Math.round(totalGrams * 0.005587633 * 100) / 100,
            "Improver": Math.round(totalGrams * 0.00167629 * 100) / 100,
            "Garam": Math.round(totalGrams * 0.006705159 * 100) / 100,
            "Niacet": Math.round(totalGrams * 0.00167629 * 100) / 100,
            "Ragi": Math.round(totalGrams * 0.010057739 * 100) / 100,
            "Lesitin": Math.round(totalGrams * 0.002793816 * 100) / 100,
            "BOS": Math.round(totalGrams * 0.055876327 * 100) / 100,
            "Air+Telur": Math.round(totalGrams * 0.204879866 * 100) / 100,
            "Es": Math.round(totalGrams * 0.111752654 * 100) / 100

        }

        return (
            <>
                <div className="flex flex-column flex-wrap  px-3">
                    {(selectedItems.length > 0) && (
                        Object.entries(result).map(([id, { name, quantity, gramSubTotal }]) => (
                            <div className='grid flex flex-wrap grid-nogutter' key={id}>
                                <div className='col-fixed flex justify-content-start' style={{ "width": "190px" }}>{name}</div>
                                <div className='col-fixed ' style={{ "width": "10px" }}>&nbsp;:</div>
                                <div className='col-fixed flex justify-content-end font-medium' style={{ "width": "55px" }}>{quantity}</div>
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

                <Divider />
                <div className="flex flex-column flex-wrap px-8">
                    {(selectedItems.length > 0) && (
                        Object.entries(recipe).map(([ingredient, amount]) => (
                            <div className='grid flex flex-wrap grid-nogutter ' key={ingredient}>
                                <div className='col flex justify-content-start'>{ingredient}</div>
                                <div className='col-fixed ' style={{ "width": "15px" }}>:</div>
                                <div className='col-fixed flex justify-content-end font-medium' style={{ "width": "110px" }}>{amount} gram</div>

                            </div>
                        ))
                    )
                    }


                </div>

            </>
        )
    }
    return (
        <div className="flex justify-content-center flex-wrap max-w-full">

            <Card className="flex justify-content-center my-2 lg:mr-2 shadow-6 bg-green-50 w-26rem">
                <QueueTable
                    handleSelectedItems={handleSelectedItems}
                />
            </Card>

            <Card className="my-2 lg:ml-2 shadow-6 bg-red-50 w-max-">
                <div className="flex justify-content-center flex-wrap">
                    <p className='flex justify-content-center text-xl font-medium mb-2'>Kartu Rencana Produksi</p>
                </div>
                <RecipeBody />
            </Card>
        </div >


    )
}