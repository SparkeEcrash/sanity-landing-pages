import { NextResponse, NextRequest } from "next/server";

export function headersMiddleware(request: NextRequest) {
  const origin = request.headers.get("origin");

  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  response.headers.set("Access-Control-Max-Age", "86400");

  return response;
}

export const config = {
  matcher: "/api/:path*",
};

// https://www.youtube.com/watch?v=yRJd_tlHu9I
