// components/AdminDashboard/DealerManagement/DealerList.tsx
import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_ALL_DEALERS } from '@/constants/queries/allGETrequests';
import LoadingSpinner from '../Common/LoadingSpinner';

const DealerList = () => {
  const { data: dealersData, loading: dealersLoading } = useQuery(GET_ALL_DEALERS);

  if (dealersLoading) return <LoadingSpinner />;

  return (
    <section>
      <h3 className="text-lg font-semibold text-productNameColor mb-6">Dealer Network</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dealersData?.getDealers?.map((dealer: any) => (
          <div key={dealer.id} className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <h4 className="text-lg font-semibold text-productNameColor">{dealer.fullName}</h4>
              <span className={`px-2 py-1 text-xs rounded-full ${
                dealer.type === 'PREMIUM' ? 'bg-newbeige text-searchBeige' : 'bg-cream text-greenText'
              }`}>
                {dealer.type}
              </span>
            </div>
            <div className="mt-4 space-y-2">
              <p className="text-gray-600 flex items-center gap-2">
                <span>📧</span> {dealer.email}
              </p>
              <p className="text-gray-600 flex items-center gap-2">
                <span>📱</span> {dealer.mobileNumber}
              </p>
              <p className="text-gray-600 flex items-center gap-2">
                <span>📍</span> {dealer.city}
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between text-sm">
              <span className="text-gray-500">
                Joined: {new Date(dealer.createdAt).toLocaleDateString()}
              </span>
              <span className={`${dealer.notifications ? 'text-greenText' : 'text-gray-400'}`}>
                {dealer.notifications ? '🔔 Notifications On' : '🔕 Notifications Off'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DealerList;