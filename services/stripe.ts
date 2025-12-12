
import { loadStripe } from '@stripe/stripe-js';

// LIVE Publishable Key provided by user
const STRIPE_PUBLISHABLE_KEY = 'pk_live_51QLMqlR2vdu0rh1pmJMIWuMCvD9bh3vVINpTPhPyKrwyDhJDEQRoH0SuoMb1WgjrEuMZcFOseqnggmjpXToEX2pD005Wa8L14u';

export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export const createCheckoutSession = async (priceId: string, customerEmail: string) => {
  // NOTE: In a real production app, you MUST create the session on your backend 
  // to keep your Secret Key secure. 
  
  // Since this is a demo/frontend-only setup, we cannot securely generate a session 
  // without the Secret Key (which should never be in frontend code).
  
  // For demonstration, we will simulate the redirect or warn the user.
  console.log(`[Stripe] Initiating checkout for ${priceId} / ${customerEmail}`);
  
  // If you had a backend, it would look like this:
  /*
  const response = await fetch('/api/create-checkout-session', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ priceId, email: customerEmail }),
  });
  const session = await response.json();
  const stripe = await stripePromise;
  await stripe?.redirectToCheckout({ sessionId: session.id });
  */

  alert("Checkout Integration: In a production environment, this would redirect to Stripe Checkout.\n\nSince this is a client-side app, we cannot securely use your Secret Key here. Please implement a backend endpoint to create the Stripe Session.");
  return;
};
