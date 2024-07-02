import { PrimeReactProvider } from "primereact/api";
import 'primeicons/primeicons.css';
import '/node_modules/primeflex/primeflex.css';
import "primereact/resources/themes/saga-green/theme.css";

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <PrimeReactProvider>
      <>
        <div className="bg-primary-100 h-screen">
          {children}
        </div>
      </>
    </PrimeReactProvider>
  );
}
