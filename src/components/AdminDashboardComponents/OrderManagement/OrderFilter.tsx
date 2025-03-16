// File: ecoplaster-client/src/components/AdminDashboardComponents/OrderManagement/OrderFilter.tsx
import React, { useEffect } from 'react';

interface OrderFiltersProps {
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  dateFilter: {
    startDate: string;
    endDate: string;
  };
  setDateFilter: (filter: { startDate: string; endDate: string }) => void;
  searchTerm: string;
  setSearchTerm: (search: string) => void;
}

const OrderFilters: React.FC<OrderFiltersProps> = ({
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter,
  searchTerm,
  setSearchTerm
}) => {
  const clearFilters = () => {
    setStatusFilter('');
    setDateFilter({ startDate: '', endDate: '' });
    setSearchTerm('');
  };

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    const newFilter = {
      ...dateFilter,
      [field]: value
    };
    
    // Auto-set end date if only start date is provided
    if (field === 'startDate' && value && !dateFilter.endDate) {
      newFilter.endDate = value;
    }
    
    // Auto-set start date if only end date is provided
    if (field === 'endDate' && value && !dateFilter.startDate) {
      newFilter.startDate = value;
    }
    
    setDateFilter(newFilter);
    console.log("Setting date filter:", newFilter);
  };
  
  // Add effect to log when filters change
  useEffect(() => {
    console.log("Current filter state:", { 
      status: statusFilter,
      dateRange: dateFilter,
      search: searchTerm
    });
  }, [statusFilter, dateFilter, searchTerm]);

  // Helper to format date for display
  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <section className="px-6 py-4">
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-medium text-productNameColor mb-4">Order Filters</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Search Filter */}
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Order ID or Transaction ID"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-greenComponent focus:border-greenComponent"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-greenComponent focus:border-greenComponent"
            >
              <option value="">All Statuses</option>
              <option value="Pending">Pending</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Returned">Returned</option>
            </select>
          </div>

          {/* Date Range Filter */}
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
              From Date
            </label>
            <input
              type="date"
              id="startDate"
              value={dateFilter.startDate}
              onChange={(e) => handleDateChange('startDate', e.target.value)}
              max={dateFilter.endDate || undefined}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-greenComponent focus:border-greenComponent"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
              To Date
            </label>
            <input
              type="date"
              id="endDate"
              value={dateFilter.endDate}
              onChange={(e) => handleDateChange('endDate', e.target.value)}
              min={dateFilter.startDate || undefined}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-greenComponent focus:border-greenComponent"
            />
          </div>
        </div>

        {/* Filter Actions */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Clear Filters
          </button>
        </div>

        {/* Active Filters */}
        {(statusFilter || dateFilter.startDate || dateFilter.endDate || searchTerm) && (
          <div className="mt-3 flex flex-wrap gap-2">
            {statusFilter && (
              <div className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-xs">
                Status: {statusFilter}
                <button 
                  onClick={() => setStatusFilter('')}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
            )}
            {dateFilter.startDate && dateFilter.endDate && (
              <div className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-xs">
                Date: {formatDisplayDate(dateFilter.startDate)} to {formatDisplayDate(dateFilter.endDate)}
                <button 
                  onClick={() => setDateFilter({ startDate: '', endDate: '' })}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
            )}
            {searchTerm && (
              <div className="inline-flex items-center px-2 py-1 rounded bg-gray-100 text-xs">
                Search: "{searchTerm}"
                <button 
                  onClick={() => setSearchTerm('')}
                  className="ml-1 text-gray-500 hover:text-gray-700"
                >
                  &times;
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default OrderFilters;