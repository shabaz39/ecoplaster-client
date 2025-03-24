import { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { CREATE_PAYMENT_ORDER, VERIFY_PAYMENT, HANDLE_PAYMENT_FAILURE } from '../constants/queries/paymentQueries';
import { toast } from 'react-toastify';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';

declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  };
}

export function usePayment() {
  const { data: session } = useSession();
  const router = useRouter();
  const { clearCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const [isRazorpayReady, setIsRazorpayReady] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'idle' | 'processing' | 'success' | 'failed'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // GraphQL mutations
  const [createPaymentOrder] = useMutation(CREATE_PAYMENT_ORDER);
  const [verifyPayment] = useMutation(VERIFY_PAYMENT);
  const [handlePaymentFailure] = useMutation(HANDLE_PAYMENT_FAILURE);

  // Load the Razorpay script
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!window.Razorpay) {
      setIsLoading(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      script.onload = () => {
        console.log('Razorpay script loaded');
        setIsRazorpayReady(true);
        setIsLoading(false);
      };
      script.onerror = () => {
        console.error('Failed to load Razorpay script');
        setIsLoading(false);
        toast.error('Payment gateway failed to load. Please try again later.');
      };
      document.body.appendChild(script);
    } else {
      setIsRazorpayReady(true);
    }
  }, []);

  // Initialize payment
  const initializePayment = async (orderId: string, amount: number, orderItems: any[]) => {
    if (!isRazorpayReady) {
      toast.error('Payment gateway is not ready. Please try again.');
      return;
    }

    if (!session?.user?.id) {
      toast.error('Please sign in to continue with payment.');
      return;
    }

    try {
      setPaymentStatus('processing');
      setIsLoading(true);

      // Create payment order
      const { data } = await createPaymentOrder({
        variables: {
          input: {
            orderId,
            userId: session.user.id,
            amount,
            currency: 'INR',
            notes: {
              orderItems: JSON.stringify(orderItems),
            },
          },
        },
      });

      if (!data || !data.createPaymentOrder) {
        throw new Error('Failed to create payment order');
      }

      const paymentOrderData = data.createPaymentOrder;
      console.log('Payment order created:', paymentOrderData);

      // Configure Razorpay options
      const options: RazorpayOptions = {
        key: paymentOrderData.key,
        amount: paymentOrderData.amount * 100, // Convert to paise
        currency: paymentOrderData.currency,
        name: 'Ecoplaster',
        description: `Payment for Order #${orderId}`,
        order_id: paymentOrderData.razorpayOrderId,
        prefill: {
          name: session.user.name || '',
          email: session.user.email || '',
          contact: '',
        },
        theme: {
          color: '#10b981', // newgreensecond color
        },
      };

      // Initialize Razorpay checkout
      const razorpay = new window.Razorpay(options);

      // Handle payment success
      razorpay.on('payment.success', async (response: any) => {
        await handlePaymentSuccess(response);
      });

      // Handle payment failure
      razorpay.on('payment.failed', async (response: any) => {
        await handlePaymentFailure({
          variables: {
            input: {
              razorpayOrderId: response.error.metadata.order_id,
              errorCode: response.error.code,
              errorDescription: response.error.description,
            },
          },
        });
        
        setPaymentStatus('failed');
        setErrorMessage(response.error.description || 'Payment failed');
        setIsLoading(false);
      });

      // Open Razorpay checkout modal
      razorpay.open();
      
      // Handle modal dismiss
      razorpay.on('payment.cancel', () => {
        setPaymentStatus('idle');
        setIsLoading(false);
      });

    } catch (error) {
      console.error('Payment initialization error:', error);
      setPaymentStatus('failed');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to initialize payment');
      setIsLoading(false);
      toast.error('Payment initialization failed. Please try again.');
    }
  };

  // Handle successful payment
  const handlePaymentSuccess = async (response: any) => {
    try {
      const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
      
      const { data } = await verifyPayment({
        variables: {
          input: {
            razorpayOrderId: razorpay_order_id,
            razorpayPaymentId: razorpay_payment_id,
            razorpaySignature: razorpay_signature,
          },
        },
      });

      if (data?.verifyPayment) {
        setPaymentStatus('success');
        clearCart();
        toast.success('Payment successful!');
        
        // Redirect to success page
        const orderId = data.verifyPayment.orderId;
        setTimeout(() => {
          router.push(`/payment/success?orderId=${orderId}`);
        }, 1000);
      } else {
        throw new Error('Payment verification failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setPaymentStatus('failed');
      setErrorMessage('Payment verification failed');
      toast.error('Payment verification failed. Please contact support.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    initializePayment,
    isLoading,
    isRazorpayReady,
    paymentStatus,
    errorMessage,
    setPaymentStatus,
  };
}