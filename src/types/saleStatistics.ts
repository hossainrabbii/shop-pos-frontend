export type StatisticsPeriod = "today" | "week" | "month" | "year" | "custom";

export interface ISaleStatistics {
  totalSales: number;
  totalPaid: number;
  totalDue: number;
  totalProfit: number;
  totalTransactions: number;
}

export interface IStatisticsQuery {
  period: StatisticsPeriod;
  year?: number;
  from?: string;
  to?: string;
}

export interface IStatisticsResponse {
  success: boolean;
  message: string;
  data: ISaleStatistics;
}
