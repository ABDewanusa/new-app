import { Button } from "primereact/button";
import '@/app/ui/global.css';

export default function Home() {
  return (
    <main className="">

      <div className="">
        <p>
          <strong>Welcome to eBakery.</strong>
        </p>
        <p>
          It's a management system for bakery's day-to-day operations.
        </p>
      </div>
      <div className="">
        <a href="/dashboard" className="p-button font-bold pi pi-check">
          dashboard
        </a>
      </div>
    </main >
  );
}
