// import { GlobeAltIcon } from "@heroicons/react/24/outline";
import { lusitana } from "@/app/ui/fonts";
import Image from 'next/image';
import logo from '@/public/skill-troc-logo.png';
export default function SkillTrocLogo() {
  return (
    <div
      className={`${lusitana.className} flex flex-row items-center leading-none text-black`}
    >
      <Image src={logo} alt="Acme Logo" width={72} height={72} className="ml-2" />
      <p className="text-[44px]">SkillTroc</p>
    </div>
  );
}
