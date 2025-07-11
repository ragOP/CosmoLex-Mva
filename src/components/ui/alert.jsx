import * as React from "react";
import { cn } from "@/lib/utils";

function Alert({ className, children, color = "info", ...props }) {
  // color: "warning" | "error" | "info" | "success"
  const colorMap = {
    warning: "bg-[#F59E0B] text-white",
    error: "bg-[#EF4444] text-white",
    info: "bg-blue-100 text-blue-900",
    success: "bg-green-100 text-green-900",
  };
  return (
    <div
      className={cn(
        "w-full px-4 py-2 text-center text-sm font-medium shadow flex items-center justify-center gap-2",
        colorMap[color],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { Alert };
