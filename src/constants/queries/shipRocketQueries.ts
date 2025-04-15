// src/constants/queries/shipRocketQueries.ts

import { gql } from '@apollo/client';

// ==================================
// SHIPROCKET MUTATIONS
// ==================================

export const CREATE_SHIPROCKET_ORDER = gql`
  mutation CreateShiprocketOrder($orderId: ID!, $packageDetails: ShiprocketPackageInput) {
    createShiprocketOrder(orderId: $orderId, packageDetails: $packageDetails) {
      success
      message
      shiprocketOrderId
      shipmentId
      awbCode
      courierName
    }
  }
`;

export const GENERATE_SHIPROCKET_AWB = gql`
  mutation GenerateShiprocketAWB($orderId: ID!, $courierId: Int!) {
    generateShiprocketAWB(orderId: $orderId, courierId: $courierId) {
      success
      message
      awbCode
    }
  }
`;

export const GENERATE_SHIPROCKET_LABEL = gql`
  mutation GenerateShiprocketLabel($orderId: ID!) {
    generateShiprocketLabel(orderId: $orderId) {
      success
      message
      labelUrl
    }
  }
`;

export const GENERATE_SHIPROCKET_INVOICE = gql`
  mutation GenerateShiprocketInvoice($orderId: ID!) {
    generateShiprocketInvoice(orderId: $orderId) {
      success
      message
      invoiceUrl
    }
  }
`;

export const CANCEL_SHIPROCKET_ORDER = gql`
  mutation CancelShiprocketOrder($orderId: ID!) {
    cancelShiprocketOrder(orderId: $orderId) {
      success
      message
    }
  }
`;

export const CREATE_SHIPROCKET_RETURN = gql`
  mutation CreateShiprocketReturn($orderId: ID!, $pickupAddress: ShiprocketReturnPickupInput!) {
    createShiprocketReturn(orderId: $orderId, pickupAddress: $pickupAddress) {
      success
      message
      returnOrderId
      returnShipmentId
    }
  }
`;

export const SYNC_ORDER_STATUS_FROM_SHIPROCKET = gql`
  mutation SyncOrderStatusFromShiprocket($orderId: ID!) {
    syncOrderStatusFromShiprocket(orderId: $orderId) {
      success
      message
      currentStatus
      trackingDetails {
        date
        status
        activity
        location
      }
    }
  }
`;

// ==================================
// SHIPROCKET QUERIES
// ==================================

export const TRACK_SHIPMENT = gql`
  query TrackShipment($awbCode: String!) {
    trackShipment(awbCode: $awbCode) {
      tracking_data {
        track_status
        shipment_status
        shipment_track_activities {
          date
          status
          activity
          location
        }
      }
    }
  }
`;

export const GET_SHIPROCKET_DISCREPANCIES = gql`
  query GetShiprocketDiscrepancies {
    getShiprocketDiscrepancies {
      status
      data {
        id
        awb
        courier_name
        charged_weight
        dead_weight
        volumetric_weight
        length
        height
        breadth
        remittance_amount
        date
      }
      upper_fold_text
      lower_fold_text
    }
  }
`;

export const GET_SHIPROCKET_PICKUP_LOCATIONS = gql`
  query GetShiprocketPickupLocations {
    getShiprocketPickupLocations {
      data {
        id
        pickup_location
        name
        email
        phone
        address
        address_2
        city
        state
        country
        pin_code
        status
      }
    }
  }
`;

export const CHECK_SHIPROCKET_COURIER_SERVICEABILITY = gql`
  query CheckShiprocketCourierServiceability(
    $pickupPostcode: String!, 
    $deliveryPostcode: String!, 
    $weight: Float!, 
    $cod: Boolean = false
  ) {
    checkShiprocketCourierServiceability(
      pickupPostcode: $pickupPostcode, 
      deliveryPostcode: $deliveryPostcode, 
      weight: $weight, 
      cod: $cod
    ) {
      data {
        available_courier_companies {
          courier_company_id
          name
          rating
          delivery_performance
          etd
          charge
          freight_charge
          cod_charges
          is_surface
          max_weight
        }
      }
    }
  }
`;

// ==================================
// TypeScript Interfaces
// ==================================

export interface ShiprocketPackageInput {
  weight: number;
  length?: number;
  breadth?: number;
  height?: number;
}

export interface ShiprocketReturnPickupInput {
  pickup_location: string;
  address: string;
  city: string;
  state: string;
  country: string;
  pin_code: string;
  phone: string;
  name: string;
}

export interface ShiprocketOrderResponse {
  success: boolean;
  message: string;
  shiprocketOrderId?: string;
  shipmentId?: string;
  awbCode?: string;
  courierName?: string;
}

export interface ShiprocketAWBResponse {
  success: boolean;
  message: string;
  awbCode?: string;
}

export interface ShiprocketLabelResponse {
  success: boolean;
  message: string;
  labelUrl?: string;
}

export interface ShiprocketInvoiceResponse {
  success: boolean;
  message: string;
  invoiceUrl?: string;
}

export interface ShiprocketCancelResponse {
  success: boolean;
  message: string;
}

export interface ShiprocketReturnResponse {
  success: boolean;
  message: string;
  returnOrderId?: string;
  returnShipmentId?: string;
}

export interface ShiprocketOrderStatusSync {
  success: boolean;
  message: string;
  currentStatus?: string;
  trackingDetails?: ShiprocketTrackingActivity[];
}

export interface ShiprocketTrackingActivity {
  date?: string;
  status?: string;
  activity?: string;
  location?: string;
}

export interface ShiprocketTrackingDetails {
  track_status?: number;
  shipment_status?: number;
  shipment_track_activities?: ShiprocketTrackingActivity[];
}

export interface ShiprocketTrackingResponse {
  tracking_data?: ShiprocketTrackingDetails;
}

export interface ShiprocketDiscrepancy {
  id?: string;
  awb?: string;
  courier_name?: string;
  charged_weight?: number;
  dead_weight?: number;
  volumetric_weight?: number;
  length?: number;
  height?: number;
  breadth?: number;
  remittance_amount?: number;
  date?: string;
}

export interface ShiprocketDiscrepancyResponse {
  status?: number;
  data?: ShiprocketDiscrepancy[];
  upper_fold_text?: string;
  lower_fold_text?: string;
}

export interface ShiprocketPickupLocation {
  id: number;
  pickup_location: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  address_2?: string;
  city: string;
  state: string;
  country: string;
  pin_code: string;
  status: number;
}

export interface ShiprocketPickupLocationsResponse {
  data: ShiprocketPickupLocation[];
}

export interface ShiprocketCourierServiceability {
  courier_company_id: number;
  name: string;
  rating?: number;
  delivery_performance?: string;
  etd: string;
  charge: number;
  freight_charge: number;
  cod_charges: number;
  is_surface: string;
  max_weight: string;
}

export interface ShiprocketCourierServiceabilityData {
  available_courier_companies: ShiprocketCourierServiceability[];
}

export interface ShiprocketCourierServiceabilityResponse {
  data?: ShiprocketCourierServiceabilityData;
}