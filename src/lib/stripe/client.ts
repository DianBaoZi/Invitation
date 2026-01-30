import Stripe from "stripe";

// Server-side Stripe client
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});

// Price for premium invites (in cents)
export const INVITE_PRICE_CENTS = 99; // $0.99 USD

// Product name shown in Stripe checkout
export const PRODUCT_NAME = "Premium Valentine's Invite";
export const PRODUCT_DESCRIPTION = "Your invite stays active for 30 days";
