import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <div>
      <Link href="/">
        <Image src="/logo.svg" width={32} height={27} alt="Logo for PickAssistant" />
      </Link>
    </div>
  );
}
