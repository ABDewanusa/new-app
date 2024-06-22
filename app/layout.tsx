import { PrimeReactProvider } from "primereact/api";
import { inter } from '@/app/ui/fonts';
import { Metadata } from 'next';
import '@/app/ui/global.css';
import 'primeicons/primeicons.css';
import '/node_modules/primeflex/primeflex.css';
import "primereact/resources/themes/saga-green/theme.css";
// import 'primereact/resources/themes/lara-light-blue/theme.css'

export const metadata: Metadata = {
  title: {
    template: '%s | eBakery',
    default: 'eBakery',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <PrimeReactProvider>
        <body className={`${inter.className}`}>
          {children}
        </body>
      </PrimeReactProvider>
    </html>
  );
}
