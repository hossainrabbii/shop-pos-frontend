"use client";

import { useEffect, useState } from "react";

import type { ISaleStatistics, IStatisticsQuery } from "@/types/saleStatistics";

import { getSaleStatistics } from "@/services/statistics";

import StatisticsCards from "./StatisticsCards";
import StatisticsFilters from "./StatisticsFilters";

const SaleStatistics = () => {
  const [query, setQuery] = useState<IStatisticsQuery>({
    period: "month",
  });

  const [statistics, setStatistics] = useState<ISaleStatistics | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchStatistics = async (currentQuery: IStatisticsQuery = query) => {
    try {
      setLoading(true);
      setError("");

      const response = await getSaleStatistics(currentQuery);

      setStatistics(response.data);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Failed to fetch sales statistics";

      setError(message);
      setStatistics(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatistics({
      period: "month",
    });
  }, []);

  const handleApply = () => {
    if (query.period === "custom") {
      if (!query.from || !query.to) {
        setError("Please select both From and To dates.");
        return;
      }

      if (query.from > query.to) {
        setError("From date cannot be greater than To date.");
        return;
      }
    }

    if (query.period === "year" && !query.year) {
      setError("Please select a year.");
      return;
    }

    fetchStatistics(query);
  };

  const handleQueryChange = (newQuery: IStatisticsQuery) => {
    setQuery(newQuery);

    if (error) {
      setError("");
    }
  };

  return (
    <div className="space-y-6">
      <StatisticsFilters
        query={query}
        onChange={handleQueryChange}
        onApply={handleApply}
        loading={loading}
      />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {loading && !statistics ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="h-28 animate-pulse rounded-xl bg-gray-100"
            />
          ))}
        </div>
      ) : statistics ? (
        <StatisticsCards statistics={statistics} />
      ) : (
        <div className="rounded-xl border bg-white p-10 text-center text-gray-500">
          No statistics available.
        </div>
      )}
    </div>
  );
};

export default SaleStatistics;
