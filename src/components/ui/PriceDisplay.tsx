"use client";

import { formatPriceParts } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface PriceDisplayProps {
  price: number;
  className?: string;
  symbolClassName?: string;
  amountClassName?: string;
}

export default function PriceDisplay({ 
  price, 
  className, 
  symbolClassName, 
  amountClassName 
}: PriceDisplayProps) {
  const { currencySymbol, amount } = formatPriceParts(price);

  return (
    <div className={cn("flex items-baseline font-sans", className)}>
      <span className={cn("text-xs font-black mr-0.5 opacity-60", symbolClassName)}>
        {currencySymbol}
      </span>
      <span className={cn("font-bold tracking-tight", amountClassName)}>
        {amount}
      </span>
    </div>
  );
}
