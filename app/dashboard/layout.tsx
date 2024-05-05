import SideNav from "@/app/ui/dashboard/sidenav";
import { PrimeReactProvider } from "primereact/api";
import '@/app/ui/global.css';


import "primereact/resources/themes/saga-orange/theme.css";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <PrimeReactProvider>
            <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
                <div className="w-full flex-none md:w-64">
                    <SideNav />
                </div>
                <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
            </div>
        </PrimeReactProvider>
    );
}
