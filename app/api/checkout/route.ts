import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendMetaEvent } from "@/lib/meta-tracker";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { id, name, email, phone, packageName, credits, amount, source } = await req.json();
    
    if (!id || !name || !email || !phone || !packageName || !credits || !amount || !source) {
      return NextResponse.json({ success: false, error: "Harap isi semua properti transaksi dengan lengkap." }, { status: 400 });
    }

    // Register pending transaction in DB
    await db.createTransaction({
      id,
      name,
      email,
      phone,
      packageName,
      credits,
      amount,
      source
    });

    // Fire Meta Conversions API (InitiateCheckout) event
    await sendMetaEvent(
      "InitiateCheckout",
      { email, phone, name, userId: email },
      { 
        value: Number(amount), 
        currency: "IDR", 
        content_name: packageName,
        content_category: "Tokens"
      },
      req.url
    );

    // Fetch dynamic site settings to check if iPaymu is configured via UI setting
    const settings = await db.getSettings();
    const siteSetting = settings?.site_setting || {};

    const ipaymuVa = process.env.IPAYMU_VA || siteSetting.ipaymu_va || "";
    const ipaymuApiKey = process.env.IPAYMU_API_KEY || siteSetting.ipaymu_api_key || "";
    const ipaymuIsSandbox = (process.env.IPAYMU_SANDBOX || siteSetting.ipaymu_is_sandbox || "true") === "true";

    let paymentUrl = "";

    // If real iPaymu credentials present, talk to iPaymu API
    if (ipaymuVa && ipaymuApiKey) {
      try {
        const url = ipaymuIsSandbox
          ? "https://sandbox.ipaymu.com/api/v2/payment"
          : "https://api.ipaymu.com/api/v2/payment";

        const appUrl = process.env.APP_URL || new URL(req.url).origin;

        const body = {
          product: [packageName],
          qty: [1],
          price: [amount],
          returnUrl: `${appUrl}/checkout/complete?id=${id}`,
          cancelUrl: `${appUrl}/checkout`,
          notifyUrl: `${appUrl}/api/checkout/notify`,
          buyerName: name,
          buyerEmail: email,
          buyerPhone: phone,
          referenceId: id
        };

        const jsonBody = JSON.stringify(body);
        
        // Calculate HMAC SHA256 Signature for iPaymu
        const bodyHash = crypto.createHash("sha256").update(jsonBody).digest("hex").toLowerCase();
        const stringToSign = `${ipaymuVa}.${bodyHash}.POST.${ipaymuApiKey}`;
        const signature = crypto.createHmac("sha256", ipaymuApiKey).update(stringToSign).digest("hex");

        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "va": ipaymuVa,
            "signature": signature
          },
          body: jsonBody,
          signal: AbortSignal.timeout(8000)
        });

        const responseData = await response.json().catch(() => ({}));

        if (response.ok && responseData.Status === 200 && responseData.Data?.Url) {
          paymentUrl = responseData.Data.Url;
        } else {
          console.warn("iPaymu gateway declined link generation. Falling back to local high-fidelity simulator mode:", responseData);
        }
      } catch (err: any) {
        console.warn("iPaymu communication failed or timed out. Falling back to local high-fidelity simulator mode:", err.message || err);
      }
    }

    // Returns the status & optional actual redirection url
    return NextResponse.json({ success: true, id, paymentUrl });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
