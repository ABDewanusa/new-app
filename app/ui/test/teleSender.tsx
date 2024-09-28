'use client'

import { InputText } from 'primereact/inputtext';
import { useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { sendTele } from '@/app/lib/action'
import { Toast } from 'primereact/toast';


export default function TeleSender() {
    const [message, setMessage] = useState<string>('');
    const toast = useRef<Toast>(null);
    const toastFeedback = (message: String, severity: "info" | "warn" | "error" | "success") => {
        toast.current?.show({ severity: severity ?? "info", summary: 'Feedback Message:', detail: message, life: 3000 });
    }

    const chatId = "-1002266113223" //eBakery group chat
    // const chatId = "7950865751" // myId
    const chatId2 = "6458283705" // bob
    const sendMessage = async () => {
        const feedback = await sendTele(message, chatId)
        const feedback2 = await sendTele(message, chatId2)
        toastFeedback(feedback.message, feedback.severity)
        toastFeedback(feedback2.message, feedback2.severity)
        // console.log(feedback.data)
    }

    return (
        <>
            <Toast ref={toast} />
            < div className="card flex justify-content-center" >
                <InputText value={message} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)} />
                <Button onClick={sendMessage} className="ml-2" label="Submit" />
            </div >

        </>
    )
}


