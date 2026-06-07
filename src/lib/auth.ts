import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "test@example.com" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        let user = await prisma.user.findUnique({
          where: { email: credentials.email }
        });

        if (!user) {
          // Auto-create user for testing to "make everything working" fast
          user = await prisma.user.create({
            data: {
              email: credentials.email,
              name: credentials.email.split("@")[0],
              passwordHash: "test-hash", // Mocked for rapid dev
            }
          });
        }

        // Auto-provision default wallets for testing/usage if they don't have any
        const walletCount = await prisma.wallet.count({
          where: { userId: user.id }
        });
        if (walletCount === 0) {
          await prisma.wallet.createMany({
            data: [
              {
                userId: user.id,
                name: "Main Cash Wallet",
                type: "CASH",
                currency: "INR",
                balance: 10000.0,
              },
              {
                userId: user.id,
                name: "Chase Checking",
                type: "BANK",
                currency: "INR",
                balance: 50000.0,
              }
            ]
          });
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image
        };
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET || "supersecret123456789",
  debug: true,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    }
  },
  pages: {
    signIn: "/login",
  }
};
