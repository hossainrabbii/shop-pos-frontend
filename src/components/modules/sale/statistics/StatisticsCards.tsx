import type { ISaleStatistics } from "@/types/saleStatistics";

interface StatisticsCardsProps {
  statistics?: ISaleStatistics | null;
}

const StatisticsCards = ({ statistics }: StatisticsCardsProps) => {
  const totalSales = statistics?.totalSales ?? 0;
  const totalPaid = statistics?.totalPaid ?? 0;
  const totalDue = statistics?.totalDue ?? 0;
  const totalProfit = statistics?.totalProfit ?? 0;
  const totalTransactions = statistics?.totalTransactions ?? 0;

  const cards = [
    {
      title: "Total Sales",
      value: totalSales,
      currency: true,
    },
    {
      title: "Total Paid",
      value: totalPaid,
      currency: true,
    },
    {
      title: "Total Due",
      value: totalDue,
      currency: true,
    },
    {
      title: "Gross Profit",
      value: totalProfit,
      currency: true,
    },
    {
      title: "Transactions",
      value: totalTransactions,
      currency: false,
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-xl border bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-medium text-gray-500">{card.title}</p>

          <h3 className="mt-2 text-2xl font-bold text-gray-900">
            {card.currency && "৳"}
            {card.value.toLocaleString("en-BD")}
          </h3>
        </div>
      ))}
    </div>
  );
};

export default StatisticsCards;
