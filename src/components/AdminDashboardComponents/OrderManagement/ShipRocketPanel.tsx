// src/components/AdminDashboardComponents/OrderManagement/ShiprocketPanel.tsx
"use client";

import React, { useState, useEffect } from 'react';
import { useShiprocket } from '@/context/ShiprocketContext'; // Adjust path
import { TruckIcon, Tag, Download, FileText, AlertCircle, RefreshCw, PackageCheck, FileUp, X, CheckCircle, ExternalLink, Box, Scale, Ruler, Loader2 } from 'lucide-react'; // Added Box, Scale, Ruler, Loader2
import LoadingSpinner from '../Common/LoadingSpinner'; // Ensure this component returns valid JSX or null
import { toast } from 'react-toastify';

// Interface for package details state in this component
interface PackageDetailsState {
    weight: string; // Use string for input state to allow partial input/decimals
    length: string;
    breadth: string;
    height: string;
}

// Interface for package details input expected by the mutation/context
interface ShiprocketPackageDetailsInput {
    weight: number;
    length?: number | null;
    breadth?: number | null;
    height?: number | null;
}

interface ShiprocketPanelProps {
  order: any; // Ideally replace 'any' with a specific Order type from your project types
  refetchOrder: () => void; // Callback to refetch order data in the parent component
}

const ShiprocketPanel: React.FC<ShiprocketPanelProps> = ({ order, refetchOrder }) => {
  // Use the context hook
  const {
    // loading: contextLoading, // Use localLoading for specific actions
    error: contextError, // General errors from context
    // trackingData: contextTrackingData, // Use localTrackingData
    trackShipment,
    createShiprocketOrder,
    generateAWB,
    generateLabel,
    generateInvoice,
    cancelOrder,
    syncOrderStatus,
  } = useShiprocket();

  // Local state
  const [activeTab, setActiveTab] = useState<'tracking' | 'actions'>('tracking');
  const [courierInputId, setCourierInputId] = useState<string>('');
  const [localLoading, setLocalLoading] = useState<Record<string, boolean>>({});
  const [localError, setLocalError] = useState<string | null>(null);
  const [localSuccess, setLocalSuccess] = useState<string | null>(null);
  const [localTrackingData, setLocalTrackingData] = useState<any>(null);

  // --- State for Package Dimensions Input ---
  // Initialize with data from order if available, otherwise defaults
  const [packageInputs, setPackageInputs] = useState<PackageDetailsState>({
      weight: order?.packageDetails?.weight?.toString() || '0.5',
      length: order?.packageDetails?.length?.toString() || '10',
      breadth: order?.packageDetails?.breadth?.toString() || '10',
      height: order?.packageDetails?.height?.toString() || '10',
  });
  // ------------------------------------------

  // Derived state
  const isInShiprocket = !!order?.shiprocketOrderId;
  const hasAWB = !!order?.shiprocketAWBCode || !!order?.trackingNumber;
  const currentAWB = order?.shiprocketAWBCode || order?.trackingNumber;

  // --- Handlers ---

  // Handle package input changes
  const handlePackageInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      // Allow only numbers and a single decimal point
      const pattern = /^\d*\.?\d*$/;
      if (pattern.test(value)) {
          setPackageInputs(prev => ({ ...prev, [name]: value }));
      }
  };

  // Generic action handler (keep implementation from previous step)
  const handleAction = async (actionName: string, apiCall: () => Promise<any>) => {
    setLocalLoading(prev => ({ ...prev, [actionName]: true }));
    setLocalError(null); setLocalSuccess(null);
    try {
      const result = await apiCall();

      if (result && result.success === false) {
        const message = result.message || `Action '${actionName}' failed.`;
        setLocalError(message); toast.error(message);
      } else if (result) {
        const successMessage = result?.message || `${actionName.replace(/([A-Z])/g, ' $1')} successful!`;
        setLocalSuccess(successMessage); toast.success(successMessage);
        if (actionName === 'generateLabel' && result.labelUrl) window.open(result.labelUrl, '_blank');
        if (actionName === 'generateInvoice' && result.invoiceUrl) window.open(result.invoiceUrl, '_blank');
        if (actionName === 'trackShipment' && result.tracking_data) setLocalTrackingData(result);
        if (actionName === 'syncOrderStatus' && result.trackingDetails) setLocalTrackingData({ tracking_data: { shipment_track_activities: result.trackingDetails }});
        refetchOrder(); // Refetch parent order data on success
      } else {
        console.warn(`Action '${actionName}' completed but returned null/undefined result.`);
      }
    } catch (err: any) {
      const message = err.message || `An error occurred during ${actionName}.`;
      setLocalError(message); toast.error(`Error: ${message}`);
      console.error(`Error during ${actionName}:`, err);
    } finally {
      setLocalLoading(prev => ({ ...prev, [actionName]: false }));
    }
  };

  // Clear messages effect (keep as is)
  useEffect(() => { /* ... */ }, [localSuccess, localError]);

  // Track shipment effect (keep as is)
  useEffect(() => {
    if (currentAWB && activeTab === 'tracking' && !localLoading['trackShipment']) {
       handleAction('trackShipment', () => trackShipment(currentAWB));
    }
    if (!currentAWB) setLocalTrackingData(null);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentAWB, activeTab]);

  // Format date (keep as is)
  const formatDate = (dateStr: string | number | Date | null | undefined): string => {
    if (!dateStr) return 'N/A';
    try {
        const date = new Date(dateStr);
         if (isNaN(date.getTime())) return 'Invalid Date';
        return date.toLocaleString('en-IN', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true });
    } catch { return String(dateStr); }
   };

  // Specific Action Handlers
  const handleTrackShipment = () => {
    if (currentAWB) handleAction('trackShipment', () => trackShipment(currentAWB));
    else toast.warn('No tracking number available.');
  };

  // --- Updated handleCreateOrder ---
  const handleCreateOrder = () => {
    // Validate package inputs before confirmation
    const weight = parseFloat(packageInputs.weight);
    const length = parseFloat(packageInputs.length);
    const breadth = parseFloat(packageInputs.breadth);
    const height = parseFloat(packageInputs.height);

    let errors = [];
    if (isNaN(weight) || weight <= 0) errors.push("Weight (> 0 kg)");
    if (isNaN(length) || length <= 0) errors.push("Length (> 0 cm)");
    if (isNaN(breadth) || breadth <= 0) errors.push("Breadth (> 0 cm)");
    if (isNaN(height) || height <= 0) errors.push("Height (> 0 cm)");

    if (errors.length > 0) {
        toast.error(`Invalid package details: ${errors.join(', ')} required.`);
        return; // Stop if validation fails
    }

    // Confirmation dialog
    if (window.confirm(`Create Shiprocket order with Weight: ${weight}kg, L: ${length}cm, B: ${breadth}cm, H: ${height}cm?`)) {
      // Prepare details matching GQL Input Type
      const detailsToSend: ShiprocketPackageDetailsInput = { weight, length, breadth, height };
      // Call the generic action handler with the context function
      handleAction('createShiprocketOrder', () => createShiprocketOrder(order.id, detailsToSend));
    }
  };
  // --- End Updated handleCreateOrder ---

  const handleGenerateAWB = () => {
     const courierIdNum = parseInt(courierInputId);
    if (isNaN(courierIdNum) || courierIdNum <= 0) return toast.error('Please enter a valid positive Courier ID.');
    handleAction('generateAWB', () => generateAWB(order.id, courierIdNum));
  };

  const handleGenerateLabel = () => handleAction('generateLabel', () => generateLabel(order.id));
  const handleGenerateInvoice = () => handleAction('generateInvoice', () => generateInvoice(order.id));
  const handleCancelOrder = () => {
    if (window.confirm('Cancel this order in Shiprocket? This cannot be undone.')) {
      handleAction('cancelOrder', () => cancelOrder(order.id));
    }
  };
  const handleSyncStatus = () => handleAction('syncOrderStatus', () => syncOrderStatus(order.id));

  // Combined loading state
  const isAnyActionLoading = Object.values(localLoading).some(Boolean);
  const displayError = contextError?.message || localError;

  return (
    <div className="mt-4 bg-white rounded-lg shadow border border-gray-200 text-black">
      {/* Header and Tabs */}
      <div className="border-b text-black border-gray-200 bg-gray-50 p-3 flex items-center justify-between flex-wrap gap-2">
         <h3 className="text-base md:text-lg font-medium text-black flex items-center">
            <TruckIcon className="mr-2 h-5 w-5 text-greenComponent" /> Shiprocket Shipping
            </h3>
            <div className="flex space-x-1">
            <button className={`px-3 py-1 rounded-md text-xs md:text-sm font-medium transition-colors ${ activeTab === 'tracking' ? 'bg-greenComponent text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200' }`} onClick={() => setActiveTab('tracking')}> Tracking </button>
            <button className={`px-3 py-1 rounded-md text-xs md:text-sm font-medium transition-colors ${ activeTab === 'actions' ? 'bg-greenComponent text-white shadow-sm' : 'bg-gray-100 text-gray-700 hover:bg-gray-200' }`} onClick={() => setActiveTab('actions')}> Actions </button>
            </div>
      </div>

      {/* Status Messages */}
      {displayError && ( <div className="m-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200 flex items-start text-sm"> <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0" /> <span className="flex-1">{displayError}</span> <button className="ml-auto text-red-500 hover:text-red-700" onClick={() => setLocalError(null)}> <X className="h-4 w-4" /> </button> </div> )}
      {localSuccess && ( <div className="m-4 p-3 bg-green-50 text-green-700 rounded-md border border-green-200 flex items-start text-sm"> <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0" /> <span className="flex-1">{localSuccess}</span> <button className="ml-auto text-green-500 hover:text-green-700" onClick={() => setLocalSuccess(null)}> <X className="h-4 w-4" /> </button> </div> )}

      {/* Main Content Area */}
      <div className="min-h-[200px] relative">
        {/* Global Loading Overlay for any action */}
        {isAnyActionLoading && (
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex justify-center items-center z-20">
                <Loader2 className="h-6 w-6 animate-spin text-greenComponent" />
                <span className="ml-2 text-sm text-gray-600">Processing...</span>
            </div>
        )}

        {/* Tracking Tab */}
        {activeTab === 'tracking' && (
            <div className={`p-4 ${isAnyActionLoading ? 'opacity-50 pointer-events-none' : ''}`}>
                {/* AWB Display */}
                {currentAWB ? (
                    <div className="flex flex-col sm:flex-row mb-4 items-start sm:items-center gap-2">
                        <div className="flex-1">
                            <p className="text-xs font-medium text-gray-500 uppercase">AWB/Tracking</p>
                            <div className="flex items-center mt-1">
                                <Tag className="h-4 w-4 mr-1 text-greenComponent" />
                                <span className="font-medium text-sm">{currentAWB}</span>
                                {order.shiprocketCourier && <span className="ml-2 text-xs text-gray-500">({order.shiprocketCourier})</span>}
                            </div>
                        </div>
                        <button onClick={handleTrackShipment} disabled={localLoading['trackShipment']} className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-xs flex items-center whitespace-nowrap disabled:opacity-50">
                            <RefreshCw className={`h-3 w-3 mr-1 ${localLoading['trackShipment'] ? 'animate-spin' : ''}`} /> Refresh
                        </button>
                    </div>
                ) : (
                    <div className="bg-yellow-50 p-3 rounded-md text-yellow-700 text-sm mb-4">
                        <p>No tracking number available yet.</p>
                        {!isInShiprocket && ( <button onClick={() => setActiveTab('actions')} className="mt-1 text-sm text-blue-600 hover:underline font-medium"> Create order in Shiprocket </button> )}
                    </div>
                )}

                {/* Tracking Timeline/Status */}
                {localLoading['trackShipment'] && !localTrackingData ? (
                    <div className="flex justify-center items-center p-6"><LoadingSpinner /></div>
                 ) : localTrackingData?.tracking_data?.shipment_track_activities?.length > 0 ? (
                    <div className="space-y-6">
                        <div className="relative pl-6 pb-2 border-l-2 border-gray-200">
                            {localTrackingData.tracking_data.shipment_track_activities.map((activity: any, index: number) => (
                            <div key={index} className="relative mb-6">
                                <div className="absolute -left-[29px] top-0 h-6 w-6 rounded-full bg-greenComponent text-white flex items-center justify-center z-10 ring-4 ring-white"> <PackageCheck className="h-3 w-3" /> </div>
                                <div className="ml-4"> <div className="bg-gray-50 p-3 rounded-md border border-gray-100"> <p className="font-medium text-sm">{activity.status}</p> <p className="text-xs text-gray-600 mt-1">{activity.activity}</p> <p className="text-xs text-gray-500 mt-1">{formatDate(activity.date)}</p> </div> </div>
                            </div>
                            ))}
                        </div>
                        <button onClick={handleSyncStatus} disabled={localLoading['syncOrderStatus']} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors w-full flex items-center justify-center text-sm disabled:opacity-50">
                            <RefreshCw className={`h-4 w-4 mr-2 ${localLoading['syncOrderStatus'] ? 'animate-spin' : ''}`} /> Sync Status
                        </button>
                    </div>
                 ) : currentAWB ? (
                    <div className="bg-gray-50 p-4 rounded-md text-center text-sm"> <p className="text-gray-500">No tracking history found yet.</p> </div>
                 ) : null}
            </div>
        )}

        {/* Actions Tab */}
        {activeTab === 'actions' && (
            <div className={`p-4 space-y-4 ${isAnyActionLoading ? 'opacity-50 pointer-events-none' : ''}`}>
            {/* --- Package Dimensions Input (Shows if order not in Shiprocket) --- */}
            {!isInShiprocket && (
                  <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mb-4">
                      <h4 className="font-medium flex items-center text-blue-800 text-sm mb-3"> <Box className="h-4 w-4 mr-2" /> Package Details </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {/* Weight */}
                          <div>
                              <label htmlFor="weight" className="block text-xs font-medium text-gray-600 mb-1">Weight (kg)*</label>
                              <div className="relative">
                                  <Scale size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"/>
                                  <input id="weight" name="weight" type="text" value={packageInputs.weight} onChange={handlePackageInputChange} placeholder="e.g., 0.5" required className="w-full pl-7 pr-2 py-1 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
                              </div>
                          </div>
                          {/* Length */}
                          <div>
                              <label htmlFor="length" className="block text-xs font-medium text-gray-600 mb-1">Length (cm)*</label>
                              <div className="relative">
                                  <Ruler size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"/>
                                  <input id="length" name="length" type="text" value={packageInputs.length} onChange={handlePackageInputChange} placeholder="e.g., 10" required className="w-full pl-7 pr-2 py-1 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
                              </div>
                          </div>
                           {/* Breadth */}
                           <div>
                              <label htmlFor="breadth" className="block text-xs font-medium text-gray-600 mb-1">Breadth (cm)*</label>
                              <div className="relative">
                                  <Ruler size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 rotate-90"/>
                                  <input id="breadth" name="breadth" type="text" value={packageInputs.breadth} onChange={handlePackageInputChange} placeholder="e.g., 10" required className="w-full pl-7 pr-2 py-1 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
                              </div>
                          </div>
                          {/* Height */}
                          <div>
                              <label htmlFor="height" className="block text-xs font-medium text-gray-600 mb-1">Height (cm)*</label>
                              <div className="relative">
                                  <Ruler size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"/>
                                  <input id="height" name="height" type="text" value={packageInputs.height} onChange={handlePackageInputChange} placeholder="e.g., 10" required className="w-full pl-7 pr-2 py-1 border border-gray-300 rounded-md text-xs focus:ring-1 focus:ring-blue-500 focus:border-blue-500"/>
                              </div>
                          </div>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">*Required to create Shiprocket order.</p>
                  </div>
              )}
           {/* --- End Package Dimensions Input --- */}

             {/* Action Buttons Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Box 1: Create Order */}
                <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                    <h4 className="font-medium flex items-center text-gray-700 text-sm mb-2"> <FileUp className="h-4 w-4 mr-1 text-green-600" /> 1. Create Order </h4>
                    <p className="text-xs text-gray-600 mb-3"> Push details & dimensions to Shiprocket. </p>
                    <button onClick={handleCreateOrder} disabled={isInShiprocket || localLoading['createShiprocketOrder']} className={`px-3 py-1.5 text-xs text-white bg-green rounded-md w-full flex items-center justify-center ${ isInShiprocket ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700' } disabled:opacity-50`}>
                        {localLoading['createShiprocketOrder'] ? <Loader2 className="h-4 w-4 animate-spin"/> : (isInShiprocket ? 'Order Created' : 'Create in Shiprocket')}
                    </button>
                    {isInShiprocket && <p className="mt-1 text-xs text-gray-700">SR Order ID: {order.shiprocketOrderId}</p>}
                </div>

                {/* Box 2: Generate AWB */}
                <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                    <h4 className="font-medium flex items-center text-gray-700 text-sm mb-2"> <Tag className="h-4 w-4 mr-1 text-blue-600" /> 2. Assign Courier & AWB </h4>
                    <div className="flex items-center gap-2 mb-3">
                    <input type="number" placeholder="Courier ID" value={courierInputId} onChange={(e) => setCourierInputId(e.target.value)} className="flex-1 p-1.5 border rounded-md text-xs" disabled={!isInShiprocket || hasAWB} />
                    <button onClick={handleGenerateAWB} disabled={!isInShiprocket || hasAWB || localLoading['generateAWB']} className={`px-3 py-1.5 text-xs text-white bg-green rounded-md whitespace-nowrap ${ !isInShiprocket || hasAWB ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700' } disabled:opacity-50`}>
                        {localLoading['generateAWB'] ? <Loader2 className="h-4 w-4 animate-spin"/> : 'Generate AWB'}
                    </button>
                    </div>
                    <p className="text-xs text-gray-500"> {hasAWB ? `AWB: ${currentAWB}` : !isInShiprocket ? 'Create order first.' : 'Requires Courier ID.'} </p>
                </div>

                 {/* Box 3: Generate Label */}
                <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                    <h4 className="font-medium flex items-center text-gray-700 text-sm mb-2"> <Download className="h-4 w-4 mr-1 text-purple-600" /> 3. Generate Label </h4>
                    <p className="text-xs text-gray-600 mb-3"> Download shipping label (Requires AWB). </p>
                    <button onClick={handleGenerateLabel} disabled={!hasAWB || localLoading['generateLabel']} className={`px-3 py-1.5 text-xs text-white bg-green rounded-md w-full flex items-center justify-center ${ !hasAWB ? 'bg-gray-400 cursor-not-allowed' : 'bg-purple-600 hover:bg-purple-700' } disabled:opacity-50`}>
                        {localLoading['generateLabel'] ? <Loader2 className="h-4 w-4 animate-spin"/> : 'Download Label'}
                    </button>
                </div>

                 {/* Box 4: Generate Invoice */}
                <div className="bg-gray-50 p-3 rounded-md border border-gray-100">
                    <h4 className="font-medium flex items-center text-gray-700 text-sm mb-2"> <FileText className="h-4 w-4 mr-1 text-orange-600" /> 4. Generate Invoice </h4>
                    <p className="text-xs text-gray-600 mb-3"> Download shipping invoice (Requires SR Order). </p>
                    <button onClick={handleGenerateInvoice} disabled={!isInShiprocket || localLoading['generateInvoice']} className={`px-3 py-1.5 text-xs text-white bg-green rounded-md w-full flex items-center justify-center ${ !isInShiprocket ? 'bg-gray-400 cursor-not-allowed' : 'bg-orange-600 hover:bg-orange-700' } disabled:opacity-50`}>
                        {localLoading['generateInvoice'] ? <Loader2 className="h-4 w-4 animate-spin"/> : 'Download Invoice'}
                    </button>
                </div>
            </div>

             {/* Cancel Order */}
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button onClick={handleCancelOrder} disabled={!isInShiprocket || localLoading['cancelOrder'] || order?.status === 'Cancelled'} className={`px-4 py-2 rounded-md text-white bg-green text-sm ${ !isInShiprocket || order?.status === 'Cancelled' ? 'bg-gray-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700' } disabled:opacity-50`}>
                {localLoading['cancelOrder'] ? <Loader2 className="h-4 w-4 animate-spin"/> : 'Cancel Order in Shiprocket'}
              </button>
               {order?.status === 'Cancelled' && ( <p className="mt-2 text-xs text-red-600">Order already cancelled.</p> )}
               {!isInShiprocket && ( <p className="mt-2 text-xs text-gray-500">Create order first to cancel.</p> )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ShiprocketPanel;