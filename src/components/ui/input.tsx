import type { VariantProps } from "class-variance-authority";

import { cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "~/lib/helpers/cn";

const inputVariants = cva(
  "flex h-10 w-full rounded-md bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "border border-input",
        valid: "border border-green-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>, VariantProps<typeof inputVariants> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, variant, type, ...props }, ref) => {
  return <input type={type} className={cn(inputVariants({ variant, className }))} ref={ref} {...props} />;
});
Input.displayName = "Input";

export { Input };
