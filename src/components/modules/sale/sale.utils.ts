import type { SalePeriod } from "@/types/sale";

const pad = (value: number) => String(value).padStart(2, "0");

export const formatDateForApi = (date: Date) => {
  return `${date.getFullYear()}-${pad(
    date.getMonth() + 1,
  )}-${pad(date.getDate())}`;
};

export const getDateRangeFromPeriod = (period: SalePeriod, year?: number) => {
  const now = new Date();

  if (period === "today") {
    const date = formatDateForApi(now);

    return {
      from: date,
      to: date,
    };
  }

  if (period === "week") {
    const fromDate = new Date(now);

    fromDate.setDate(fromDate.getDate() - 6);

    return {
      from: formatDateForApi(fromDate),
      to: formatDateForApi(now),
    };
  }

  if (period === "month") {
    const fromDate = new Date(now.getFullYear(), now.getMonth(), 1);

    return {
      from: formatDateForApi(fromDate),
      to: formatDateForApi(now),
    };
  }

  if (period === "year") {
    const selectedYear = year ?? now.getFullYear();

    return {
      from: `${selectedYear}-01-01`,
      to: `${selectedYear}-12-31`,
    };
  }

  return {
    from: undefined,
    to: undefined,
  };
};

export const formatCurrency = (amount: number) => {
  return `BDT ${amount.toLocaleString("en-BD")}`;
};

export const formatSaleDate = (date: string) => {
  return new Date(date).toLocaleString("en-BD", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
