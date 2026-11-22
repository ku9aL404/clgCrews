import { NextRequest, NextResponse } from "next/server";

async function verify(value: string, signature: string, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const result = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  const expected = Array.from(new Uint8Array(result)).map((byte) => byte.toString(16).padStart(2, "0")).join("");
  return expected === signature;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const secret = process.env.ADMIN_SESSION_SECRET;
  const cookie = request.cookies.get("campuscrew-admin")?.value;

  if (pathname === "/dashboard/admin" || ((pathname === "/admin" || pathname.startsWith("/admin/")) && pathname !== "/admin/login")) {
    if (!secret || !cookie) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const separator = cookie.lastIndexOf(".");
    const payload = cookie.slice(0, separator);
    const signature = cookie.slice(separator + 1);
    const match = /^admin:(\d+)$/.exec(payload);

    if (!match || Date.now() > Number(match[1]) || !(await verify(payload, signature, secret))) {
      const response = NextResponse.redirect(new URL("/admin/login", request.url));
      response.cookies.set("campuscrew-admin", "", { path: "/", maxAge: 0 });
      return response;
    }
  }

  return NextResponse.next();
}

export const config = { matcher: ["/admin", "/admin/:path*", "/dashboard/admin"] };
