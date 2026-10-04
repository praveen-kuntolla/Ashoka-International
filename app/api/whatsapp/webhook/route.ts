import { NextRequest, NextResponse } from "next/server";

/**
 * Meta WhatsApp Cloud API Webhook Route
 * Path: /api/whatsapp/webhook
 *
 * GET: Handles Meta Webhook Verification challenge
 * POST: Handles incoming WhatsApp messages, interactive replies, and status updates
 */

// 1. GET: Webhook Verification
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN;

  // Strict check: mode must be 'subscribe', token must match environment variable
  if (
    mode === "subscribe" &&
    token &&
    expectedToken &&
    token === expectedToken
  ) {
    console.log("[WhatsApp Webhook] Verification successful.");
    // Return exact challenge as plain text with HTTP 200 (do not wrap in JSON)
    return new Response(challenge ?? "", {
      status: 200,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }

  // Verification failed or mode invalid
  console.warn("[WhatsApp Webhook] Verification failed: Token mismatch or invalid mode.");
  return new Response("Forbidden", { status: 403 });
}

// 2. POST: Incoming Webhook Events
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Verify WhatsApp API event object
    if (body.object === "whatsapp_business_account" || body.entry) {
      const entries = body.entry || [];

      for (const entry of entries) {
        const changes = entry.changes || [];

        for (const change of changes) {
          const value = change.value;
          if (!value) continue;

          // Non-secret metadata
          const metadata = value.metadata;
          if (metadata) {
            console.log(
              `[WhatsApp Webhook] Business Phone: ${metadata.display_phone_number || "N/A"} (ID: ${metadata.phone_number_id || "N/A"})`
            );
          }

          // A. Process Incoming Messages
          if (value.messages && Array.isArray(value.messages)) {
            for (const msg of value.messages) {
              const sender = msg.from;
              const msgId = msg.id;
              const timestamp = msg.timestamp;
              const type = msg.type;

              console.log(
                `[WhatsApp Webhook] Incoming message | Sender: ${sender} | ID: ${msgId} | Type: ${type} | Time: ${timestamp}`
              );

              // 1. Text Message
              if (type === "text" && msg.text?.body) {
                console.log(`[WhatsApp Webhook] Text message: "${msg.text.body}"`);
              }

              // 2. Interactive Responses (Buttons & Lists)
              else if (type === "interactive" && msg.interactive) {
                const interactive = msg.interactive;

                // Button Reply
                if (interactive.type === "button_reply" && interactive.button_reply) {
                  const { id: btnId, title: btnTitle } = interactive.button_reply;
                  console.log(
                    `[WhatsApp Webhook] Interactive Button Reply: [${btnId}] "${btnTitle}"`
                  );
                }

                // List Reply
                else if (interactive.type === "list_reply" && interactive.list_reply) {
                  const { id: rowId, title: listTitle, description } = interactive.list_reply;
                  console.log(
                    `[WhatsApp Webhook] Interactive List Reply: [${rowId}] "${listTitle}" - ${description || "No description"}`
                  );
                }
              }

              // 3. Other Media or Message Types
              else {
                console.log(`[WhatsApp Webhook] Non-text event received: ${type}`);
              }
            }
          }

          // B. Process Message Status Updates (sent, delivered, read, failed)
          if (value.statuses && Array.isArray(value.statuses)) {
            for (const status of value.statuses) {
              console.log(
                `[WhatsApp Webhook] Status Update: [${status.id}] Status: ${status.status} -> Recipient: ${status.recipient_id}`
              );

              if (status.errors && status.errors.length > 0) {
                console.warn(
                  `[WhatsApp Webhook] Delivery Error:`,
                  JSON.stringify(status.errors)
                );
              }
            }
          }
        }
      }
    }

    // Always respond with 200 OK fast so Meta doesn't retry
    return NextResponse.json({ success: true, status: "EVENT_RECEIVED" }, { status: 200 });
  } catch (error) {
    console.error("[WhatsApp Webhook] Failed to process webhook request:", error);
    // Even on parse error or non-conforming payload, return 200 or 400
    return NextResponse.json(
      { error: "Invalid webhook payload" },
      { status: 400 }
    );
  }
}
