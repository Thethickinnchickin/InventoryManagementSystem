'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Bar, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  PointElement,
  ArcElement,
} from 'chart.js';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { TooltipItem } from 'chart.js';
import { Box, TextField, Button } from '@mui/material';

// Register necessary Chart.js components
ChartJS.register(
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
  PointElement,
  ArcElement
);

// Extend dayjs with advanced formatting
dayjs.extend(advancedFormat);

const ReportsPage = () => {
  const [orderData, setOrderData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [startDate, setStartDate] = useState(new Date('2019-01-01'));
  const [endDate, setEndDate] = useState(new Date());

  // Fetch data based on date range and handle errors
  const fetchFilteredData = async () => {
    setLoading(true);
    setError(null);
    try {
      const cookieString = document.cookie;
      const token = cookieString
        .split('; ')
        .find(row => row.startsWith('authToken'))
        ?.split('=')[1];

      const response = await axios.get(`${process.env.API_URL || 'http://localhost:3000'}/reports/order-history/report`, {
        headers: { Authorization: `Bearer ${token}` },
        params: {
          startDate: dayjs(startDate).format('YYYY-MM-DD'),
          endDate: dayjs(endDate).format('YYYY-MM-DD'),
        },
      });

      setOrderData(response.data);
    } catch (error) {
      setError('Error fetching data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilteredData();
  }, []); // Fetch data on initial page load

  if (loading) return <p>Loading data...</p>;
  if (error) return <p>{error}</p>;

  // Aggregate sales data by month
  const aggregateByMonth = (data: any[]) => {
    const aggregated = data.reduce((acc, order) => {
      const month = dayjs(order.createdAt).format('YYYY-MM');
      if (!acc[month]) acc[month] = 0;
      acc[month] += parseFloat(order.totalAmount);
      return acc;
    }, {} as Record<string, number>);

    const labels = Object.keys(aggregated).sort();
    const totalSales = labels.map((label) => aggregated[label]);

    return { labels, totalSales };
  };

  const { labels, totalSales } = aggregateByMonth(orderData);

  // Data for the Total Sales Over Time chart
  const totalSalesChartData = {
    labels,
    datasets: [
      {
        label: 'Total Sales Over Time',
        data: totalSales,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        pointRadius: 3,
      },
    ],
  };

  // Aggregate sales data by customer
  const customerSales = orderData.reduce((acc, order) => {
    acc[order.customerName] = (acc[order.customerName] || 0) + parseFloat(order.totalAmount);
    return acc;
  }, {} as Record<string, number>);

  // Aggregate order count by customer
  const orderCountByCustomer = orderData.reduce((acc, order) => {
    acc[order.customerName] = (acc[order.customerName] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Data for the Sales by Customer chart
  const salesByCustomerChartData = {
    labels: Object.keys(customerSales),
    datasets: [
      {
        label: 'Sales by Customer',
        data: Object.values(customerSales),
        backgroundColor: 'rgba(153, 102, 255, 0.7)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 2,
      },
    ],
  };

  // Data for the Order Count by Customer chart
  const orderCountChartData = {
    labels: Object.keys(orderCountByCustomer),
    datasets: [
      {
        label: 'Order Count by Customer',
        data: Object.values(orderCountByCustomer),
        backgroundColor: [
          'rgba(255, 99, 132, 0.7)',
          'rgba(54, 162, 235, 0.7)',
          'rgba(255, 206, 86, 0.7)',
          'rgba(75, 192, 192, 0.7)',
          'rgba(153, 102, 255, 0.7)',
        ],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="page-container">
      <h1>Order Reports</h1>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <Box>
          <DatePicker
            selected={startDate}
            onChange={(date) => setStartDate(date!)}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            dateFormat="yyyy-MM-dd"
            customInput={<TextField label="Start Date" variant="outlined" fullWidth />}
          />
        </Box>
        <Box>
          <DatePicker
            selected={endDate}
            onChange={(date) => setEndDate(date!)}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            dateFormat="yyyy-MM-dd"
            customInput={<TextField label="End Date" variant="outlined" fullWidth />}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
          <Button variant="contained" color="primary" onClick={fetchFilteredData}>
            Apply Filters
          </Button>
        </Box>
      </Box>
      <div className="chart-container">
        <div>
          <h2 className="chart-title">Total Sales Over Time</h2>
          <Line
            data={totalSalesChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'bottom' },
                title: {
                  display: true,
                  text: 'Total Sales Over Time',
                  color: 'rgba(75, 192, 192, 1)',
                },
                tooltip: {
                  callbacks: {
                    label: (context: TooltipItem<'line'>) => `$${context.raw}`,
                  },
                },
              },
              scales: {
                x: {
                  ticks: {
                    autoSkip: true,
                    maxRotation: 90,
                  },
                },
                y: {
                  beginAtZero: true,
                  ticks: {
                    callback: (value) => `$${value}`,
                  },
                },
              },
            }}
          />
        </div>

        <div>
          <h2 className="chart-title">Sales by Customer</h2>
          <Bar
            data={salesByCustomerChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'bottom' },
                title: {
                  display: true,
                  text: 'Sales by Customer',
                  color: 'rgba(153, 102, 255, 1)',
                },
                tooltip: {
                  callbacks: {
                    label: (context: TooltipItem<'bar'>) => `$${context.raw}`,
                  },
                },
              },
            }}
          />
        </div>

        <div>
          <h2 className="chart-title">Order Count by Customer</h2>
          <Pie
            data={orderCountChartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'bottom' },
                title: {
                  display: true,
                  text: 'Order Count by Customer',
                  color: 'rgba(255, 99, 132, 1)',
                },
                tooltip: {
                  callbacks: {
                    label: (context: TooltipItem<'pie'>) => `${context.label}: ${context.raw}`,
                  },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
