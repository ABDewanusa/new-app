import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">

      <div className="">
        <p className={`${lusitana.className} text-xl text-gray-800 md:text-3xl md:leading-normal`}>
          <strong>Welcome to eBakery.</strong>
        </p>
        <p className={`${lusitana.className} text-xl text-gray-500 md:text-3xl md:leading-normal`}>
          It's a management system for bakery's day-to-day operations.
        </p>
      </div>
      <div className="">

        <Link
          href="/login"
          className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
        >
          <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6" />
        </Link>

        <br />

        <Link
          href="/dashboard"
          className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
        >
          <span>Dashboard</span>
        </Link>

      </div>
      <div className="">

      </div>

      <div className="text-center lg:mb-0 lg:w-full lg:max-w-5xl lg:grid-cols-4 lg:text-center">
        <h4>
          I want to write something
          <a href="https://medium.com" target="_blank"
            rel="noopener noreferrer"><strong> here</strong>
          </a>
          .
        </h4>
      </div>
    </main>
  );
}
