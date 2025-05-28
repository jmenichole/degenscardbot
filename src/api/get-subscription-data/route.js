async function handler({ userId }) {
  if (!userId) {
    return { error: "User ID is required" };
  }

  try {
    const [subscriptions, bookings] = await sql.transaction([
      sql`
        SELECT s.*, 
               CASE 
                 WHEN s.plan_type = 'lifetime' THEN true
                 WHEN s.status = 'active' THEN true
                 ELSE false
               END as is_active
        FROM subscriptions s
        WHERE s.user_id = ${userId}
        ORDER BY s.created_at DESC
        LIMIT 1
      `,
      sql`
        SELECT *
        FROM game_night_bookings
        WHERE email IN (
          SELECT email 
          FROM auth_users 
          WHERE id = ${userId}
        )
        AND booking_date >= CURRENT_TIMESTAMP
        ORDER BY booking_date ASC
      `,
    ]);

    return {
      subscription: subscriptions[0] || null,
      upcomingBookings: bookings || [],
    };
  } catch (error) {
    return {
      error: "Failed to fetch subscription data",
      details: error.message,
    };
  }
}
export async function POST(request) {
  return handler(await request.json());
}