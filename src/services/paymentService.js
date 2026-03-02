/**
 * Razorpay Payment Service
 * 
 * Logic to communicate with the Flask backend and the Razorpay SDK.
 */

const BACKEND_URL = 'http://localhost:5000'; // Update this for production

/**
 * Initialize a Razorpay Payment
 * @param {Object} options - { amount, customerName, customerEmail, customerPhone }
 * @returns {Promise} - Resolves with the payment confirmation or rejects with error
 */
export const initiatePayment = async ({ amount, customerName, customerEmail, customerPhone }) => {
  return new Promise(async (resolve, reject) => {
    try {
      // 1. Create Order on our Flask Backend
      const orderResponse = await fetch(`${BACKEND_URL}/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount, currency: 'INR' }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // 2. Configure Razorpay Options
      const rzpOptions = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'YOUR_KEY_ID', // Better to get from backend or env
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Saga",
        description: "Jewelry Purchase",
        image: "/SAGA LOGO.PNG",
        order_id: orderData.id,
        handler: async function (response) {
          // 3. Verify Payment on our Flask Backend
          try {
            const verifyResponse = await fetch(`${BACKEND_URL}/verify-payment`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyResponse.ok && verifyData.status === 'success') {
              resolve({
                success: true,
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id
              });
            } else {
              reject(new Error(verifyData.message || 'Signature verification failed'));
            }
          } catch (err) {
            reject(err);
          }
        },
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
        },
        theme: {
          color: "#FB7010", // SAGA brand color
        },
        modal: {
          ondismiss: function() {
            reject(new Error('Payment cancelled by user'));
          }
        }
      };

      // 4. Open Razorpay Checkouut
      const rzp = new window.Razorpay(rzpOptions);
      rzp.open();

    } catch (error) {
      console.error("Payment initiation error:", error);
      reject(error);
    }
  });
};
