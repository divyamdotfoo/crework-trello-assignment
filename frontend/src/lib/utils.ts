import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const capitalize = (z: string | undefined | null) => {
  if (!z || !z.length) return "";
  return z[0].toUpperCase() + z.slice(1);
};

export const getDate = (z: number) => {
  const d = new Date(z);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getTimeSince = (timestamp: number): string => {
  const now = Date.now();
  const difference = now - timestamp;

  const hours = Math.floor(difference / (1000 * 60 * 60)); // Convert milliseconds to hours
  const days = Math.floor(hours / 24); // Convert hours to days
  const weeks = Math.floor(days / 7); // Convert days to weeks

  if (hours < 24) {
    return `${hours} hours ago`;
  } else if (days < 7) {
    return `${days} days ago`;
  } else {
    return `${weeks} weeks ago`;
  }
};
