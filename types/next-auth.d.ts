import NextAuth from "next-auth"

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `Provider` React Context
   */
  interface Session {
    id: string;
    user: {
        id: string;
        username: string?;
        profile_emoji: string?;
        bio: string?;
    }
  }
}