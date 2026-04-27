import { NextResponse, type NextRequest } from "next/server";
import { getAdminPasswordHash } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";

export async function proxy(req: NextRequest) {
  const expectedUser = process.env.ADMIN_USER;
  const envPass = process.env.ADMIN_PASS;

  if (!expectedUser) {
    return new NextResponse(
      "Admin is not configured. Set ADMIN_USER (and either ADMIN_PASS or set a password from the admin page).",
      { status: 503 },
    );
  }

  const auth = req.headers.get("authorization");
  if (auth?.startsWith("Basic ")) {
    const decoded = atob(auth.slice(6));
    const idx = decoded.indexOf(":");
    if (idx !== -1) {
      const user = decoded.slice(0, idx);
      const pass = decoded.slice(idx + 1);

      if (user === expectedUser) {
        // DB-stored password takes precedence once it's been set from the
        // admin UI. If no DB hash exists yet, fall back to the env var so
        // the very first sign-in works against ADMIN_PASS.
        let dbHash: string | null = null;
        try {
          dbHash = await getAdminPasswordHash();
        } catch (err) {
          console.error("[proxy] could not read admin password hash", err);
        }

        if (dbHash) {
          if (verifyPassword(pass, dbHash)) {
            return NextResponse.next();
          }
        } else if (envPass && pass === envPass) {
          return NextResponse.next();
        }
      }
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="RSVP Admin", charset="UTF-8"',
    },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
