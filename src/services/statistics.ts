import type {
  IStatisticsQuery,
  IStatisticsResponse,
} from "@/types/saleStatistics";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const getSaleStatistics = async (
  query: IStatisticsQuery,
): Promise<IStatisticsResponse> => {
  const accessToken = localStorage.getItem("accessToken");

  if (!accessToken) {
    throw new Error("Authentication required. Please login again.");
  }

  const params = new URLSearchParams();

  params.set("period", query.period);

  if (query.year !== undefined) {
    params.set("year", String(query.year));
  }

  if (query.from) {
    params.set("from", query.from);
  }

  if (query.to) {
    params.set("to", query.to);
  }

  const url = `${API_URL}/sales/statistics?${params.toString()}`;

  console.log("Statistics API:", url);
  console.log("Access token exists:", Boolean(accessToken));

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result?.message || "Failed to fetch sales statistics");
  }

  return result;
};
