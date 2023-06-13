import Image from "next/image";
import Link from "next/link";

export default function Logo() {
  return (
    <div>
      <Link href="/">
        <Image src="/relogo.svg" width={48} height={27} alt="Logo for recommen.do" />
      </Link>
    </div>
  );
}
