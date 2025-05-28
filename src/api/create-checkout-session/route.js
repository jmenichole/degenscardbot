async function handler({ priceId, amount, description }) {
  if (!priceId) {
    return { error: "Missing required parameters" };
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    let sessionConfig = {
      mode: priceId === "price_game_night" ? "payment" : "subscription",
      success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/cancel`,
      metadata: {
        description: description || "",
      },
    };

    if (priceId === "price_game_night") {
      sessionConfig.line_items = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Game Night Booking",
              description: "Includes $15 Prize Pool for up to 30 players",
            },
            unit_amount: 3000, // $30.00
          },
          quantity: 1,
        },
      ];
    } else if (priceId === "price_monthly") {
      sessionConfig.line_items = [
        {
          price: process.env.STRIPE_MONTHLY_PRICE_ID,
          quantity: 1,
        },
      ];
    } else if (priceId === "price_lifetime") {
      sessionConfig.line_items = [
        {
          price: process.env.STRIPE_LIFETIME_PRICE_ID,
          quantity: 1,
        },
      ];
    } else {
      return { error: "Invalid price ID" };
    }

    const session = await stripe.checkout.sessions.create(sessionConfig);

    await sql`
      INSERT INTO payment_sessions (
        session_id,
        type,
        status
      ) VALUES (
        ${session.id},
        ${priceId},
        'pending'
      )
    `;

    return {
      url: session.url,
    };
  } catch (error) {
    console.error("Stripe session creation error:", error);
    return { error: "Failed to create checkout session" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}