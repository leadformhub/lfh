import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ContainerSize = "narrow" | "default" | "wide";

const sizeClasses: Record<ContainerSize, string> = {
  narrow: "max-w-[720px]",
  default: "max-w-[1120px]",
  wide: "max-w-[1280px]",
};

export function Container({
  children,
  className,
  size = "default",
  ...props
}: HTMLAttributes<HTMLDivElement> & { size?: ContainerSize }) {
  return (
    <div
      className={cn("mx-auto w-full px-4 sm:px-6 lg:px-8", sizeClasses[size], className)}
      {...props}
    >
      {children}
    </div>
  );
}
