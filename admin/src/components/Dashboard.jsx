import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCallback, useEffect, useState } from "react";
import Cookies from "universal-cookie";
const cookies = new Cookies();

const chartConfig = {
  money: {
    label: "Money",
    color: "var(--chart-1)",
  },
  orders: {
    label: "Orders",
    color: "var(--chart-2)",
  },
};

const timeRangeString = {
  "90d": "3 months",
  "30d": "30 days",
  "7d": "7 days",
};

function DashboardChart() {
  const [timeRange, setTimeRange] = useState(
    localStorage.getItem("timeRange") || "90d",
  );
  const [chartData, setChartData] = useState([]);

  const getChartData = useCallback(async () => {
    const adminToken = cookies.get("adminToken");
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin/`,
        {
          headers: {
            Authorization: `Bearer ${adminToken.token}`,
          },
        },
      );
      const data = await response.json();

      if (data.success) {
        setChartData(data.data);
      } else {
        setChartData([]);
      }
    } catch (error) {
      console.error("Error Getting Chart Data:", error);
      setChartData([]);
    }
  }, []);

  useEffect(() => {
    getChartData();
  }, [getChartData]);

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const today = new Date();

    let daysToSubtract = 90;
    if (timeRange === "30d") daysToSubtract = 30;
    else if (timeRange === "7d") daysToSubtract = 7;

    const startDate = new Date();
    startDate.setDate(today.getDate() - daysToSubtract);

    return date >= startDate;
  });

  return (
    <Card className="pt-0">
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1">
          <CardTitle>DASHBOARD</CardTitle>
          <CardDescription>
            Showing the number of orders delivered in the last{" "}
            <span className="font-bold">{timeRangeString[timeRange]}</span>
          </CardDescription>
        </div>
        <Select
          value={timeRange}
          onValueChange={(range) => {
            setTimeRange(range);
            localStorage.setItem("timeRange", range);
          }}
        >
          <SelectTrigger
            className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
            aria-label="Select a value"
          >
            <SelectValue placeholder="Last 3 months" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="90d" className="rounded-lg">
              Last 3 months
            </SelectItem>
            <SelectItem value="30d" className="rounded-lg">
              Last 30 days
            </SelectItem>
            <SelectItem value="7d" className="rounded-lg">
              Last 7 days
            </SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        {filteredData.length ? (
          <ChartContainer
            config={chartConfig}
            className="aspect-auto h-[350px] w-full"
          >
            <AreaChart data={filteredData}>
              <defs>
                <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-money)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-money)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-orders)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-orders)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="date"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={32}
                tickFormatter={(value) => {
                  const date = new Date(value);
                  return date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <ChartTooltip
                cursor={false}
                content={
                  <ChartTooltipContent
                    labelFormatter={(value) => {
                      return new Date(value).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      });
                    }}
                    indicator="dot"
                  />
                }
              />
              <Area
                dataKey="orders"
                type="natural"
                fill="url(#fillMobile)"
                stroke="var(--color-orders)"
                stackId="a"
              />
              <Area
                dataKey="money"
                type="natural"
                fill="url(#fillDesktop)"
                stroke="var(--color-money)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        ) : (
          <div className="text-1xl text-center">
            No data to show. Deliver orders to see data here.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default DashboardChart;
