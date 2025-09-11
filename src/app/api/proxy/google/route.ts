import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const redirectUri = searchParams.get("redirectUri") || "";

    const base = process.env.NEXT_PUBLIC_API_URL || "";
    const url = `${base.replace(/\/$/, "")}/api/auth/google` + (redirectUri ? `?redirectUri=${encodeURIComponent(redirectUri)}` : "");

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      // Do not follow redirects to keep control in our app
      redirect: "manual",
      cache: "no-store",
    });

    // If backend tried to redirect, surface the location
    const location = res.headers.get("location");
    if (location) {
      return NextResponse.json({ redirect: location }, { status: 200 });
    }

    // If backend responds with JSON body
    const contentType = res.headers.get("content-type") || "";
    if (contentType.includes("application/json")) {
      const data = await res.json();
      return NextResponse.json(data, { status: res.status });
    }

    // Try to parse as JSON anyway (some backends don't set correct content-type)
    try {
      const text = await res.text();
      const data = JSON.parse(text);
      return NextResponse.json(data, { status: res.status });
    } catch {
      // Not JSON, return as text
      return NextResponse.json({ message: "Unexpected response from auth provider" }, { status: res.status });
    }
  } catch {
    return NextResponse.json({ message: "Failed to reach auth service" }, { status: 500 });
  }
}
