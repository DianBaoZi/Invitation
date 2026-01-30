import Stripe from "stripe";

// Lazy-loaded Stripe client to avoid build-time errors
let stripeInstance: Stripe | null = null;

export function getStripe(): Stripe {
  if (!stripeInstance) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not configured");
    }
    stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-01-28.clover",
      typescript: true,
    });
  }
  return stripeInstance;
}

// For backwards compatibility
export const stripe = {
  get checkout() {
    return getStripe().checkout;
  },
  get webhooks() {
    return getStripe().webhooks;
  },
};

// Price for premium invites (in cents)
export const INVITE_PRICE_CENTS = 99; // $0.99 USD

// Product name shown in Stripe checkout
export const PRODUCT_NAME = "Premium Valentine's Invite";
export const PRODUCT_DESCRIPTION = "Your invite stays active for 30 days";
