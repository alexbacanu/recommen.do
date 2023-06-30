import type { DetailedHTMLProps, HTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/helpers/utils";

interface ShellProps extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  children: ReactNode;
  layout?: "default" | "auth" | "confirmation" | "dashboard";
}

export function Shell({ children, layout = "default", className, ...props }: ShellProps) {
  return (
    <section
      className={cn(
        "lg:content-area container grid items-center gap-8 py-6 sm:py-8",
        layout === "default" && "",
        layout === "auth" && "max-w-lg",
        layout === "confirmation" && "max-w-3xl grid-cols-1 sm:grid-cols-2",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}
