import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import RedditProvider from "next-auth/providers/reddit";
import CredentialsProvider from "next-auth/providers/credentials";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt'
  },
  // Include user.id on session
  callbacks: {
    session({ session, token }) {
      const user = {
        ...session,
        ...token
      }

      return user
    },
    jwt({ user, token }) {

      if (user) {
        token = {
          email: user?.email,
          user,
          id: user.id
        }
      }

      return token
    }
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
    RedditProvider({
      clientId: env.REDDIT_CLIENT_ID,
      clientSecret: env.REDDIT_CLIENT_SECRET,
    }),
    CredentialsProvider({

      name: 'Guest',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
        },
        name: {
          label: 'Name',
          type: 'text',
        },
      },
      async authorize(credentials) {
        const user = await prisma.user.upsert({
          where: {
            email: credentials?.email,
          },
          create: {
            name: credentials?.name
          },
          update: {
            name: credentials?.name
          }
        })

        return user ?? null
      }
    })
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

export function uniqueString(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

export default NextAuth(authOptions);
