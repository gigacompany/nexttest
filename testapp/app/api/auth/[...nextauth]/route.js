import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { ip } from "../../config/route";


async function refreshAccessToken(refreshToken) {
  try {
    const url = `${ip}/refresh`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const refreshedTokens = await response.json();

    if (!response.ok) {
      throw refreshedTokens;
    }

    return {
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? refreshToken, // Fall back to the old refresh token
    };
  } catch (error) {
    console.error("Refresh token error:", error);

    return {
      error: "RefreshAccessTokenError",
    };
  }
}



export const authOptions = ({
  session: {
    // strategy: "jwt",
    jwt: true,
    // maxAge: 10,
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password} = credentials;
        const res = await fetch(`${ip}/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });
        const user = await res.json();
console.log(user);
        if (res.ok && user) {
          return user;
  
        } else {
          return null;
        }
      },
      
      
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // if (user) {
      //   return {
      //     accessToken: user.access_token,
      //     accessTokenExpires: Date.now() + user.expires_in * 1000,
      //     refreshToken: user.refresh_token,
      //     user
      //   }
      // }
      if (user) {
        token.refreshToken = user.refresh_token;
        token.accessToken = user.access_token;
        token.expires = Date.now() + parseInt(user.expires_in) * 1000;
      }
      if (Date.now() < token.accessTokenExpires) {
        return token;
      }

      // Use the refresh token to obtain a new access token
      if (token.refreshToken) {
        const refreshedToken = await refreshAccessToken(token.refreshToken);
        return refreshedToken;
      }

      return token; // Return the original token if there's no refresh token
    },
    async session({ session, token }) {
//       session.user = token.user
//       session.accessToken = token.accessToken
//       session.error = token.error
// console.log(session, 'session');
//       return session
session.accessToken = token.accessToken;
        return session;
    },
    async redirect(url, baseUrl) {
      // Redirect to the home page after sign-in
      return "/";
    },
  },
  secret: "supersecret",
});

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
