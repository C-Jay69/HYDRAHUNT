
import { loadStripe } from '@stripe/stripe-js';
const STRIPE_PUBLISHABLE_KEY = process.env.STRIPE_PUBLISHABLE_KEY || '';
export const stripePromise = loadStripe(STRIPE_PUBLISHABLE_KEY);

export const createCheckoutSession = async (planOrPrice: string, _customerEmail: string) => {
  const hunter = process.env.HUNTER_PAYMENT_LINK_URL || '';
  const hydra = process.env.HYDRA_PAYMENT_LINK_URL || '';
  const normalized = (planOrPrice || '').toLowerCase();
  const isHunter = normalized.includes('hunter');
  const link = isHunter ? hunter : hydra;
  if (!link) {
    alert("Checkout not configured. Please set HUNTER_PAYMENT_LINK_URL and HYDRA_PAYMENT_LINK_URL in your env.");
    return;
  }
  window.location.href = link;
};
