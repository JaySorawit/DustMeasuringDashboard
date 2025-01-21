import React, { useState } from "react";
import { Chart } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  ChartConfiguration,
} from "chart.js";
import { BoxPlotController, BoxAndWiskers } from "@sgratzl/chartjs-chart-boxplot";
import annotationPlugin from "chartjs-plugin-annotation";
import { Button } from "@mui/material";

ChartJS.register(CategoryScale, LinearScale, BoxPlotController, BoxAndWiskers, Title, Tooltip, Legend, annotationPlugin);

interface BoxPlotProps {
  fetchData: any[];
  room: string[];
  dustType: number;
}

const BoxPlot: React.FC<BoxPlotProps> = ({ fetchData, room, dustType }) => {
  const [showUSL, setShowUSL] = useState(false);
  const [showUCL, setShowUCL] = useState(false);

  const dustTypeKey = `um${(dustType * 10).toFixed(0).padStart(2, "0")}`;

  const filteredData = fetchData
    .filter(
      (data) =>
        room.map((r) => r.toLowerCase().trim()).includes(data.room.toLowerCase().trim()) &&
        data[dustTypeKey] !== undefined
    )
    .map((data) => ({
      location: data.location_name,
      value: data[dustTypeKey],
    }));

  const groupedData = filteredData.reduce((acc: { [key: string]: number[] }, curr) => {
    if (!acc[curr.location]) acc[curr.location] = [];
    acc[curr.location].push(curr.value);
    return acc;
  }, {});

  const chartData: ChartConfiguration<"boxplot">["data"] = {
    labels: Object.keys(groupedData),
    datasets: [
      {
        label: `Dust Type ${dustType} (${room.join(", ")})`,
        data: Object.values(groupedData),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // USL and UCL values for rooms (can be fetched dynamically)
  const USL_VALUES = {
    "Clean booth": 500,
    "Clean room": 800,
    "Clean zone": 900,
  };

  const UCL_VALUES = {
    "Clean booth": 300,
    "Clean room": 600,
    "Clean zone": 700,
  };

  const annotations: any = [];

  if (showUSL) {
    room.forEach((r) => {
      annotations.push({
        type: "line",
        mode: "horizontal",
        scaleID: "y",
        value: USL_VALUES[r as keyof typeof USL_VALUES],
        borderColor: "red",
        borderWidth: 2,
        label: {
          content: `USL (${r})`,
          enabled: true,
          position: "start",
          backgroundColor: "red",
        },
      });
    });
  }

  if (showUCL) {
    room.forEach((r) => {
      annotations.push({
        type: "line",
        mode: "horizontal",
        scaleID: "y",
        value: UCL_VALUES[r as keyof typeof UCL_VALUES],
        borderColor: "blue",
        borderWidth: 2,
        label: {
          content: `UCL (${r})`,
          enabled: true,
          position: "start",
          backgroundColor: "blue",
        },
      });
    });
  }

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        <Button onClick={() => setShowUSL(!showUSL)}>
          {showUSL ? "Hide USL" : "Show USL"}
        </Button>
        <Button onClick={() => setShowUCL(!showUCL)} style={{ marginLeft: "10px" }}>
          {showUCL ? "Hide UCL" : "Show UCL"}
        </Button>
      </div>

      <div style={{ width: "100%", height: "400px" }}>
        <Chart
          type="boxplot"
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: `Box Plot for Dust Type ${dustType} in ${room.join(", ")}` },
              annotation: { annotations },
            },
            scales: {
              x: { title: { display: true, text: "Locations" } },
              y: { title: { display: true, text: "Dust Value" }, beginAtZero: true },
            },
          }}
        />
      </div>
    </div>
  );
};

export default BoxPlot;
