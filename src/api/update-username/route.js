async function handler({ username }) {
  if (!username) {
    return { error: "Username is required" };
  }

  const session = getSession();
  if (!session?.user?.id) {
    return { error: "Authentication required" };
  }

  // Validate username format
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!usernameRegex.test(username)) {
    return {
      error:
        "Username must be 3-20 characters and contain only letters, numbers, and underscores",
    };
  }

  try {
    // Check if username is already taken
    const existingUser = await sql`
      SELECT id FROM auth_users 
      WHERE username = ${username} 
      AND id != ${session.user.id}
    `;

    if (existingUser.length > 0) {
      return { error: "Username is already taken" };
    }

    // Update username
    await sql`
      UPDATE auth_users 
      SET username = ${username}
      WHERE id = ${session.user.id}
    `;

    return {
      success: true,
      username,
    };
  } catch (error) {
    console.error("Error updating username:", error);
    return { error: "Failed to update username" };
  }
}
export async function POST(request) {
  return handler(await request.json());
}