import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function formatPriceParts(price: number) {
  const formatter = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
  
  const parts = formatter.formatToParts(price);
  const currencySymbol = parts.find(p => p.type === "currency")?.value || "₹";
  const amount = parts.filter(p => p.type !== "currency").map(p => p.value).join("").trim();
  
  return { currencySymbol, amount };
}
