// components/AdminDashboard/Dashboard/StatsCards.tsx
import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_USERS } from '@/constants/queries/allGETrequests';
import { GET_ALL_DEALERS, GET_ALL_CONTACTS } from '@/constants/queries/allGETrequests';
import { GET_ALL_BLOGS } from '@/constants/queries/blogQueries';
import { GET_ORDER_STATS } from '@/constants/queries/orderQuerues'; // Add this import

interface StatCardProps {
  title: string;
  count: number;
  loading: boolean;
  onClick: () => void;
  bgColor: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, count, loading, onClick, bgColor }) => (
  <button 
    onClick={onClick}
    className={`${bgColor} p-6 rounded-lg shadow-sm transition-all duration-300 hover:shadow-md hover:bg-newbeige transform hover:-translate-y-1 cursor-pointer text-left`}
  >
    <h3 className="text-xl font-semibold text-productNameColor">{title}</h3>
    <p className="text-3xl font-bold text-newgreensecond mt-2">
      {loading ? '...' : count}
    </p>
  </button>
);

interface StatsCardsProps {
  setActiveTab: (tab: string) => void;
}

const StatsCards: React.FC<StatsCardsProps> = ({ setActiveTab }) => {
  const { data: usersData, loading: usersLoading } = useQuery(GET_ALL_USERS);
  const { data: dealersData, loading: dealersLoading } = useQuery(GET_ALL_DEALERS);
  const { data: contactsData, loading: contactsLoading } = useQuery(GET_ALL_CONTACTS);
  const { data: blogsData, loading: blogsLoading } = useQuery(GET_ALL_BLOGS);
  const { data: orderStatsData, loading: orderStatsLoading } = useQuery(GET_ORDER_STATS); // Add this query

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <StatCard 
        title="Total Users"
        count={usersData?.getAllUsers?.length || 0}
        loading={usersLoading}
        onClick={() => setActiveTab('users')}
        bgColor="bg-cream"
      />
      <StatCard 
        title="Active Dealers"
        count={dealersData?.getDealers?.length || 0}
        loading={dealersLoading}
        onClick={() => setActiveTab('dealers')}
        bgColor="bg-beige"
      />
      <StatCard 
        title="New Messages"
        count={contactsData?.getContacts?.length || 0}
        loading={contactsLoading}
        onClick={() => setActiveTab('contacts')}
        bgColor="bg-cream"
      />
      <StatCard 
        title="Blog Posts"
        count={blogsData?.getAllBlogs?.length || 0}
        loading={blogsLoading}
        onClick={() => setActiveTab('blogs')}
        bgColor="bg-beige"
      />
        <StatCard 
        title="Total Orders"
        count={orderStatsData?.getOrderStats?.totalOrders || 0}
        loading={orderStatsLoading}
        onClick={() => setActiveTab('orders')}
        bgColor="bg-cream"
      />
    </div>
  );
};

export default StatsCards;