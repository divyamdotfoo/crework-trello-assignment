import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        spellCheck={false}
        className={cn(
          "flex h-10 w-full rounded-md bg-whiteAccent px-3 py-2 text-sm ring-offset-background file:border-0 placeholder:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-border disabled:cursor-not-allowed disabled:opacity-50 text-blackMuted font-medium ",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export { Input };
