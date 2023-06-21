import NextAuth, { NextAuthOptions } from "next-auth";
import { FirestoreAdapter } from "@next-auth/firebase-adapter";
import { firestore } from "lib/firestore";
import { SanityAdapter } from "next-auth-sanity";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { sanityClient } from "sanity";
import { getTodayDate } from "utils";
import { signJwtAccessToken } from "@lib/jwt";

export const authOptions: NextAuthOptions = {
  // adapter: FirestoreAdapter(firestore),
  adapter: SanityAdapter(sanityClient),
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
      profile(profile, tokens) {
        //this only gets returned as user if you do not have adapter
        //if you have adapter this is what gets saved to the database
        const dateJoined = getTodayDate();

        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          uid: "google." + profile.sub,
          roles: ["user"],
          dateJoined,
          provider: "oAuth",
          isEmailVerified: profile.email_verified,
          // emailVerified: profile.email_verified,
        };
      },
      // https://next-auth.js.org/configuration/providers/oauth
      // token: {
      //   url: "https://example.com/oauth/token",
      //   params: { some: "param" }
      // }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      profile(profile, tokens) {
        const dateJoined = getTodayDate();
        return {
          id: profile.id,
          name: profile.name,
          username: profile.login,
          email: profile.email,
          image: profile.avatar_url,
          uid: "github." + profile.id,
          roles: ["user"],
          dateJoined,
          provider: "oAuth",
        };
      },
    }),
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        //TODO: refactor this
        const res = await fetch("/api/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username: credentials?.username,
            password: credentials?.password,
          }),
        });

        const user = await res.json();

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  jwt: {
    // The maximum age of the NextAuth.js issued JWT in seconds.
    // Defaults to `session.maxAge`.
    maxAge: 60 * 60 * 24 * 30,
    // look up jwt configuration options
    // https://next-auth.js.org/v3/configuration/options
  },
  pages: {
    signIn: "/auth/signin",
    // signOut: "/auth/signout",
    error: "/auth/error", // Error code passed in query string as ?error=
    // verifyRequest: "/auth/verify-request", // (used for check email message)
    // newUser: "/auth/new-user", // New users will be directed here on first sign in (leave the property out if not of interest)
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      //check for banned users and deny them signing in for access control
      return true;
    },
    async jwt({ token, user, account, profile }) {
      //combine jwt with user object that you get from profile(profile) in Provider config
      //if you have adapter the user object adds data from database and overrides id with one from the database
      //if you sign in with credentials the user is the returned user object in async authorize earlier
      //token is created by the Provider such as Google and only available when using jwt straregy
      //create access token here so that session.user can get it later
      // console.log("user");
      // console.log(user);
      // console.log("token");
      // console.log(token);
      // console.log("account");
      // console.log(account);
      // console.log("profile");
      // console.log(profile);

      let updatedToken = { ...token };
      // let updatedToken = { token } as any;
      if (user) {
        updatedToken = { ...updatedToken, ...user };
        // updatedToken = { ...updatedToken, user };
      }
      if (account) {
        updatedToken = { ...updatedToken, ...account };
        // updatedToken = { ...updatedToken, account };
      }
      if (profile) {
        updatedToken = { ...updatedToken, ...profile };
        // updatedToken = { ...updatedToken, profile };
      }
      const myAccessToken = signJwtAccessToken({ uid: updatedToken.uid });
      updatedToken.myAccessToken = myAccessToken;
      return updatedToken;
    },
    async session({ session, token, user, trigger, newSession }) {
      //token is the returned object from async jwt above
      //user is only available when using 'database'
      let data = {} as any;
      if (token) {
        data = { ...token };
      } else {
        data = { ...user };
      }
      //set session.user depending on provider
      if (token && data.provider === "google") {
        session.user = {
          uid: ("google." + data.providerAccountId) as string,
          name: data.name,
          image: data.image,
          email: data.email,
          roles: data.roles,
          accessToken: data.myAccessToken as string,
        };
      }
      if (token && data.provider === "github" && token) {
        session.user = {
          uid: ("github." + data.providerAccountId) as string,
          name: data.name,
          username: data.login,
          image: data.image,
          email: data.email,
          roles: data.roles,
          accessToken: data.myAccessToken,
        };
        console.log(session.user);
      }
      if (user) {
        session.user.uid = user.id;
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
