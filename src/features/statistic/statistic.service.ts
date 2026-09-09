import { api } from "@/lib/api";
import { IStatisticsQuery, IStatisticsResponse } from "./statistic.type";

export const fetchSaleStatistics = async (
  query: IStatisticsQuery,
): Promise<IStatisticsResponse> => {
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

  const endpoint = `/sales/statistics?${params.toString()}`;
  const response = await api.get(endpoint);
  return response.data;
};
