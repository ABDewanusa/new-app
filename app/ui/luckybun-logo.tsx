import { BugAntIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
    return (
        <div
            className={`${lusitana.className} flex flex-row items-center leading-none text-white`}
        >
            <p><BugAntIcon className="h-12 w-12 rotate-[15deg]" /></p>
            <p className="text-[36px]">LuckyBun</p>
        </div>
    );
}
