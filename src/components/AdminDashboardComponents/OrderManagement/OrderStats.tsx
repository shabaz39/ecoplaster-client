// File: ecoplaster-client/src/components/AdminDashboardComponents/OrderManagement/OrderStats.tsx
import React from 'react';
import { useQuery, gql } from '@apollo/client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import LoadingSpinner from '../Common/LoadingSpinner';

const GET_ORDER_STATS = gql`
  query GetOrderStats {
    getOrderStats {
      totalOrders
      totalRevenue
      ordersByStatus
      recentOrders {
        date
        count
        revenue
      }
    }
  }
`;

interface OrderDateStat {
  date: string;
  count: number;
  revenue: number;
}

interface OrderStats {
  totalOrders: number;
  totalRevenue: number;
  ordersByStatus: Record<string, number>;
  recentOrders: OrderDateStat[];
}

const OrderStats: React.FC = () => {
  const { data, loading, error } = useQuery(GET_ORDER_STATS);

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error loading order statistics: {error.message}</div>;

  const stats: OrderStats = data?.getOrderStats || {
    totalOrders: 0,
    totalRevenue: 0,
    ordersByStatus: {},
    recentOrders: []
  };

  // Prepare data for chart
  const chartData = stats.recentOrders.map((order) => ({
    date: order.date,
    Orders: order.count,
    Revenue: order.revenue / 1000 // Convert to thousands for better visualization
  }));

  // Calculate percentage of orders by status
  const totalOrdersByStatus = Object.values(stats.ordersByStatus).reduce(
    (acc, val) => acc + val, 0
  );

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
          <p className="text-2xl font-bold text-greenComponent">{stats.totalOrders}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
          <p className="text-2xl font-bold text-greenComponent">₹{stats.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Pending Orders</h3>
          <p className="text-2xl font-bold text-greenComponent">{stats.ordersByStatus?.Pending || 0}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-500">Processing Orders</h3>
          <p className="text-2xl font-bold text-greenComponent">{stats.ordersByStatus?.Processing || 0}</p>
        </div>
      </div>

      {/* Order Status Distribution */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-productNameColor mb-4">Order Status Distribution</h3>
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {Object.entries(stats.ordersByStatus).map(([status, count]) => {
            const percentage = totalOrdersByStatus > 0 
              ? (count / totalOrdersByStatus) * 100 
              : 0;
            
            return (
              <div key={status} className="flex flex-col items-center">
                <div className="relative w-24 h-24 mb-2">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#E6E6E6"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke={getBadgeColor(status)}
                      strokeWidth="3"
                      strokeDasharray={`${percentage}, 100`}
                      strokeLinecap="round"
                    />
                    <text 
                      x="18" 
                      y="20.35" 
                      className="text-xs" 
                      textAnchor="middle" 
                      fill={getBadgeColor(status)}
                    >
                      {percentage.toFixed(0)}%
                    </text>
                  </svg>
                </div>
                <span className="text-sm font-medium">{status}</span>
                <span className="text-sm text-gray-500">{count} orders</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recent Orders Chart */}
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <h3 className="text-lg font-medium text-productNameColor mb-4">Recent Orders Trend</h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 30, left: 20, bottom: 30 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="Orders"
                stroke="#8884d8"
                activeDot={{ r: 8 }}
              />
              <Line 
                yAxisId="right" 
                type="monotone" 
                dataKey="Revenue" 
                stroke="#82ca9d" 
                name="Revenue (₹ thousands)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// Helper function to get color for status
const getBadgeColor = (status: string) => {
  switch (status) {
    case 'Pending':
      return '#f59e0b'; // Amber-500
    case 'Processing':
      return '#3b82f6'; // Blue-500
    case 'Shipped':
      return '#8b5cf6'; // Purple-500
    case 'Delivered':
      return '#10b981'; // Emerald-500
    case 'Cancelled':
      return '#ef4444'; // Red-500
    case 'Returned':
      return '#6b7280'; // Gray-500
    default:
      return '#6b7280'; // Gray-500
  }
};

export default OrderStats;