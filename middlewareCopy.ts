// https://stackoverflow.com/questions/70754651/next-auth-v4-with-next-js-middleware?rq=2

//A bug exists with Next 13.4.4 with NextResponse. Wait for an updated version to update the middleware with withAuth middleware protection

import { withAuth } from "next-auth/middleware";
import { NextRequest, NextResponse } from "next/server";

export default withAuth(
  function middleware(request: NextRequest) {
    const origin = request.headers.get("origin");
    if (request.nextUrl.pathname.startsWith("/api")) {
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

      // console.log("Middleware!");
      // console.log(request.method);
      // console.log(request.url);

      return response;
    }
  },
  {
    callbacks: {
      authorized({ req, token }) {
        // `/admin` requires admin role
        console.log(token);
        if (req.nextUrl.pathname === "/admin") {
          return token?.userRole === "admin";
        }
        // `/me` only requires the user to be logged in
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/api/:path*", "/artworks/:path*"],
};

// https://www.youtube.com/watch?v=yRJd_tlHu9I

// if (request.nextUrl.pathname.startsWith("/artworks")) {
//   console.log("nextauthtoken");
//   console.log(request.nextauth.token);

//   console.log(";lsdjf;alsf");
//   console.log(request.headers);
//   if (request.headers.get("cookie")) {
//     const authorization = request.headers.get("cookie");
//     console.log("hello");
//     console.log(authorization);
//   }

// const response = NextResponse.next();
// response.headers.set("Access-Control-Allow-Origin", "*");
// response.headers.set(
//   "Access-Control-Allow-Methods",
//   "GET, POST, PATCH, PUT, DELETE, OPTIONS"
// );
// response.headers.set(
//   "Access-Control-Allow-Headers",
//   "Content-Type, Authorization"
// );
// response.headers.set("Access-Control-Max-Age", "86400");

// return response;

// import { NextResponse, NextRequest } from "next/server";

// export function middleware(request: NextRequest) {
//   const origin = request.headers.get("origin");

//   const response = NextResponse.next();
//   response.headers.set("Access-Control-Allow-Origin", "*");
//   response.headers.set(
//     "Access-Control-Allow-Methods",
//     "GET, POST, PATCH, PUT, DELETE, OPTIONS"
//   );
//   response.headers.set(
//     "Access-Control-Allow-Headers",
//     "Content-Type, Authorization"
//   );
//   response.headers.set("Access-Control-Max-Age", "86400");

//   // console.log("Middleware!");
//   // console.log(request.method);
//   // console.log(request.url);

//   return response;
// }

// export const config = {
//   matcher: "/api/:path*",
// };

// https://www.youtube.com/watch?v=yRJd_tlHu9I
