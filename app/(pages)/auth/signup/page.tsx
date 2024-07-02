import { Metadata } from "next";
import { Card } from 'primereact/card';
import LoginForm from "@/app/ui/login-form";
import {
    UserIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
    title: "Sign Up",
};

export default async function LoginPage() {
    const Header = () => {
        return (
            <div className="flex justify-content-center h-20 w-full bg-primary p-3 shadow-6 ">
                <p className="flex justify-content-center text-6xl font-medium text-white">e-Bakery</p>
            </div>
        )
    }

    const title = () => {
        return (
            <div className="flex flex-wrap flex-column">
                <div className="flex justify-content-center align-items-center ">
                    <div className="flex justify-content-center align-items-center bg-primary-200 w-[5rem] h-[5rem] border-circle border-primary-500">
                        {/* <i className="pi pi-user text-5xl font-normal" /> */}
                        <UserIcon className="size-14" />
                    </div>
                </div>

                <p className="flex justify-content-center text-2xl font-normal mt-2">
                    Welcome!
                </p>
            </div >
        )
    }

    return (
        <>
            <main className="">
                <Header />
                <div className="flex justify-content-center p-4">
                    <Card className="mt-4 min-w-[18rem] min-h-[20rem] rounded-xl shadow-6"
                        title={title()}>
                        <LoginForm />
                    </Card>
                </div>
            </main>
        </>
    )
}