import * as React from "react";

import { cn } from "@/lib/utils";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={cn(
        "text-sm font-medium text-white/75 light:text-slate-700",
        className,
      )}
      {...props}
    />
  );
}

export { Label };
