"use client";

import { IStatisticsQuery, StatisticsPeriod } from "../statistic.type";

interface StatisticsFiltersProps {
  query: IStatisticsQuery;
  onChange: (query: IStatisticsQuery) => void;
  onApply: () => void;
  loading?: boolean;
}

const StatisticsFilters = ({
  query,
  onChange,
  onApply,
  loading = false,
}: StatisticsFiltersProps) => {
  const currentYear = new Date().getFullYear();

  const years = Array.from(
    { length: currentYear - 2019 },
    (_, index) => currentYear - index,
  );

  const handlePeriodChange = (period: StatisticsPeriod) => {
    if (period === "year") {
      onChange({
        period: "year",
        year: query.year ?? currentYear,
      });

      return;
    }

    if (period === "custom") {
      onChange({
        period: "custom",
        from: query.from ?? "",
        to: query.to ?? "",
      });

      return;
    }

    onChange({
      period,
    });
  };

  return (
    <div className="rounded-xl border bg-white p-5 shadow-sm">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Period */}
        <div>
          <label
            htmlFor="period"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Period
          </label>

          <select
            id="period"
            value={query.period}
            onChange={(event) =>
              handlePeriodChange(event.target.value as StatisticsPeriod)
            }
            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none  text-gray-700 focus:border-gray-500"
          >
            <option value="today">Today</option>
            <option value="week">Last 7 Days</option>
            <option value="month">This Month</option>
            <option value="year">Year</option>
            <option value="custom">Custom Range</option>
          </select>
        </div>

        {/* Year */}
        {query.period === "year" && (
          <div>
            <label
              htmlFor="year"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Year
            </label>

            <select
              id="year"
              value={query.year ?? currentYear}
              onChange={(event) =>
                onChange({
                  ...query,
                  year: Number(event.target.value),
                })
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none text-gray-700 focus:border-gray-500"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Custom From */}
        {query.period === "custom" && (
          <div>
            <label
              htmlFor="from"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              From
            </label>

            <input
              id="from"
              type="date"
              value={query.from ?? ""}
              onChange={(event) =>
                onChange({
                  ...query,
                  from: event.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-500"
            />
          </div>
        )}

        {/* Custom To */}
        {query.period === "custom" && (
          <div>
            <label
              htmlFor="to"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              To
            </label>

            <input
              id="to"
              type="date"
              value={query.to ?? ""}
              onChange={(event) =>
                onChange({
                  ...query,
                  to: event.target.value,
                })
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-gray-500"
            />
          </div>
        )}

        {/* Apply */}
        <div className="flex items-end">
          <button
            type="button"
            onClick={onApply}
            disabled={loading}
            className="w-full rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            ) : (
              "Apply Filter"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatisticsFilters;
