// How numbers, money and dates read on screen, in the language and currency
// from site.config.ts. Dates are shown in UTC, like the data.

import { siteConfig } from "@/site.config";

const money = new Intl.NumberFormat(siteConfig.lang, {
  style: "currency",
  currency: siteConfig.currency,
});

const wholeMoney = new Intl.NumberFormat(siteConfig.lang, {
  style: "currency",
  currency: siteConfig.currency,
  maximumFractionDigits: 0,
});

const number = new Intl.NumberFormat(siteConfig.lang);

const date = new Intl.DateTimeFormat(siteConfig.lang, {
  day: "numeric",
  month: "short",
  timeZone: "UTC",
});

const fullDate = new Intl.DateTimeFormat(siteConfig.lang, {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

const dateTime = new Intl.DateTimeFormat(siteConfig.lang, {
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
  timeZone: "UTC",
});

// Cents to "€4,200.00", or "€4,200" with whole: true
export function formatMoney(cents: number, { whole = false } = {}) {
  return (whole ? wholeMoney : money).format(cents / 100);
}

export function formatNumber(value: number) {
  return number.format(value);
}

// "12 Oct", or "12 Oct 2026" with year: true
export function formatDate(iso: string, { year = false } = {}) {
  return (year ? fullDate : date).format(new Date(iso));
}

export function formatDateTime(iso: string) {
  return dateTime.format(new Date(iso));
}

// The change from one number to another, as "+12%" or "−3%"
export function formatChange(current: number, previous: number) {
  if (previous === 0) return current === 0 ? "0%" : "new";
  const percent = Math.round(((current - previous) / previous) * 100);
  return `${percent > 0 ? "+" : percent < 0 ? "−" : ""}${Math.abs(percent)}%`;
}
