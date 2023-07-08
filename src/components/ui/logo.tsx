import Link from "next/link";

import { Icons } from "@/components/ui/icons";

export default function Logo() {
  return (
    <Link href="/" aria-label="Navigate to homepage">
      <Icons.logo className="h-12 w-12" />
    </Link>
  );
}
