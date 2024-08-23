'use client'; // Add this directive at the top of the file

import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import axios from 'axios';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const OrderHistoryChart = () => {
  const [chartData, setChartData] = useState({
    labels: [] as string[],
    datasets: [
      {
        label: 'Stock Levels',
        data: [] as number[],
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching Data");
        const response = await axios.get('http://localhost:3000/reports/stock-levels');

        console.log(response);

        // Extract data and format it for the chart
        const productNames = response.data.map((entry: { name: string }) => entry.name);
        const stockLevels = response.data.map((entry: { stock: number }) => entry.stock);

        // Remove duplicate product names and aggregate stock levels
        const aggregatedData = productNames.reduce((acc: any, name: string, index: number) => {
          if (!acc[name]) {
            acc[name] = 0;
          }
          acc[name] += stockLevels[index];
          return acc;
        }, {});

        setChartData({
          labels: Object.keys(aggregatedData),
          datasets: [
            {
              label: 'Stock Levels',
              data: Object.values(aggregatedData),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return <Bar data={chartData} />;
};

export default OrderHistoryChart;
