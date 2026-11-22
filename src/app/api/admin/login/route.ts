import { NextRequest, NextResponse } from "next/server";

async function sign(value: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return Array.from(new Uint8Array(signature)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
}

export async function POST(request: NextRequest) {
  const { password } = await request.json();
  const configuredPassword = process.env.ADMIN_PASSWORD;
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!configuredPassword || !secret) {
    return NextResponse.json({ error: "Admin authentication is not configured" }, { status: 503 });
  }

  if (typeof password !== "string" || password !== configuredPassword) {
    return NextResponse.json({ error: "Invalid admin password" }, { status: 401 });
  }

  const expires = Date.now() + 8 * 60 * 60 * 1000;
  const payload = `admin:${expires}`;
  const signature = await sign(payload, secret);
  const response = NextResponse.json({ ok: true });
  response.cookies.set("campuscrew-admin", `${payload}.${signature}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    maxAge: 8 * 60 * 60,
  });
  return response;
}
