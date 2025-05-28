async function handler({ packageType }) {
  const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

  if (!packageType) {
    return { error: "Package type is required" };
  }

  try {
    const prices = {
      starter: {
        amount: 700,
        name: "Starter Access",
        description: "Monthly Bot Access",
      },
      server: {
        amount: 1999,
        name: "Server License",
        description: "Premium Features",
      },
      gameNight: {
        amount: 3000,
        name: "Game Night",
        description:
          "Game Night Booking (up to 30 players) - Includes Prize Pool",
      },
    };

    const packageInfo = prices[packageType];
    if (!packageInfo) {
      return { error: "Invalid package type" };
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: packageInfo.name,
              description: packageInfo.description,
            },
            unit_amount: packageInfo.amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.BASE_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.BASE_URL}/pricing`,
    });

    await sql`
      INSERT INTO payment_sessions 
      (session_id, user_id, username, type, status)
      VALUES 
      (${session.id}, ${
      session.client_reference_id || "anonymous"
    }, 'anonymous', ${packageType}, 'pending')
    `;

    return {
      url: session.url,
    };
  } catch (error) {
    return {
      error: "Failed to create checkout session",
      details: error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}