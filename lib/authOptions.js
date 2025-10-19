// Shared NextAuth options for both API route and app directory

export const authOptions = {
  providers: [
    IdentityServer4Provider({
      id: 'oidc',
      name: 'Authentik',
      clientId: process.env.OIDC_CLIENT_ID,
      clientSecret: process.env.OIDC_CLIENT_SECRET,
  issuer: process.env.OIDC_ISSUER,
      // If you want to use explicit endpoints, you can add them here
      // authorization: process.env.OIDC_AUTHORIZATION_URL,
      // token: process.env.OIDC_TOKEN_URL,
      // userinfo: process.env.OIDC_USERINFO_URL,
      // idToken: true,
      // checks: ['pkce', 'state'],
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async session({ session, token }) {
      session.id = token.sub;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
};
