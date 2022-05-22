import NextAuth, { Session, User } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient();

export default NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_ID!,
            clientSecret: process.env.GOOGLE_SECRET!,
        }),
    ],
    adapter: PrismaAdapter(prisma),
    secret: process.env.JWT_SECRET,
    callbacks: {
        session: async ({session, user}) => {
            session.user.id = user.id;
            const dbUser = await prisma.user.findUnique({
                where: {
                    id: user.id,
                },
            });
            if (dbUser) {
                session.user.username = dbUser.username;
                session.user.profile_emoji = dbUser.profile_emoji;
                session.user.bio = dbUser.bio;
            } else {
                session.user.username = null;
                session.user.profile_emoji = null;
                session.user.bio = null;
            }
            return session;
        }
    }
})