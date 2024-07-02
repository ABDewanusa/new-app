'use client'
import {
    AtSymbolIcon,
    KeyIcon,
    ExclamationCircleIcon,
} from '@heroicons/react/24/outline';
import { Button } from "primereact/button";
import { InputText } from 'primereact/inputtext';
import { authenticate } from '@/app/lib/action';
import { useFormState, useFormStatus } from 'react-dom'


export default function LoginForm() {
    const [errorMessage, dispatch] = useFormState(authenticate, undefined)

    return (
        <form action={dispatch}>
            <div className="flex-1 rounded-lg px-2 pb-3">
                <div className="w-full">
                    <div>
                        <label
                            className="mb-1 block text-xs font-medium text-gray-900"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <div className="relative">
                            <InputText
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Enter your email"
                                required
                            />
                            <AtSymbolIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                    <div className="mt-2">
                        <label
                            className="mb-1 mt-3 block text-xs font-medium text-gray-900"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <InputText
                                className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
                                id="password"
                                type="password"
                                name="password"
                                placeholder="Enter password"
                                required
                                minLength={6}
                            />
                            <KeyIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />

                        </div>
                    </div>
                </div>
                <LoginButton />
                <div
                    className="flex h-8 items-end space-x-1"
                    aria-live="polite"
                    aria-atomic="true"
                >
                    {errorMessage && (
                        <>
                            <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                            <p className="text-sm text-red-500">{errorMessage}</p>
                        </>
                    )}
                </div>
            </div>
        </form>
    )
}

function LoginButton() {
    const { pending } = useFormStatus()

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        if (pending) {
            event.preventDefault()
        }
    }

    return (
        <Button className="mt-4 w-full flex justify-content-center rounded-lg font-medium"
            type='submit'
            aria-disabled={pending}
            onClick={handleClick}
        >
            Log In &nbsp; <i className='pi pi-sign-in'></i>
        </Button>
    )
}