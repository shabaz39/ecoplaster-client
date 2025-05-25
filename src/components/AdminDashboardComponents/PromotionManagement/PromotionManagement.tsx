// Enhanced PromotionManagement component with proper date handling
import React, { useState } from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';
import { 
  GET_ALL_PROMOTIONS, 
  CREATE_PROMOTION, 
  UPDATE_PROMOTION, 
  DELETE_PROMOTION 
} from '@/constants/queries/promotionQueries';
import LoadingSpinner from '../Common/LoadingSpinner';
import PromotionForm from './PromotionForm';
import { toast } from 'react-toastify';

// New query for usage stats
const GET_PROMOTION_USAGE_STATS = gql`
  query GetPromotionUsageStats($id: ID!) {
    getPromotionUsageStats(id: $id) {
      totalUses
      maximumUses
      usagePercentage
      totalDiscountGiven
      uniqueUsers
      recentUsages {
        userId
        orderId
        usedAt
        discountApplied
        orderTotal
      }
    }
  }
`;

interface Promotion {
  id: string;
  title: string;
  description: string;
  discountValue: number;
  discountType: 'PERCENTAGE' | 'FIXED';
  scope: 'ORDER' | 'PRODUCT';
  code: string;
  startDate: string;
  endDate: string;
  active: boolean;
  applicableProducts: string[];
  minimumPurchase: number;
  maximumUses: number;
  maxUsesPerUser: number;
  usesCount: number;
  createdAt: string;
  updatedAt: string;
}

const PromotionManagement: React.FC = () => {
  const [showPromotionForm, setShowPromotionForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(null);
  const [selectedPromotionStats, setSelectedPromotionStats] = useState<string | null>(null);

  // GraphQL queries and mutations
  const { data, loading, error, refetch } = useQuery(GET_ALL_PROMOTIONS, {
    onError: (error) => {
      console.error('Detail error:', error);
    }
  });

  const { data: usageStatsData, loading: statsLoading } = useQuery(GET_PROMOTION_USAGE_STATS, {
    variables: { id: selectedPromotionStats },
    skip: !selectedPromotionStats
  });
  
  const [createPromotion, { loading: createLoading }] = useMutation(CREATE_PROMOTION, {
    onCompleted: () => {
      toast.success('Promotion created successfully');
      refetch();
      setShowPromotionForm(false);
    },
    onError: (error) => {
      toast.error(`Failed to create promotion: ${error.message}`);
    }
  });
  
  const [updatePromotion, { loading: updateLoading }] = useMutation(UPDATE_PROMOTION, {
    onCompleted: () => {
      toast.success('Promotion updated successfully');
      refetch();
      setEditingPromotion(null);
      setShowPromotionForm(false);
    },
    onError: (error) => {
      toast.error(`Failed to update promotion: ${error.message}`);
    }
  });
  
  const [deletePromotion, { loading: deleteLoading }] = useMutation(DELETE_PROMOTION, {
    onCompleted: () => {
      toast.success('Promotion deleted successfully');
      refetch();
    },
    onError: (error) => {
      toast.error(`Failed to delete promotion: ${error.message}`);
    }
  });

  const handleCreatePromotion = async (formData: any) => {
    try {
      await createPromotion({
        variables: {
          input: {
            ...formData,
            active: true
          }
        }
      });
    } catch (error) {
      console.error('Error creating promotion:', error);
    }
  };

  const handleUpdatePromotion = async (formData: any) => {
    if (!editingPromotion) return;
    
    try {
      await updatePromotion({
        variables: {
          id: editingPromotion.id,
          input: formData
        }
      });
    } catch (error) {
      console.error('Error updating promotion:', error);
    }
  };

  const handleDeletePromotion = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this promotion?')) return;
    
    try {
      await deletePromotion({
        variables: { id }
      });
    } catch (error) {
      console.error('Error deleting promotion:', error);
    }
  };

  const handleToggleActive = async (promotion: Promotion) => {
    try {
      await updatePromotion({
        variables: {
          id: promotion.id,
          input: {
            active: !promotion.active
          }
        }
      });
    } catch (error) {
      console.error('Error toggling promotion status:', error);
    }
  };

  // Enhanced date parsing function
  const parseDate = (dateString: string | number | Date): Date => {
    if (!dateString) return new Date();
    
    // If it's already a Date object
    if (dateString instanceof Date) {
      return dateString;
    }
    
    // If it's a numeric timestamp
    if (typeof dateString === 'number') {
      return new Date(dateString);
    }
    
    // If it's a string
    if (typeof dateString === 'string') {
      // Check if it's a numeric string (timestamp)
      if (/^\d+$/.test(dateString)) {
        return new Date(parseInt(dateString, 10));
      }
      
      // Try to parse as ISO string or other date format
      const parsed = new Date(dateString);
      if (!isNaN(parsed.getTime())) {
        return parsed;
      }
    }
    
    console.warn('Unable to parse date:', dateString);
    return new Date();
  };

  const formatDate = (dateString: string | number | Date) => {
    try {
      const date = parseDate(dateString);
      if (isNaN(date.getTime())) {
        console.error('Invalid date:', dateString);
        return 'Invalid Date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid Date';
    }
  };

  const isPromotionActive = (promotion: Promotion) => {
    try {
      const now = new Date();
      const startDate = parseDate(promotion.startDate);
      const endDate = parseDate(promotion.endDate);
      
      return promotion.active && startDate <= now && now <= endDate;
    } catch (error) {
      console.error('Error checking if promotion is active:', error);
      return false;
    }
  };

  const getUsagePercentage = (promotion: Promotion) => {
    if (promotion.maximumUses === 0) return 0; // Unlimited
    return (promotion.usesCount / promotion.maximumUses) * 100;
  };

  const getScopeLabel = (scope: string) => {
    return scope === 'PRODUCT' ? 'Product Level' : 'Order Level';
  };

  const getScopeBadgeClass = (scope: string) => {
    return scope === 'PRODUCT' 
      ? 'bg-purple-100 text-purple-800'
      : 'bg-blue-100 text-blue-800';
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error loading promotions: {error.message}</div>;

  const promotions = data?.getAllPromotions || [];

  return (
    <div className="space-y-6 text-black">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-productNameColor">Promotional Campaigns</h3>
        <button
          onClick={() => {
            setEditingPromotion(null);
            setShowPromotionForm(!showPromotionForm);
          }}
          className="bg-greenComponent text-white px-4 py-2 rounded hover:bg-newgreen transition-colors"
        >
          {showPromotionForm ? "Cancel" : "Create New Promotion"}
        </button>
      </div>

      {showPromotionForm && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h4 className="text-lg font-medium text-productNameColor mb-4">
            {editingPromotion ? 'Edit Promotion' : 'Create New Promotion'}
          </h4>
          <PromotionForm
            onSubmit={editingPromotion ? handleUpdatePromotion : handleCreatePromotion}
            initialData={editingPromotion ? {
              ...editingPromotion,
              // Convert dates for form (YYYY-MM-DD format)
              startDate: (() => {
                try {
                  const date = parseDate(editingPromotion.startDate);
                  return date.toISOString().split('T')[0];
                } catch {
                  return '';
                }
              })(),
              endDate: (() => {
                try {
                  const date = parseDate(editingPromotion.endDate);
                  return date.toISOString().split('T')[0];
                } catch {
                  return '';
                }
              })(),
              // Ensure numeric fields are properly converted
              discountValue: Number(editingPromotion.discountValue) || 0,
              minimumPurchase: Number(editingPromotion.minimumPurchase) || 0,
              maximumUses: Number(editingPromotion.maximumUses) || 0,
              maxUsesPerUser: Number(editingPromotion.maxUsesPerUser) || 0,
            } : undefined}
          />
        </div>
      )}

      {/* Usage Statistics Modal */}
      {selectedPromotionStats && usageStatsData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Usage Statistics</h3>
              <button 
                onClick={() => setSelectedPromotionStats(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {statsLoading ? (
              <LoadingSpinner />
            ) : (
              <div className="space-y-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-blue-800">Total Uses</h4>
                    <p className="text-2xl font-bold text-blue-900">
                      {usageStatsData.getPromotionUsageStats.totalUses}
                      {usageStatsData.getPromotionUsageStats.maximumUses > 0 && 
                        `/${usageStatsData.getPromotionUsageStats.maximumUses}`
                      }
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-green-800">Total Discount Given</h4>
                    <p className="text-2xl font-bold text-green-900">
                      ₹{usageStatsData.getPromotionUsageStats.totalDiscountGiven.toLocaleString()}
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-purple-800">Unique Users</h4>
                    <p className="text-2xl font-bold text-purple-900">
                      {usageStatsData.getPromotionUsageStats.uniqueUsers}
                    </p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <h4 className="text-sm font-medium text-orange-800">Usage Rate</h4>
                    <p className="text-2xl font-bold text-orange-900">
                      {usageStatsData.getPromotionUsageStats.usagePercentage.toFixed(1)}%
                    </p>
                  </div>
                </div>

                {/* Recent Usage */}
                <div>
                  <h4 className="text-lg font-medium mb-3">Recent Usage</h4>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount Applied</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order Total</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Used At</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {usageStatsData.getPromotionUsageStats.recentUsages.map((usage: any, index: number) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {usage.userId.slice(-8)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {usage.orderId.slice(-8)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                              ₹{usage.discountApplied.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              ₹{usage.orderTotal.toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {formatDate(usage.usedAt)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="space-y-4">
        {promotions.length === 0 ? (
          <div className="text-center py-8 text-gray-500 bg-gray-100 rounded-lg">
            No promotions found. Start by creating a new promotion.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Scope</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Duration</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {promotions.map((promotion: Promotion) => (
                  <tr key={promotion.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{promotion.title}</div>
                      <div className="text-sm text-gray-500 truncate max-w-xs">{promotion.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {promotion.code}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {promotion.discountType === 'PERCENTAGE' 
                          ? `${promotion.discountValue}%` 
                          : `₹${promotion.discountValue}`}
                      </div>
                      {promotion.minimumPurchase > 0 && (
                        <div className="text-xs text-gray-500">
                          Min: ₹{promotion.minimumPurchase}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScopeBadgeClass(promotion.scope)}`}>
                        {getScopeLabel(promotion.scope)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(promotion.startDate)} - {formatDate(promotion.endDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            isPromotionActive(promotion)
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {isPromotionActive(promotion) ? 'Active' : 'Inactive'}
                        </span>
                        <label className="relative inline-flex items-center cursor-pointer ml-2">
                          <input
                            type="checkbox"
                            className="sr-only peer"
                            checked={promotion.active}
                            onChange={() => handleToggleActive(promotion)}
                            disabled={deleteLoading || updateLoading}
                          />
                          <div className="w-9 h-5 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-green-300 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-greenComponent"></div>
                        </label>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {promotion.usesCount}
                        {promotion.maximumUses > 0 && (
                          <span className="text-gray-500">/{promotion.maximumUses}</span>
                        )}
                      </div>
                      {promotion.maxUsesPerUser > 0 && (
                        <div className="text-xs text-gray-500">
                          Max {promotion.maxUsesPerUser}/user
                        </div>
                      )}
                      {promotion.maximumUses > 0 && (
                        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                          <div 
                            className="bg-green-600 h-1.5 rounded-full" 
                            style={{ width: `${Math.min(getUsagePercentage(promotion), 100)}%` }}
                          ></div>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => setSelectedPromotionStats(promotion.id)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        disabled={deleteLoading}
                      >
                        Stats
                      </button>
                      <button
                        onClick={() => {
                          setEditingPromotion(promotion);
                          setShowPromotionForm(true);
                        }}
                        className="text-indigo-600 hover:text-indigo-900 mr-3"
                        disabled={deleteLoading}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeletePromotion(promotion.id)}
                        className="text-red-600 hover:text-red-900"
                        disabled={deleteLoading}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionManagement;