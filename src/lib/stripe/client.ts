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

// Price for single template (in cents)
export const SINGLE_TEMPLATE_PRICE_CENTS = 50; // $0.50 USD (testing - Stripe minimum)

// Price for lifetime access (in cents)
export const LIFETIME_PRICE_CENTS = 50; // $0.50 USD (testing - Stripe minimum)

// Legacy export for backwards compatibility
export const INVITE_PRICE_CENTS = SINGLE_TEMPLATE_PRICE_CENTS; // $1.99

// Product names shown in Stripe checkout
export const PRODUCT_NAME = "Premium Valentine's Invite";
export const PRODUCT_DESCRIPTION = "Your invite stays active for 30 days";

export const LIFETIME_PRODUCT_NAME = "Lifetime Access - All Templates";
export const LIFETIME_PRODUCT_DESCRIPTION = "Access all templates forever, including future designs";
