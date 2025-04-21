import React from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { Box, Button, Typography } from '@mui/material';

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement!,
    });

    if (error) {
      console.error(error);
      alert('Payment failed: ' + error.message);
    } else {
      alert('Payment successful!');
      // Call your backend to process the payment
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <Typography variant="h5" sx={{ marginBottom: 2 }}>
        Enter Payment Details
      </Typography>
      <CardElement />
      <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ marginTop: 3 }}
      >
        Pay
      </Button>
    </Box>
  );
};

export default CheckoutForm;