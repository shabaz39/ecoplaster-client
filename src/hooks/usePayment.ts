// src/hooks/usePayment.ts
import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useLazyQuery } from '@apollo/client';
import { toast } from 'react-toastify';
import {
  CREATE_PAYMENT_ORDER,
  VERIFY_PAYMENT,
  HANDLE_PAYMENT_FAILURE
} from '../constants/queries/paymentQueries';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export const usePayment = () => {
  const router = useRouter();
  const [paymentStatus, setPaymentStatus] = useState<
    'idle' | 'loading' | 'processing' | 'success' | 'failed'
  >('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Mutations
  const [createPaymentOrder] = useMutation(CREATE_PAYMENT_ORDER);
  const [verifyPayment] = useMutation(VERIFY_PAYMENT);
  const [handlePaymentFailure] = useMutation(HANDLE_PAYMENT_FAILURE);

  // Load Razorpay script
  const loadRazorpayScript = useCallback(() => {
    return new Promise<void>((resolve, reject) => {
      if (window.Razorpay) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Razorpay SDK'));
      document.body.appendChild(script);
    });
  }, []);

  // Initialize payment flow
  const initiatePayment = useCallback(
    async ({
      orderId,
      userId,
      amount,
      name,
      email,
      contact,
      notes = {},
      onSuccess,
      onFailure
    }: {
      orderId: string;
      userId: string;
      amount: number;
      name?: string;
      email?: string;
      contact?: string;
      notes?: Record<string, string>;
      onSuccess?: (data: any) => void;
      onFailure?: (error: any) => void;
    }) => {
      try {
        setPaymentStatus('loading');
        
        // Load Razorpay script if not already loaded
        await loadRazorpayScript();

        // Create payment order
        const { data } = await createPaymentOrder({
          variables: {
            input: {
              orderId,
              userId,
              amount,
              currency: 'INR',
              notes
            }
          }
        });

        if (!data || !data.createPaymentOrder) {
          throw new Error('Failed to create payment order');
        }

        const paymentOrderData = data.createPaymentOrder;
        
        // Initialize Razorpay checkout
        const options = {
          key: paymentOrderData.key,
          amount: paymentOrderData.amount * 100, // Amount is in paise
          currency: paymentOrderData.currency,
          name: 'Ecoplaster',
          description: `Payment for Order #${orderId}`,
          order_id: paymentOrderData.razorpayOrderId,
          prefill: {
            name: name || '',
            email: email || '',
            contact: contact || ''
          },
          notes: {
            ...notes,
            orderId,
            userId
          },
          theme: {
            color: '#10b981' // newgreensecond color
          },
          modal: {
            ondismiss: function() {
              setPaymentStatus('idle');
              setErrorMessage(null);
            }
          },
          handler: async function(response: any) {
            try {
              setPaymentStatus('processing');
              
              // Verify payment
              const verificationResult = await verifyPayment({
                variables: {
                  input: {
                    razorpayOrderId: response.razorpay_order_id,
                    razorpayPaymentId: response.razorpay_payment_id,
                    razorpaySignature: response.razorpay_signature
                  }
                }
              });

              if (
                verificationResult.data &&
                verificationResult.data.verifyPayment
              ) {
                setPaymentStatus('success');
                toast.success('Payment successful!');
                
                if (onSuccess) {
                  onSuccess(verificationResult.data.verifyPayment);
                } else {
                  // Default success behavior
                  router.push(`/payment/success?orderId=${orderId}`);
                }
              } else {
                throw new Error('Payment verification failed');
              }
            } catch (error) {
              setPaymentStatus('failed');
              setErrorMessage(
                error instanceof Error ? error.message : 'Payment verification failed'
              );
              
              if (onFailure) {
                onFailure(error);
              }
            }
          }
        };

        const razorpayInstance = new window.Razorpay(options);
        
        // Handle payment failures
        razorpayInstance.on('payment.failed', async function(response: any) {
          try {
            await handlePaymentFailure({
              variables: {
                input: {
                  razorpayOrderId: response.error.metadata.order_id,
                  errorCode: response.error.code,
                  errorDescription: response.error.description
                }
              }
            });
            
            setPaymentStatus('failed');
            setErrorMessage(response.error.description || 'Payment failed');
            
            if (onFailure) {
              onFailure(response.error);
            }
          } catch (error) {
            console.error('Error handling payment failure:', error);
            setPaymentStatus('failed');
            setErrorMessage('Payment failed');
            
            if (onFailure) {
              onFailure(error);
            }
          }
        });

        // Open Razorpay checkout modal
        razorpayInstance.open();
        return razorpayInstance;
      } catch (error) {
        console.error('Payment initiation error:', error);
        setPaymentStatus('failed');
        setErrorMessage(
          error instanceof Error ? error.message : 'Failed to initiate payment'
        );
        
        if (onFailure) {
          onFailure(error);
        }
        return null;
      }
    },
    [createPaymentOrder, handlePaymentFailure, loadRazorpayScript, router, verifyPayment]
  );

  // Reset payment state
  const resetPaymentState = useCallback(() => {
    setPaymentStatus('idle');
    setErrorMessage(null);
  }, []);

  return {
    paymentStatus,
    errorMessage,
    initiatePayment,
    resetPaymentState
  };
};