'use client'

import { useState, useEffect, useRef } from 'react';
import { Toast } from 'primereact/toast';
import {
    FormattedOrder,
} from '@/app/lib/definitions';
import { Card } from 'primereact/card';
import QueueTable from "@/app/ui/production-planning/simplified-queue-table";

export default function MakeRecipe() {
    const [selectedOrders, setSelectedOrders] = useState<FormattedOrder[]>([]);

    const handleSelectedOrders = (data: FormattedOrder[]): void => {
        setSelectedOrders(data)
    }

    const RecipeBody = () => {
        const orderlist = selectedOrders.map((x) => (x.orderlist))
        return (
            <div>
                <p className='font-medium'>
                    {
                        orderlist.map(a => a.map(b => <p key={b.productId}>{b.productName}</p>))
                    }
                </p>
            </div>
        )
    }
    return (
        <div className="grid flex justify-content-center flex-wrap max-w-full">
            <div className="col flex align-items-center justify-content-center
        m-2 ">
                <Card className="min-w-full">
                    <div className="">
                        <QueueTable
                            handleSelectedOrders={handleSelectedOrders}
                        />

                    </div>
                </Card>
            </div>
            <div className="col flex align-items-center justify-content-center
        m-2 w-6">
                <Card className="bg-primary shadow-6 min-w-full flex justify-content-center">
                    <div className="flex justify-content-center flex-wrap">
                        <RecipeBody />

                    </div>
                </Card>
            </div >

        </div >
    )
}