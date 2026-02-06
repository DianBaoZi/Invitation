import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string from YYYY-MM-DD to DD-MMM-YYYY
 * e.g., "2026-02-14" → "14-Feb-2026"
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return "";

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const parts = dateStr.split("-");

  if (parts.length !== 3) return dateStr;

  const year = parts[0];
  const monthIndex = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  if (isNaN(monthIndex) || monthIndex < 0 || monthIndex > 11) return dateStr;

  return `${day}-${months[monthIndex]}-${year}`;
}

/**
 * Format a time string from HH:MM (24h) to 12-hour with AM/PM
 * e.g., "19:30" → "7:30 PM"
 */
export function formatTime(timeStr: string): string {
  if (!timeStr) return "";

  const parts = timeStr.split(":");
  if (parts.length < 2) return timeStr;

  let hours = parseInt(parts[0], 10);
  const minutes = parts[1];

  if (isNaN(hours)) return timeStr;

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  if (hours === 0) hours = 12;

  return `${hours}:${minutes} ${ampm}`;
}
