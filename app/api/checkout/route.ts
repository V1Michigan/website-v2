import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { checkoutSchema } from "@/lib/validations";
import { checkoutRateLimiter, getClientIdentifier } from "@/lib/rate-limit";
import { ZodError } from "zod";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-12-15.clover",
});

export async function POST(request: NextRequest) {
  try {
    const identifier = getClientIdentifier(request);
    const rateLimit = checkoutRateLimiter.check(identifier);
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: "Rate limit exceeded. Please try again later.",
          retryAfter: Math.ceil((rateLimit.resetTime - Date.now()) / 1000)
        },
        { 
          status: 429,
          headers: {
            "X-RateLimit-Limit": "10",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": new Date(rateLimit.resetTime).toISOString(),
          }
        }
      );
    }

    const body = await request.json();
    const validatedData = checkoutSchema.parse(body);
    const { items } = validatedData;

    const origin = request.headers.get("origin") || "http://localhost:3000";

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map(
      (item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.product.name,
            description: `${item.size} / ${item.color}`,
            images: item.product.image.startsWith("http")
              ? [item.product.image]
              : [`${origin}${item.product.image}`],
          },
          unit_amount: item.product.price,
        },
        quantity: item.quantity,
      })
    );

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      allow_promotion_codes: true, // Enable Stripe's promotion code input
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: 0, // Free shipping
              currency: "usd",
            },
            display_name: "Hand Delivery",
            delivery_estimate: {
              minimum: {
                unit: "business_day",
                value: 14,
              },
              maximum: {
                unit: "business_day",
                value: 30,
              },
            },
          },
        },
      ],
      success_url: `${origin}/store/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/store/cancel`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid cart data", details: error.errors },
        { status: 400 }
      );
    }
    console.error("Stripe checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

