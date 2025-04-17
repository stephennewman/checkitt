"use client";

import { useAtomValue } from "jotai";
import { Activity } from "lucide-react";
import { ticketChartDataAtom } from "@/lib/atoms";
import type { TicketMetric } from "@/types/types";
import ChartTitle from "../../components/chart-title";
import Chart from "./chart";
import { DatePickerWithRange } from "./components/date-range-picker";
import MetricCard from "./components/metric-card";

const calMetricCardValue = (
  data: TicketMetric[],
  type: "created" | "resolved",
) => {
  const filteredData = data.filter((item) => item.type === type);
  if (filteredData.length === 0) return 0;
  return Math.round(
    filteredData.reduce((acc, curr) => acc + curr.count, 0) /
      filteredData.length,
  );
};

export default function AssetStatusSummary() {
  const assetData = useAtomValue(ticketChartDataAtom);
  const avgInRange = calMetricCardValue(assetData, "created");
  const avgOutOfRange = calMetricCardValue(assetData, "resolved");

  return (
    <section className="flex h-full flex-col gap-2">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <ChartTitle title="Asset Status Summary" icon={Activity} />
        <DatePickerWithRange className="" />
      </div>
      <div className="flex flex-wrap">
        <div className="my-4 flex w-52 shrink-0 flex-col justify-center gap-6">
          <MetricCard
            title="Avg. Assets In Range"
            value={avgInRange}
            color="#22c55e"
          />
          <MetricCard
            title="Avg. Assets Out of Range"
            value={avgOutOfRange}
            color="#ef4444"
          />
        </div>
        <div className="relative h-96 min-w-[320px] flex-1">
          <Chart />
        </div>
      </div>
    </section>
  );
}
