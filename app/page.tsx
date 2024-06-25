import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col p-6 bg-green-50">
      <div className="flex h-20 shrink-0 items-end rounded-lg bg-green-500 p-4 md:h-52">
        <p className='font-bold text-5xl text-teal-50'>e-Bakery</p>
      </div>
      <div className="mt-4 flex grow flex-col gap-4 md:flex-row">
        <div className="flex flex-col justify-center gap-6 rounded-lg bg-gray-50 px-6 py-10 md:w-2/5 md:px-20">


          <p className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}>
            <strong>Welcome to eBakery.</strong> Digital management system for bakeries.
          </p>
          <div className="flex xl:justify-start md:justify-center sm:justify-center">
            <Link
              href="/dashboard"
              className="flex items-center gap-5 self-start rounded-lg bg-green-500 shadow-8 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-green-400 md:text-base"
            >
              <span>Dashboard</span> <ArrowRightIcon className="w-5 md:w-6" />
            </Link>
          </div>
          <div className="flex xl:justify-start md:justify-center sm:justify-center">

            <Link
              href="/dashboard/orders"
              className="flex items-center gap-5 self-start rounded-lg bg-green-500 shadow-8 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-green-400 md:text-base"
            >
              <span>Orders</span> <ArrowRightIcon className="w-5 md:w-6" />
            </Link>
          </div>
        </div>
        <div className="flex items-center justify-center p-6 md:w-3/5 md:px-28 md:py-12">
          {/* Add Hero Images Here */}

        </div>
      </div>
    </main>
  );
}
