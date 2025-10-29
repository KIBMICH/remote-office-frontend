import { NextResponse } from "next/server";

// Force Node.js runtime (agora-access-token relies on Node APIs)
export const runtime = "nodejs";

// NOTE: Install server dependency: `npm i agora-access-token`
import { RtcTokenBuilder, RtcRole } from "agora-access-token";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const channel = url.searchParams.get("channel");
    const roleParam = url.searchParams.get("role") || "publisher";
    const expireSeconds = parseInt(url.searchParams.get("expire") || "3600", 10);
    const uidParam = url.searchParams.get("uid");

    if (!channel) {
      return NextResponse.json({ error: "Missing channel" }, { status: 400 });
    }

    const appId = process.env.NEXT_PUBLIC_AGORA_APP_ID;
    const appCertificate = process.env.AGORA_APP_CERTIFICATE;

    if (!appId || !appCertificate) {
      return NextResponse.json(
        { error: "Missing AGORA envs. Set NEXT_PUBLIC_AGORA_APP_ID and AGORA_APP_CERTIFICATE." },
        { status: 500 }
      );
    }

    const now = Math.floor(Date.now() / 1000);
    const privilegeExpire = now + expireSeconds;
    const role = roleParam.toLowerCase() === "audience" ? RtcRole.SUBSCRIBER : RtcRole.PUBLISHER;

    // Use numeric uid (0 lets Agora assign one). Alternatively, accept provided uid
    const uid = uidParam ? Number(uidParam) : 0;

    const token = RtcTokenBuilder.buildTokenWithUid(
      appId,
      appCertificate,
      channel,
      uid,
      role,
      privilegeExpire
    );

    return NextResponse.json({ token, uid });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}


