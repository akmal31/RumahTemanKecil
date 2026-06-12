import crypto from "crypto";

export interface MetaUserData {
  email?: string;
  phone?: string;
  name?: string;
  userId?: string;
}

export interface MetaCustomData {
  value?: number;
  currency?: string;
  content_name?: string;
  content_category?: string;
  content_ids?: string[];
  [key: string]: any;
}

function sha256(text: string): string {
  if (!text) return "";
  return crypto
    .createHash("sha256")
    .update(text.trim().toLowerCase())
    .digest("hex");
}

/**
 * Sends a server-side Conversions API (CAPI) event to Meta (Facebook).
 * Handles missing configuration gracefully without crashing.
 */
export async function sendMetaEvent(
  eventName: string,
  user: MetaUserData = {},
  customData: MetaCustomData = {},
  sourceUrl?: string
) {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const accessToken = process.env.META_CONVERSIONS_API_ACCESS_TOKEN;

  // Gracefully skip tracking if credentials are not configured
  if (!pixelId || !accessToken) {
    console.log(`[Meta CAPI Skip] tracking disabled: missing META_PIXEL_ID or ACCESS_TOKEN for event: ${eventName}`);
    return null;
  }

  try {
    // Standard event payload schema
    const eventPayload: any = {
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_source_url: sourceUrl || process.env.APP_URL || "http://localhost:3000",
      action_source: "website",
      user_data: {
        // Must contain hashed user identifiers
        em: user.email ? [sha256(user.email)] : [],
        ph: user.phone ? [sha256(user.phone)] : [],
      },
    };

    // If external ID (user ID) is present, hash and send it, too
    if (user.userId) {
      eventPayload.user_data.external_id = [sha256(user.userId)];
    }

    // Attach custom conversion details if provided
    if (Object.keys(customData).length > 0) {
      eventPayload.custom_data = {
        value: customData.value,
        currency: customData.currency || "IDR",
        content_name: customData.content_name,
        content_category: customData.content_category,
        content_ids: customData.content_ids,
        ...customData,
      };
    }

    const payload = {
      data: [eventPayload],
    };

    console.log(`[Meta CAPI Sending] event: ${eventName}`, JSON.stringify(payload, null, 2));

    const response = await fetch(`https://graph.facebook.com/v19.0/${pixelId}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [eventPayload],
        access_token: accessToken,
      }),
    });

    const body = await response.json();
    if (!response.ok) {
      console.warn("[Meta CAPI Warning] Response states failure (likely inactive Pixel or token in Sandbox):", body);
      return { success: false, error: body };
    }

    console.log("[Meta CAPI Success] Event reported successfully:", body);
    return { success: true, response: body };
  } catch (error: any) {
    console.warn("[Meta CAPI Warning] Failed to transmit event matching offline tracker:", error);
    return { success: false, error: error.message };
  }
}
