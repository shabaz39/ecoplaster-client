// src/contexts/ShiprocketContext.tsx
"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useLazyQuery, useMutation, ApolloError } from '@apollo/client';
import {
  TRACK_SHIPMENT,
  GET_SHIPROCKET_DISCREPANCIES,
  GET_SHIPROCKET_PICKUP_LOCATIONS,
  CHECK_SHIPROCKET_COURIER_SERVICEABILITY,
} from '../constants/queries/shipRocketQueries'; // Adjust path
import {
  CREATE_SHIPROCKET_ORDER, // Make sure this mutation expects packageDetails in GQL schema
  GENERATE_SHIPROCKET_AWB,
  GENERATE_SHIPROCKET_LABEL,
  GENERATE_SHIPROCKET_INVOICE,
  CANCEL_SHIPROCKET_ORDER,
  CREATE_SHIPROCKET_RETURN,
  SYNC_ORDER_STATUS_FROM_SHIPROCKET,
} from '../constants/queries/shipRocketQueries'; // Adjust path
import { toast } from 'react-toastify';

// Define type for the package details input expected by the mutation
// Matches ShiprocketPackageInput in GQL schema
interface ShiprocketPackageDetailsInput {
    weight: number;
    length?: number | null;
    breadth?: number | null;
    height?: number | null;
}

// Define types for the context
type ShiprocketContextType = {
  loading: boolean; // General loading state for the context (e.g., initial load)
  error: ApolloError | Error | null; // General error state for the context
  pickupLocations: any[];
  trackingData: any | null; // Stores result of trackShipment
  availableCouriers: any[]; // Stores result of checkServiceability
  // --- Updated function signature ---
  createShiprocketOrder: (orderId: string, packageDetails?: ShiprocketPackageDetailsInput | null) => Promise<any>;
  // ----------------------------------
  generateAWB: (orderId: string, courierId: number) => Promise<any>;
  generateLabel: (orderId: string) => Promise<any>;
  generateInvoice: (orderId: string) => Promise<any>;
  cancelOrder: (orderId: string) => Promise<any>;
  createReturn: (orderId: string, pickupAddress: any) => Promise<any>;
  syncOrderStatus: (orderId: string) => Promise<any>;
  trackShipment: (awbCode: string) => Promise<any>;
  checkServiceability: (pickupPostcode: string, deliveryPostcode: string, weight: number, cod: boolean) => Promise<any>;
  getDiscrepancies: () => Promise<any>;
  loadPickupLocations: () => Promise<any>;
};

// Create the context
const ShiprocketContext = createContext<ShiprocketContextType | undefined>(undefined);

// Create the Provider component
export const ShiprocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false); // General loading for context init, etc.
  const [error, setError] = useState<ApolloError | Error | null>(null); // General context error
  const [pickupLocations, setPickupLocations] = useState<any[]>([]);
  const [trackingData, setTrackingData] = useState<any | null>(null);
  const [availableCouriers, setAvailableCouriers] = useState<any[]>([]);

  // Generic handler for API calls (using mutations/queries passed to it)
  // Now returns the actual data part or throws error
  const handleApiCall = async <TData, TVariables>(
    apiFunc: (options: { variables: TVariables }) => Promise<{ data?: TData | null }>,
    variables: TVariables,
    actionName: string // For logging/error messages
  ): Promise<TData | null> => {
    // Note: We don't set the general context loading/error here,
    // as individual components handle their specific loading/error states.
    // setError(null); // Clear previous general errors if desired
    try {
      const { data } = await apiFunc({ variables });
      console.log(`${actionName} Response Data:`, data); // Log success data
      return data || null;
    } catch (err) {
      const typedError = err as ApolloError | Error;
      console.error(`Error during ${actionName}:`, typedError);
      // setError(typedError); // Set general context error if needed
      // Re-throw the error so the calling component's onError/catch can handle it
      throw typedError;
    }
  };

  // --- Apollo Hooks ---
  // Queries (useLazyQuery is fine here as they are triggered on demand)
  const [trackShipmentQuery] = useLazyQuery(TRACK_SHIPMENT);
  const [getDiscrepanciesQuery] = useLazyQuery(GET_SHIPROCKET_DISCREPANCIES);
  const [getPickupLocationsQuery] = useLazyQuery(GET_SHIPROCKET_PICKUP_LOCATIONS);
  const [checkServiceabilityQuery] = useLazyQuery(CHECK_SHIPROCKET_COURIER_SERVICEABILITY);

  // Mutations (useMutation is standard)
  const [createShiprocketOrderMutation] = useMutation(CREATE_SHIPROCKET_ORDER);
  const [generateAWBMutation] = useMutation(GENERATE_SHIPROCKET_AWB);
  const [generateLabelMutation] = useMutation(GENERATE_SHIPROCKET_LABEL);
  const [generateInvoiceMutation] = useMutation(GENERATE_SHIPROCKET_INVOICE);
  const [cancelOrderMutation] = useMutation(CANCEL_SHIPROCKET_ORDER);
  const [createReturnMutation] = useMutation(CREATE_SHIPROCKET_RETURN);
  const [syncOrderStatusMutation] = useMutation(SYNC_ORDER_STATUS_FROM_SHIPROCKET);
  // --- End Apollo Hooks ---


  // --- Context Functions ---
  const loadPickupLocations = async () => {
    setLoading(true); // Use context loading for initial load
    setError(null);
    try {
      const result = await handleApiCall(getPickupLocationsQuery, {}, 'loadPickupLocations');
      if (result?.getShiprocketPickupLocations) {
        setPickupLocations(result.getShiprocketPickupLocations.data || []);
      }
      return result?.getShiprocketPickupLocations;
    } catch (err) {
      setError(err as ApolloError | Error); // Set context error on initial load failure
      return null;
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    loadPickupLocations();
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Load once on mount

  const trackShipment = async (awbCode: string) => {
    const result = await handleApiCall(trackShipmentQuery, { awbCode }, 'trackShipment');
    // Update local state for components that might need it directly
    setTrackingData(result?.trackShipment || null);
    return result?.trackShipment; // Return the specific data field
  };

  const getDiscrepancies = async () => {
    const result = await handleApiCall(getDiscrepanciesQuery, {}, 'getDiscrepancies');
    return result?.getShiprocketDiscrepancies;
  };

  const checkServiceability = async (
    pickupPostcode: string, deliveryPostcode: string, weight: number, cod: boolean = false
  ) => {
    const result = await handleApiCall(checkServiceabilityQuery, { pickupPostcode, deliveryPostcode, weight, cod }, 'checkServiceability');
    if (result?.checkShiprocketCourierServiceability?.data) {
        setAvailableCouriers(result.checkShiprocketCourierServiceability.data.available_courier_companies || []);
    } else {
        setAvailableCouriers([]);
    }
    return result?.checkShiprocketCourierServiceability;
  };

  // Updated createShiprocketOrder function
  const createShiprocketOrder = async (orderId: string, packageDetails?: ShiprocketPackageDetailsInput | null) => {
    // Pass packageDetails in the variables object
    const result = await handleApiCall(createShiprocketOrderMutation, { orderId, packageDetails }, 'createShiprocketOrder');
    return result?.createShiprocketOrder;
  };

  const generateAWB = async (orderId: string, courierId: number) => {
    const result = await handleApiCall(generateAWBMutation, { orderId, courierId }, 'generateAWB');
    return result?.generateShiprocketAWB;
  };

  const generateLabel = async (orderId: string) => {
    const result = await handleApiCall(generateLabelMutation, { orderId }, 'generateLabel');
    return result?.generateShiprocketLabel;
  };

  const generateInvoice = async (orderId: string) => {
    const result = await handleApiCall(generateInvoiceMutation, { orderId }, 'generateInvoice');
    return result?.generateShiprocketInvoice;
  };

  const cancelOrder = async (orderId: string) => {
    const result = await handleApiCall(cancelOrderMutation, { orderId }, 'cancelOrder');
    return result?.cancelShiprocketOrder;
  };

  const createReturn = async (orderId: string, pickupAddress: any) => {
     const result = await handleApiCall(createReturnMutation, { orderId, pickupAddress }, 'createReturn');
     return result?.createShiprocketReturn;
  };

  const syncOrderStatus = async (orderId: string) => {
    const result = await handleApiCall(syncOrderStatusMutation, { orderId }, 'syncOrderStatus');
    return result?.syncOrderStatusFromShiprocket;
  };
   // --- End Context Functions ---

  // Context value provided to consumers
  const value: ShiprocketContextType = {
    loading, // General context loading state
    error,   // General context error state
    pickupLocations,
    trackingData,
    availableCouriers,
    createShiprocketOrder,
    generateAWB,
    generateLabel,
    generateInvoice,
    cancelOrder,
    createReturn,
    syncOrderStatus,
    trackShipment,
    checkServiceability,
    getDiscrepancies,
    loadPickupLocations,
  };

  return (
    <ShiprocketContext.Provider value={value}>
      {children}
    </ShiprocketContext.Provider>
  );
};

// Custom hook to use the Shiprocket context
export const useShiprocket = () => {
  const context = useContext(ShiprocketContext);
  if (context === undefined) {
    throw new Error('useShiprocket must be used within a ShiprocketProvider');
  }
  return context;
};