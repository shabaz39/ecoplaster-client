// File: ecoplaster-client/src/components/AdminDashboardComponents/OrderManagement/OrdersPage.tsx
"use client";

import React, { useState, useEffect } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";
import LoadingSpinner from '../Common/LoadingSpinner';
import ConfirmationModal from '../Common/ConfirmationModal';
import OrderDetailsModal from './OrderDetailsModal';
import OrderFilters from './OrderFilter';

// GraphQL Queries & Mutations
const GET_ALL_ORDERS = gql`
  query GetAllOrders {
    getAllOrders {
      id
      userId
      user {
        id
        name
        email
        phoneNumber
      }
      products {
        productId
        quantity
        price
        name
        code
        image
      }
      totalAmount
      shippingAddress {
        street
        city
        state
        country
        zip
      }
      billingAddress {
        street
        city
        state
        country
        zip
      }
      paymentMethod
      paymentStatus
      trackingNumber
      shippingMethod
      transactionId
      status
      estimatedDelivery
      notes
      statusHistory {
        status
        updatedAt
      }
      createdAt
    }
  }
`;

// Other GraphQL mutations remain the same
const UPDATE_ORDER_STATUS = gql`
  mutation UpdateOrderStatus($orderId: ID!, $status: String!) {
    updateOrderStatus(orderId: $orderId, status: $status) {
      id
      status
      statusHistory {
        status
        updatedAt
      }
    }
  }
`;

const UPDATE_ORDER_TRACKING = gql`
  mutation UpdateOrderTrackingInfo($orderId: ID!, $trackingNumber: String!, $shippingMethod: String!) {
    updateOrderTrackingInfo(orderId: $orderId, trackingNumber: $trackingNumber, shippingMethod: $shippingMethod) {
      id
      trackingNumber
      shippingMethod
    }
  }
`;

const ADD_ORDER_NOTE = gql`
  mutation AddOrderNote($orderId: ID!, $note: String!) {
    addOrderNote(orderId: $orderId, note: $note) {
        id
      notes
    }
  }
`;

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

// Status badges styling function
const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Processing':
      return 'bg-blue-100 text-blue-800';
    case 'Shipped':
      return 'bg-purple-100 text-purple-800';
    case 'Delivered':
      return 'bg-green-100 text-green-800';
    case 'Cancelled':
      return 'bg-red-100 text-red-800';
    case 'Returned':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getPaymentStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'Paid':
      return 'bg-green-100 text-green-800';
    case 'Pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'Failed':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Helper function to format date with error handling
const formatDate = (dateString: string | number) => {
    try {
      // Handle different types of date inputs
      let date: Date;
      
      if (typeof dateString === 'number' || !isNaN(Number(dateString))) {
        // If it's a number (timestamp) or numeric string
        const timestamp = typeof dateString === 'number' ? dateString : Number(dateString);
        date = new Date(timestamp);
      } else {
        // Otherwise treat as ISO date string or other date format
        date = new Date(dateString);
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date value:', dateString);
        return 'Invalid date';
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Error formatting date:', error, 'Value:', dateString);
      return 'Invalid date';
    }
  };

  // Now, add a utility function to extract the date part from timestamps
const getDateOnly = (dateValue: string | number | Date): string => {
    try {
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) {
        console.warn('Invalid date in getDateOnly:', dateValue);
        return '';
      }
      return date.toISOString().split('T')[0]; // Returns YYYY-MM-DD
    } catch (error) {
      console.error('Error in getDateOnly:', error);
      return '';
    }
  };

const OrdersPageComponent: React.FC = () => {
  // State for order management
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
  const [pendingStatusChange, setPendingStatusChange] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [dateFilter, setDateFilter] = useState<{ startDate: string, endDate: string }>({
    startDate: '',
    endDate: ''
  });
  const [currentPage, setCurrentPage] = useState<number>(1);
  const ordersPerPage = 10;

  // GraphQL Queries and Mutations
  const { loading, error, data, refetch } = useQuery(GET_ALL_ORDERS);
  const { data: statsData, loading: statsLoading } = useQuery(GET_ORDER_STATS);
  
  const [updateOrderStatus, { loading: updateStatusLoading }] = useMutation(UPDATE_ORDER_STATUS, {
    onCompleted: () => {
      refetch();
      setIsConfirmModalOpen(false);
    }
  });
  
  const [updateOrderTracking] = useMutation(UPDATE_ORDER_TRACKING, {
    onCompleted: () => {
      refetch();
    }
  });
  
  const [addOrderNote] = useMutation(ADD_ORDER_NOTE, {
    onCompleted: () => {
      refetch();
    }
  });

  const filteredOrders = React.useMemo(() => {
    if (!data?.getAllOrders) return [];
    
    console.log("Filtering with:", { 
      status: statusFilter, 
      dates: dateFilter,
      search: searchTerm
    });
    
    return data.getAllOrders.filter((order: any) => {
      let keepOrder = true;
      
      // Status filter
      if (statusFilter && order.status !== statusFilter) {
        return false;
      }
      
      // Date filter - improved approach
      if (dateFilter.startDate && dateFilter.endDate) {
        try {
          // Get the date parts only (YYYY-MM-DD)
          const orderDateStr = getDateOnly(order.createdAt);
          
          if (!orderDateStr) {
            console.warn(`Order ${order.id.slice(-8)} has invalid date:`, order.createdAt);
            // If we can't parse the date, we'll skip filtering this order by date
          } else {
            // Direct string comparison for dates in YYYY-MM-DD format
            if (orderDateStr < dateFilter.startDate || orderDateStr > dateFilter.endDate) {
              return false;
            }
          }
        } catch (err) {
          console.error('Error in date filtering for order:', order.id, err);
        }
      }
      
      // Search filter - search by id and transaction id
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const idMatch = order.id.toLowerCase().includes(searchLower);
        const transactionMatch = order.transactionId && 
                                order.transactionId.toLowerCase().includes(searchLower);
        
        if (!idMatch && !transactionMatch) {
          return false;
        }
      }
      
      return true;
    });
  }, [data, statusFilter, dateFilter, searchTerm]);

  React.useEffect(() => {
    console.log("Filter changed:", { 
      status: statusFilter, 
      dates: dateFilter,
      search: searchTerm,
      filteredCount: filteredOrders.length
    });
  }, [statusFilter, dateFilter, searchTerm, filteredOrders.length]);
  
  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // Handler functions
  const handleUpdateOrderStatus = (orderId: string, newStatus: string) => {
    setSelectedOrder(data.getAllOrders.find((order: any) => order.id === orderId));
    setPendingStatusChange(newStatus);
    setIsConfirmModalOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedOrder || !pendingStatusChange) return;
    
    try {
      await updateOrderStatus({
        variables: {
          orderId: selectedOrder.id,
          status: pendingStatusChange
        }
      });
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const handleUpdateTracking = async (orderId: string) => {
    const order = data.getAllOrders.find((o: any) => o.id === orderId);
    if (!order) return;
    
    const trackingNumber = prompt('Enter tracking number:', order.trackingNumber || '');
    if (trackingNumber === null) return;
    
    const shippingMethod = prompt('Enter shipping method:', order.shippingMethod || '');
    if (shippingMethod === null) return;
    
    try {
      await updateOrderTracking({
        variables: {
          orderId,
          trackingNumber,
          shippingMethod
        }
      });
    } catch (error) {
      console.error('Error updating tracking information:', error);
    }
  };

  const handleAddNote = async (orderId: string) => {
    const order = data.getAllOrders.find((o: any) => o.id === orderId);
    if (!order) return;
    
    const note = prompt('Enter note:', order.notes || '');
    if (note === null) return;
    
    try {
      await addOrderNote({
        variables: {
          orderId,
          note
        }
      });
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  // Pagination handlers
  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error loading orders: {error.message}</div>;

  return (
    <div className="bg-gray-50 min-h-screen text-black">
      <header className="bg-cream px-6 py-8 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-productNameColor">Orders Management</h1>
          <h2 className="text-xl font-semibold text-greenComponent">Admin Dashboard</h2>
          <p className="text-sm text-newgreensecond">View and manage all customer orders</p>
        </div>
      </header>

      {/* Order Stats */}
      <section className="px-6 py-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
            <p className="text-2xl font-bold text-greenComponent">
              {statsLoading ? '...' : statsData?.getOrderStats?.totalOrders || 0}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
            <p className="text-2xl font-bold text-greenComponent">
              ₹{statsLoading ? '...' : (statsData?.getOrderStats?.totalRevenue || 0).toLocaleString()}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Pending Orders</h3>
            <p className="text-2xl font-bold text-greenComponent">
              {statsLoading ? '...' : statsData?.getOrderStats?.ordersByStatus?.Pending || 0}
            </p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Processing Orders</h3>
            <p className="text-2xl font-bold text-greenComponent">
              {statsLoading ? '...' : statsData?.getOrderStats?.ordersByStatus?.Processing || 0}
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <OrderFilters 
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        dateFilter={dateFilter}
        setDateFilter={setDateFilter}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {/* Orders Table */}
      <section className="px-6 py-4">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-beige">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-productNameColor tracking-wider">Order ID</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-productNameColor tracking-wider">Customer</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-productNameColor tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-productNameColor tracking-wider">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-productNameColor tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-productNameColor tracking-wider">Payment</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-productNameColor tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentOrders.length > 0 ? (
                  currentOrders.map((order: any) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{order.id.slice(-8)}</div>
                        <div className="text-xs text-gray-500">{order.transactionId || 'N/A'}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {order.user?.name || 'Unknown'}
                        </div>
                        <div className="text-xs text-gray-500">
                          {order.user?.email || 'N/A'}
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{formatDate(order.createdAt)}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">₹{order.totalAmount.toFixed(2)}</div>
                        <div className="text-xs text-gray-500">{order.products.length} items</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusBadgeClass(order.paymentStatus)}`}>
                            {order.paymentStatus}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">{order.paymentMethod}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleViewDetails(order)}
                            className="text-greenComponent hover:text-newgreen"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => handleUpdateTracking(order.id)}
                            className="text-blue-600 hover:text-blue-800"
                            disabled={order.status === 'Cancelled' || order.status === 'Returned'}
                          >
                            Tracking
                          </button>
                          <button 
                            onClick={() => handleAddNote(order.id)}
                            className="text-purple-600 hover:text-purple-800"
                          >
                            Note
                          </button>
                        </div>
                        <div className="flex space-x-2 mt-1">
                          {order.status === 'Pending' && (
                            <>
                              <button 
                                onClick={() => handleUpdateOrderStatus(order.id, 'Processing')}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                Process
                              </button>
                              <button 
                                onClick={() => handleUpdateOrderStatus(order.id, 'Cancelled')}
                                className="text-red-600 hover:text-red-800"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {order.status === 'Processing' && (
                            <>
                              <button 
                                onClick={() => handleUpdateOrderStatus(order.id, 'Shipped')}
                                className="text-purple-600 hover:text-purple-800"
                              >
                                Ship
                              </button>
                              <button 
                                onClick={() => handleUpdateOrderStatus(order.id, 'Cancelled')}
                                className="text-red-600 hover:text-red-800"
                              >
                                Cancel
                              </button>
                            </>
                          )}
                          {order.status === 'Shipped' && (
                            <button 
                              onClick={() => handleUpdateOrderStatus(order.id, 'Delivered')}
                              className="text-green-600 hover:text-green-800"
                            >
                              Deliver
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-4 py-4 text-center text-gray-500">
                      No orders found matching the current filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {filteredOrders.length > ordersPerPage && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => goToPage(Math.max(1, currentPage - 1))}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Previous
                </button>
                <button
                  onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstOrder + 1}</span> to{' '}
                    <span className="font-medium">{Math.min(indexOfLastOrder, filteredOrders.length)}</span> of{' '}
                    <span className="font-medium">{filteredOrders.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => goToPage(1)}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">First</span>
                      &laquo;
                    </button>
                    <button
                      onClick={() => goToPage(Math.max(1, currentPage - 1))}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Previous</span>
                      &lsaquo;
                    </button>
                    
                    {/* Page Numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                      // Create a window of 5 pages centered around current page
                      let pageNum;
                      if (totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (currentPage <= 3) {
                        pageNum = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNum = totalPages - 4 + i;
                      } else {
                        pageNum = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => goToPage(pageNum)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            currentPage === pageNum
                              ? 'z-10 bg-greenComponent text-white border-greenComponent'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                    
                    <button
                      onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
                      className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Next</span>
                      &rsaquo;
                    </button>
                    <button
                      onClick={() => goToPage(totalPages)}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                    >
                      <span className="sr-only">Last</span>
                      &raquo;
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Order Detail Modal */}
      {isDetailModalOpen && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setIsDetailModalOpen(false)}
          onUpdateStatus={handleUpdateOrderStatus}
          onUpdateTracking={handleUpdateTracking}
          onAddNote={handleAddNote}
          formatDate={formatDate}
          getStatusBadgeClass={getStatusBadgeClass}
          getPaymentStatusBadgeClass={getPaymentStatusBadgeClass}
        />
      )}

      {/* Confirmation Modal */}
      {isConfirmModalOpen && (
        <ConfirmationModal
          title="Confirm Status Change"
          message={`Are you sure you want to update the order status to "${pendingStatusChange}"?`}
          confirmLabel="Update Status"
          cancelLabel="Cancel"
          confirmButtonClass="bg-greenComponent hover:bg-newgreen"
          onConfirm={confirmStatusChange}
          onCancel={() => setIsConfirmModalOpen(false)}
        />
      )}
    </div>
  );
};

export default OrdersPageComponent;