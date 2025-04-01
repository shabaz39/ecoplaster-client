// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { gql } from "@apollo/client";
import client from "../../../../lib/apolloClient";

const GOOGLE_LOGIN = gql`
  mutation GoogleLogin($idToken: String!, $userData: UserDataInput!) {
    googleLogin(idToken: $idToken, userData: $userData) {
      user {
        id
        name
        email
        role
      }
    }
  }
`;

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" && account?.id_token) {
        try {
          // Pass both the token and the user data from NextAuth
          const { data } = await client.mutate({
            mutation: GOOGLE_LOGIN,
            variables: {
              idToken: account.id_token,
              userData: {
                email: user.email,
                name: user.name,
                image: user.image
              }
            },
          });
          
          if (data?.googleLogin?.user?.id) {
            user.id = data.googleLogin.user.id;
            user.role = data.googleLogin.user.role || "user";

          }
          
          return true;
        } catch (error) {
          console.error("Error saving Google user to database:", error);
          return false; // Don't allow sign-in if DB save fails
        }
      }
      return true;
    },
    async jwt({ token, account, user }) {
      if (account && user) {
        if (user.id) {
          token.id = user.id;
          token.role = user.role ?? "user"; // ✅ Use role from user object

        }
        token.role = user.email === "ecoplaster1@gmail.com" ? "admin" : "user";
      }
      return token;
    },
    async session({ session, token }) {
      if (token.id) {
        session.user.id = token.id;
        session.user.role = token.role ?? "user";

      }
      session.user.role = token.role ?? "user";
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
});

export { handler as GET, handler as POST };