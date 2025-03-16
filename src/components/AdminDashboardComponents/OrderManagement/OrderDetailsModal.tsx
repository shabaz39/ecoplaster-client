// File: ecoplaster-client/src/components/AdminDashboardComponents/OrderManagement/OrderDetailsModal.tsx
import React from 'react';
import { useQuery, gql } from '@apollo/client';

// Query to get user info for an order
const GET_USER_INFO = gql`
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      name
      email
      phoneNumber
    }
  }
`;

// Query to get product details
const GET_PRODUCT_BY_ID = gql`
  query GetProductById($id: ID!) {
    getProductById(id: $id) {
      id
      name
      code
      price {
        mrp
        offerPrice
      }
      images {
        imageMain
      }
    }
  }
`;

interface OrderDetailsModalProps {
  order: any;
  onClose: () => void;
  onUpdateStatus: (orderId: string, status: string) => void;
  onUpdateTracking: (orderId: string) => void;
  onAddNote: (orderId: string) => void;
  formatDate: (date: string) => string;
  getStatusBadgeClass: (status: string) => string;
  getPaymentStatusBadgeClass: (status: string) => string;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  onClose,
  onUpdateStatus,
  onUpdateTracking,
  onAddNote,
  formatDate,
  getStatusBadgeClass,
  getPaymentStatusBadgeClass
}) => {
  // Get user info
  const { data: userData } = useQuery(GET_USER_INFO, {
    variables: { id: order.userId },
    skip: !order.userId
  });

  const user = userData?.getUser;

  // Function to prevent click propagation to modal backdrop
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto"
        onClick={handleModalClick}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b sticky top-0 bg-white z-10 flex justify-between items-center">
          <h2 className="text-xl font-bold text-productNameColor">
            Order #{order.id.slice(-8)}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Order Summary */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Order Status</h3>
              <span className={`mt-1 px-2 py-1 inline-flex text-sm leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Order Date</h3>
              <p className="mt-1 text-sm text-gray-900">{formatDate(order.createdAt)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Amount</h3>
              <p className="mt-1 text-sm font-medium text-gray-900">₹{order.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-medium text-productNameColor mb-3">Customer Information</h3>
            {user ? (
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Name:</span> {user.name}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Email:</span> {user.email}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Phone:</span> {user.phoneNumber}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">Loading customer information...</p>
            )}
          </div>

          {/* Payment & Shipping */}
          <div>
            <h3 className="text-lg font-medium text-productNameColor mb-3">Payment & Shipping</h3>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Payment Method:</span> {order.paymentMethod}
              </p>
              <p className="text-sm">
                <span className="font-medium">Payment Status:</span>{' '}
                <span className={`px-2 py-0.5 text-xs rounded-full ${getPaymentStatusBadgeClass(order.paymentStatus)}`}>
                  {order.paymentStatus}
                </span>
              </p>
              {order.transactionId && (
                <p className="text-sm">
                  <span className="font-medium">Transaction ID:</span> {order.transactionId}
                </p>
              )}
              {order.trackingNumber && (
                <p className="text-sm">
                  <span className="font-medium">Tracking Number:</span> {order.trackingNumber}
                </p>
              )}
              {order.shippingMethod && (
                <p className="text-sm">
                  <span className="font-medium">Shipping Method:</span> {order.shippingMethod}
                </p>
              )}
              {order.estimatedDelivery && (
                <p className="text-sm">
                  <span className="font-medium">Estimated Delivery:</span> {formatDate(order.estimatedDelivery)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="px-6 py-4">
          <h3 className="text-lg font-medium text-productNameColor mb-3">Order Items</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {order.products.map((item: any, index: number) => (
                  <ProductItem key={`${item.productId}-${index}`} item={item} />
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td colSpan={3} className="px-4 py-3 text-right text-sm font-medium text-gray-900">Total:</td>
                  <td className="px-4 py-3 text-left text-sm font-medium text-gray-900">₹{order.totalAmount.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Addresses */}
        <div className="px-6 py-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Shipping Address */}
          <div>
            <h3 className="text-lg font-medium text-productNameColor mb-3">Shipping Address</h3>
            <address className="not-italic text-sm">
              {order.shippingAddress.street}<br />
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}<br />
              {order.shippingAddress.country}
            </address>
          </div>

          {/* Billing Address */}
          <div>
            <h3 className="text-lg font-medium text-productNameColor mb-3">Billing Address</h3>
            <address className="not-italic text-sm">
              {order.billingAddress ? (
                <>
                  {order.billingAddress.street}<br />
                  {order.billingAddress.city}, {order.billingAddress.state} {order.billingAddress.zip}<br />
                  {order.billingAddress.country}
                </>
              ) : (
                <span className="text-gray-500">Same as shipping address</span>
              )}
            </address>
          </div>
        </div>

        {/* Order Notes */}
        <div className="px-6 py-4">
          <h3 className="text-lg font-medium text-productNameColor mb-3">Order Notes</h3>
          {order.notes ? (
            <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-md">{order.notes}</p>
          ) : (
            <p className="text-sm text-gray-500">No notes for this order.</p>
          )}
        </div>

        {/* Order History */}
        <div className="px-6 py-4">
          <h3 className="text-lg font-medium text-productNameColor mb-3">Order History</h3>
          <div className="space-y-2">
            {order.statusHistory?.length > 0 ? (
              order.statusHistory.map((history: any, index: number) => (
                <div key={index} className="flex items-center text-sm">
                  <div className="w-24 flex-shrink-0 text-gray-500">{formatDate(history.updatedAt)}</div>
                  <div className="w-24 flex-shrink-0">
                    <span className={`px-2 py-0.5 text-xs rounded-full ${getStatusBadgeClass(history.status)}`}>
                      {history.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">No status history available.</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 border-t flex flex-wrap justify-end gap-3 sticky bottom-0 bg-white">
          {order.status === 'Pending' && (
            <>
              <button
                onClick={() => onUpdateStatus(order.id, 'Processing')}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Process Order
              </button>
              <button
                onClick={() => onUpdateStatus(order.id, 'Cancelled')}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Cancel Order
              </button>
            </>
          )}
          {order.status === 'Processing' && (
            <>
              <button
                onClick={() => onUpdateStatus(order.id, 'Shipped')}
                className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
              >
                Mark as Shipped
              </button>
              <button
                onClick={() => onUpdateStatus(order.id, 'Cancelled')}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Cancel Order
              </button>
            </>
          )}
          {order.status === 'Shipped' && (
            <button
              onClick={() => onUpdateStatus(order.id, 'Delivered')}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Mark as Delivered
            </button>
          )}
          <button
            onClick={() => onUpdateTracking(order.id)}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
            disabled={order.status === 'Cancelled' || order.status === 'Returned'}
          >
            Update Tracking
          </button>
          <button
            onClick={() => onAddNote(order.id)}
            className="px-4 py-2 bg-greenComponent text-white rounded hover:bg-newgreen"
          >
            Add Note
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

// Component to display product item with data fetching
const ProductItem = ({ item }: { item: any }) => {
  const { data } = useQuery(GET_PRODUCT_BY_ID, {
    variables: { id: item.productId },
    skip: !item.productId
  });

  const product = data?.getProductById;

  return (
    <tr>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center">
          {product?.images?.imageMain && (
            <img 
              src={product.images.imageMain} 
              alt={product.name} 
              className="h-10 w-10 mr-3 object-cover rounded"
            />
          )}
          <div>
            <div className="text-sm font-medium text-gray-900">
              {product?.name || item.name || 'Product not found'}
            </div>
            <div className="text-xs text-gray-500">
              {product?.code || item.code || item.productId}
            </div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="text-sm text-gray-900">₹{item.price?.toFixed(2)}</div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="text-sm text-gray-900">{item.quantity}</div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="text-sm text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</div>
      </td>
    </tr>
  );
};

export default OrderDetailsModal;