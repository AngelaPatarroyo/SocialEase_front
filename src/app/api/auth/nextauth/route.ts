import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) {
        const googleProfile = profile as { name?: string; email?: string; picture?: string };
        token.name = googleProfile.name;
        token.email = googleProfile.email;
        token.picture = googleProfile.picture;
      }
      return token;
    },
    async session({ session, token }) {
      session.user = {
        name: token.name as string,
        email: token.email as string,
        image: token.picture as string,
      };
      return session;
    },
    async signIn({ user }) {
      // Optional: Sync Google user with your backend
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_BASE}/auth/google`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: user.name,
            email: user.email,
            avatar: user.image,
          }),
        });
      } catch (error) {
        console.error('Error syncing Google user:', error);
      }
      return true;
    },
  },
});

export { handler as GET, handler as POST };
