export const formatAUD = (value: number) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    currencyDisplay: "narrowSymbol",
  }).format(value);

export const formatAUDLabel = (value: number) => `${formatAUD(value)} AUD`;

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("en-AU", { dateStyle: "medium" }).format(new Date(iso));

export const percentOff = (price: number, salePrice: number) =>
  Math.round(((price - salePrice) / price) * 100);