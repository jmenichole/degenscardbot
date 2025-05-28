async function handler(body, request) {
  // For Discord ping/health check
  if (body.type === 1) {
    return { type: 1 };
  }

  // For slash commands
  if (body.type === 2) {
    const { name } = body.data;
    const { channel_id, member } = body;

    if (name === "dealme") {
      // Create a new game
      const gameResult = await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sql: `
            INSERT INTO games (channel_id, czar_user_id, status)
            VALUES ($1, $2, 'waiting')
            RETURNING id
          `,
          values: [channel_id, member.user.id],
        }),
      });

      if (!gameResult.ok) {
        return {
          type: 4,
          data: {
            content: "🚫 Failed to start game. The chaos gods are displeased.",
          },
        };
      }

      const game = await gameResult.json();

      // Add the creator as first player
      await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sql: `
            INSERT INTO game_players (game_id, user_id, username)
            VALUES ($1, $2, $3)
          `,
          values: [game.rows[0].id, member.user.id, member.user.username],
        }),
      });

      // Send response to Discord
      return {
        type: 4,
        data: {
          content:
            "🎲 Game of Degens Against Decency started! Type **/join** to embrace the chaos. Need at least 2 players to start the degeneracy.",
        },
      };
    }

    if (name === "join") {
      // Get active game in channel
      const gameResult = await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sql: `
            SELECT id FROM games 
            WHERE channel_id = $1 
            AND status = 'waiting'
            ORDER BY created_at DESC 
            LIMIT 1
          `,
          values: [channel_id],
        }),
      });

      if (!gameResult.ok) {
        return {
          type: 4,
          data: {
            content: "🚫 Failed to join. The void rejects you.",
          },
        };
      }

      const game = await gameResult.json();

      if (!game.rows.length) {
        return {
          type: 4,
          data: {
            content: "No active game found. Start one with **/dealme**!",
          },
        };
      }

      // Add player to game
      try {
        await fetch("/api/db", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sql: `
              INSERT INTO game_players (game_id, user_id, username)
              VALUES ($1, $2, $3)
            `,
            values: [game.rows[0].id, member.user.id, member.user.username],
          }),
        });

        // Check if we have enough players to start
        const countResult = await fetch("/api/db", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sql: "SELECT COUNT(*) as count FROM game_players WHERE game_id = $1",
            values: [game.rows[0].id],
          }),
        });

        const count = await countResult.json();
        const playerCount = count.rows[0].count;

        if (playerCount >= 2) {
          // Start the game
          await fetch("/api/cah-game-manager", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "start-round",
              gameId: game.rows[0].id,
              channelId: channel_id,
            }),
          });

          return {
            type: 4,
            data: {
              content:
                "🎭 The squad's all here! Game is starting - check your DMs for your hand of cards!",
            },
          };
        }

        return {
          type: 4,
          data: {
            content: `🎭 Welcome to the circus! Need ${2 - playerCount} more ${
              playerCount === 1 ? "degenerate" : "degenerates"
            } to start.`,
          },
        };
      } catch (error) {
        if (error.message.includes("unique constraint")) {
          return {
            type: 4,
            data: {
              content: "You're already in this game, you absolute menace!",
            },
          };
        }
        throw error;
      }
    }

    if (name === "hand") {
      // Get player's current hand
      const handResult = await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sql: `
            WITH current_game AS (
              SELECT id, current_black_card 
              FROM games 
              WHERE channel_id = $1 
              AND status = 'playing'
              ORDER BY created_at DESC 
              LIMIT 1
            )
            SELECT 
              wc.text as card_text,
              ph.played,
              bc.text as black_card_text
            FROM current_game g
            LEFT JOIN black_cards bc ON bc.id = g.current_black_card
            JOIN player_hands ph ON ph.game_id = g.id
            JOIN white_cards wc ON wc.id = ph.card_id
            WHERE ph.user_id = $2
          `,
          values: [channel_id, member.user.id],
        }),
      });

      if (!handResult.ok) {
        return {
          type: 4,
          data: {
            content: "🚫 Failed to get your cards. The void is empty.",
          },
        };
      }

      const hand = await handResult.json();

      if (!hand.rows.length) {
        return {
          type: 4,
          data: {
            content:
              "You're not in an active game or don't have any cards yet.",
          },
        };
      }

      const blackCard = hand.rows[0].black_card_text;
      const cardList = hand.rows
        .map(
          (card, index) =>
            `${index + 1}. ${card.card_text}${card.played ? " (played)" : ""}`
        )
        .join("\n");

      return {
        type: 4,
        data: {
          content: `📜 Current prompt: "${blackCard}"\n\n🃏 Your cards of questionable taste:\n${cardList}\n\nUse **/play [number]** to submit your answer!`,
          flags: 64, // Ephemeral flag - only visible to command user
        },
      };
    }

    if (name === "play") {
      const cardNumber = parseInt(body.data.options?.[0]?.value);

      if (!cardNumber || cardNumber < 1) {
        return {
          type: 4,
          data: {
            content: "🚫 Pick a card number, you coward!",
          },
        };
      }

      // Get current game and player's hand
      const gameResult = await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sql: `
            SELECT g.*, ph.card_id, wc.text as card_text
            FROM games g
            JOIN player_hands ph ON ph.game_id = g.id
            JOIN white_cards wc ON wc.id = ph.card_id
            WHERE g.channel_id = $1 
            AND g.status = 'playing'
            AND ph.user_id = $2
            AND ph.played = false
            ORDER BY g.created_at DESC
          `,
          values: [channel_id, member.user.id],
        }),
      });

      if (!gameResult.ok) {
        return {
          type: 4,
          data: {
            content: "🚫 Failed to play card. The chaos gods are displeased.",
          },
        };
      }

      const game = await gameResult.json();

      if (!game.rows.length) {
        return {
          type: 4,
          data: {
            content:
              "No active game found or you've already played this round.",
          },
        };
      }

      if (game.rows[0].czar_user_id === member.user.id) {
        return {
          type: 4,
          data: {
            content:
              "You're the Card Czar! Your only job is to judge, not play.",
          },
        };
      }

      const cardIndex = cardNumber - 1;
      if (cardIndex < 0 || cardIndex >= game.rows.length) {
        return {
          type: 4,
          data: {
            content: "That's not a valid card number. Are you okay?",
          },
        };
      }

      const card = game.rows[cardIndex];

      // Submit the card
      await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sql: `
            INSERT INTO round_submissions (game_id, user_id, card_ids)
            VALUES ($1, $2, $3)
          `,
          values: [game.rows[0].id, member.user.id, [card.card_id]],
        }),
      });

      // Mark card as played
      await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sql: "UPDATE player_hands SET played = true WHERE game_id = $1 AND user_id = $2 AND card_id = $3",
          values: [game.rows[0].id, member.user.id, card.card_id],
        }),
      });

      // Check if round is complete
      const roundCheck = await fetch("/api/cah-game-manager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "check-round-complete",
          gameId: game.rows[0].id,
        }),
      });

      const roundStatus = await roundCheck.json();

      if (roundStatus.complete) {
        // Get all submissions
        const roundEnd = await fetch("/api/cah-game-manager", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "end-round",
            gameId: game.rows[0].id,
          }),
        });

        const submissions = await roundEnd.json();

        // Format submissions for display
        const submissionList = submissions.submissions
          .map(
            (sub, index) =>
              `${index + 1}. ${sub.card_texts.join(" ")} (${sub.username})`
          )
          .join("\n");

        // Get black card
        const blackCard = await fetch("/api/db", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sql: "SELECT text FROM black_cards WHERE id = $1",
            values: [game.rows[0].current_black_card],
          }),
        });

        const prompt = await blackCard.json();

        // Send public message with all submissions
        return {
          type: 4,
          data: {
            content: `📜 **Prompt:** ${prompt.rows[0].text}\n\n🎭 **Submissions:**\n${submissionList}\n\n<@${roundStatus.czarId}> You're the Card Czar! Choose the winner by replying with their number!`,
          },
        };
      }

      return {
        type: 4,
        data: {
          content: `🎭 You played: "${card.card_text}"\nYour sins have been recorded.`,
          flags: 64, // Ephemeral flag
        },
      };
    }

    if (name === "toggle-nsfw") {
      // Check if user has manage server permissions
      if (!member.permissions.includes("MANAGE_GUILD")) {
        return {
          type: 4,
          data: {
            content:
              "🚫 Nice try, but you need server management permissions to toggle NSFW mode.",
          },
        };
      }

      const nsfw = body.data.options[0]?.value === "true";

      const result = await fetch("/api/cah-game-manager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle-nsfw",
          channelId: channel_id,
          nsfw: nsfw,
        }),
      });

      if (!result.ok) {
        return {
          type: 4,
          data: {
            content: "🚫 Failed to update NSFW settings.",
          },
        };
      }

      return {
        type: 4,
        data: {
          content: nsfw
            ? "🔞 NSFW mode enabled. May God have mercy on your souls."
            : "😇 NSFW mode disabled. Keeping it clean(ish).",
        },
      };
    }
  }

  // For message components (buttons, select menus)
  if (body.type === 3) {
    const { custom_id } = body.data;
    const { channel_id, member } = body;

    if (custom_id.startsWith("select_winner_")) {
      const winningUserId = custom_id.split("_")[2];
      const gameId = parseInt(custom_id.split("_")[3]);

      // Update winner
      const result = await fetch("/api/cah-game-manager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "select-winner",
          gameId: gameId,
          userId: winningUserId,
        }),
      });

      if (!result.ok) {
        return {
          type: 4,
          data: {
            content: "🚫 Failed to select winner. The void is displeased.",
          },
        };
      }

      const winnerData = await result.json();
      const scoreBoard = winnerData.scores
        .map(
          (player) =>
            `${player.username}: ${player.score} point${
              player.score !== 1 ? "s" : ""
            }`
        )
        .join("\n");

      // Start next round
      await fetch("/api/cah-game-manager", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start-round",
          gameId: gameId,
          channelId: channel_id,
        }),
      });

      return {
        type: 4,
        data: {
          content: `🏆 Round complete!\n\n**Current Scores:**\n${scoreBoard}\n\nNew round starting! Check your DMs for new cards!`,
        },
      };
    }
  }

  return {
    type: 4,
    data: {
      content: "🤔 I don't know what to do with that command.",
    },
  };
}

function hexToUint8Array(hex) {
  return new Uint8Array(hex.match(/.{1,2}/g).map((val) => parseInt(val, 16)));
}
export async function POST(request) {
  return handler(await request.json());
}