import {
  AssetStatusSummary,
  Conversions,
  CustomerSatisfication,
  Metrics,
  AssetsByType,
} from "@/components/chart-blocks";
import Container from "@/components/container";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Thermometer, ListChecks, CheckCircle, AlertTriangle } from 'lucide-react';

export default function Home() {
  return (
    <div className="p-4 md:p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Operational KPIs</CardTitle>
          <CardDescription>High-level status of assets and tasks.</CardDescription>
        </CardHeader>
        <CardContent>
          <Metrics />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Thermometer className="h-5 w-5 mr-2" /> Asset Status Trend
            </CardTitle>
            <CardDescription>Visualizing asset health over time (using existing chart).</CardDescription>
          </CardHeader>
          <CardContent>
            <AssetStatusSummary />
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <CheckCircle className="h-5 w-5 mr-2" /> Task Completion Rate
            </CardTitle>
            <CardDescription>Completion percentage (using existing chart).</CardDescription>
          </CardHeader>
          <CardContent>
            <Conversions />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <ListChecks className="h-5 w-5 mr-2" /> Assets by Type
            </CardTitle>
            <CardDescription>Distribution of Fridge vs Freezer assets (using existing chart).</CardDescription>
          </CardHeader>
          <CardContent>
            <AssetsByType />
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" /> Task Quality Score
            </CardTitle>
            <CardDescription>Overall score based on completion quality (using existing chart).</CardDescription>
          </CardHeader>
          <CardContent>
            <CustomerSatisfication />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
