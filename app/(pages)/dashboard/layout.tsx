import { PrimeReactProvider } from "primereact/api";
import NavBar from "@/app/ui/dashboard/navbar"
import 'primeicons/primeicons.css';
import '/node_modules/primeflex/primeflex.css';
import "primereact/resources/themes/saga-green/theme.css";

export default function Layout({ children }: { children: React.ReactNode }) {

    return (
        <PrimeReactProvider>
            <>
                <NavBar />
                <div className="">
                    {children}
                </div>
            </>
        </PrimeReactProvider>
    );
}
