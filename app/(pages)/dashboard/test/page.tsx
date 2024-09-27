import { Metadata } from "next";
import { Card } from 'primereact/card';
import TeleSender from "@/app/ui/test/teleSender";

export const metadata: Metadata = {
    title: "Test Page",
};

export default function Page() {



    return (
        <div>
            <p className="flex justify-content-center text-xl bg-green-500">Test Page</p>

            <div className="mt-2">
                <Card title="Telegram Message Sender" className="m-2">
                    <TeleSender />
                </Card>
            </div>



        </div>



    )

}