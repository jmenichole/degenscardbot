async function handler({ action, gameId, userId, channelId, nsfw }) {
  if (action === "list_games") {
    const games = await sql`
      SELECT 
        g.*,
        bc.text as black_card_text,
        COUNT(DISTINCT gp.id) as player_count,
        json_agg(json_build_object(
          'username', gp.username,
          'score', gp.score,
          'is_czar', gp.user_id = g.czar_user_id
        )) as players,
        (SELECT allow_nsfw FROM server_settings WHERE channel_id = g.channel_id) as nsfw_enabled
      FROM games g
      LEFT JOIN black_cards bc ON bc.id = g.current_black_card
      LEFT JOIN game_players gp ON gp.game_id = g.id
      WHERE g.status IN ('waiting', 'playing')
      GROUP BY g.id, bc.text, g.channel_id
      ORDER BY g.created_at DESC
    `;

    return {
      games: games.rows,
    };
  }

  if (action === "start-round") {
    // Get game and verify enough players
    const gameResult = await sql(
      `
      SELECT g.*, COUNT(DISTINCT gp.id) as player_count,
             (SELECT allow_nsfw FROM server_settings WHERE channel_id = $2) as allow_nsfw
      FROM games g
      JOIN game_players gp ON gp.game_id = g.id
      WHERE g.id = $1 AND g.status = 'waiting'
      GROUP BY g.id
    `,
      [gameId, channelId]
    );

    if (!gameResult.rows.length || gameResult.rows[0].player_count < 2) {
      return { error: "Need at least 2 degenerates to start" };
    }

    // Select random black card based on NSFW settings
    const blackCardResult = await sql(
      `
      SELECT * FROM black_cards 
      WHERE ($1 = false AND nsfw = false) OR $1 = true
      ORDER BY RANDOM() 
      LIMIT 1
    `,
      [gameResult.rows[0].allow_nsfw || false]
    );

    if (!blackCardResult.rows.length) {
      return { error: "No prompts available" };
    }

    // Deal white cards to all players
    const players = await sql(
      `SELECT user_id FROM game_players WHERE game_id = $1`,
      [gameId]
    );

    const dealPromises = players.rows.map((player) => {
      return sql(
        `
        INSERT INTO player_hands (game_id, user_id, card_id)
        SELECT $1, $2, wc.id
        FROM white_cards wc
        LEFT JOIN player_hands ph ON ph.card_id = wc.id AND ph.game_id = $1
        WHERE ph.id IS NULL
        AND (($3 = false AND wc.nsfw = false) OR $3 = true)
        ORDER BY RANDOM()
        LIMIT 10
      `,
        [gameId, player.user_id, gameResult.rows[0].allow_nsfw || false]
      );
    });

    await sql.transaction(dealPromises);

    // Update game status and black card
    await sql(
      `
      UPDATE games 
      SET status = 'playing', current_black_card = $1
      WHERE id = $2
    `,
      [blackCardResult.rows[0].id, gameId]
    );

    return {
      status: "started",
      blackCard: blackCardResult.rows[0],
    };
  }

  if (action === "check-round-complete") {
    const submissions = await sql(
      `
      SELECT COUNT(DISTINCT user_id) as submission_count,
             (SELECT COUNT(*) FROM game_players WHERE game_id = $1) as total_players,
             (SELECT czar_user_id FROM games WHERE id = $1) as czar_id
      FROM round_submissions
      WHERE game_id = $1
    `,
      [gameId]
    );

    const { submission_count, total_players, czar_id } = submissions.rows[0];
    const expected_submissions = total_players - 1; // Excluding czar

    return {
      complete: submission_count >= expected_submissions,
      submissions: submission_count,
      totalNeeded: expected_submissions,
      czarId: czar_id,
    };
  }

  if (action === "end-round") {
    // Get all submissions for the round
    const submissions = await sql(
      `
      SELECT rs.*, 
             array_agg(wc.text) as card_texts,
             gp.username
      FROM round_submissions rs
      JOIN game_players gp ON gp.user_id = rs.user_id AND gp.game_id = rs.game_id
      JOIN white_cards wc ON wc.id = ANY(rs.card_ids)
      WHERE rs.game_id = $1
      GROUP BY rs.id, gp.username
    `,
      [gameId]
    );

    // Clear played cards and round submissions
    await sql.transaction([
      sql(`DELETE FROM round_submissions WHERE game_id = $1`, [gameId]),
      sql(`DELETE FROM player_hands WHERE game_id = $1 AND played = true`, [
        gameId,
      ]),
    ]);

    return {
      submissions: submissions.rows,
    };
  }

  if (action === "select-winner") {
    // Update score for winning player
    await sql(
      `
      UPDATE game_players 
      SET score = score + 1 
      WHERE game_id = $1 AND user_id = $2
    `,
      [gameId, userId]
    );

    // Rotate czar to next player
    await sql(
      `
      UPDATE games g
      SET czar_user_id = (
        SELECT user_id 
        FROM game_players 
        WHERE game_id = $1 
        AND user_id != g.czar_user_id 
        ORDER BY RANDOM() 
        LIMIT 1
      )
      WHERE id = $1
    `,
      [gameId]
    );

    // Get updated scores
    const scores = await sql(
      `
      SELECT username, score 
      FROM game_players 
      WHERE game_id = $1 
      ORDER BY score DESC
    `,
      [gameId]
    );

    return {
      scores: scores.rows,
    };
  }

  if (action === "toggle-nsfw") {
    await sql(
      `
      INSERT INTO server_settings (channel_id, allow_nsfw)
      VALUES ($1, $2)
      ON CONFLICT (channel_id) 
      DO UPDATE SET allow_nsfw = $2
    `,
      [channelId, nsfw]
    );

    return {
      status: "updated",
      nsfw: nsfw,
    };
  }

  return { error: "Invalid action" };
}
export async function POST(request) {
  return handler(await request.json());
}