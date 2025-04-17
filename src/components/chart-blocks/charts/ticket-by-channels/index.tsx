import { Box } from "lucide-react";
import ChartTitle from "../../components/chart-title";
import Chart from "./chart";

export default function AssetsByType() {
  return (
    <section className="flex h-full flex-col gap-2">
      <ChartTitle title="Assets by Type" icon={Box} />
      <div className="relative flex min-h-64 flex-grow flex-col justify-center">
        <Chart />
      </div>
    </section>
  );
}
