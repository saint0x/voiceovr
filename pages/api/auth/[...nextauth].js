// pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";

const options = {
  providers: [
    {
      id: "twitter",
      name: "Twitter",
      type: "oauth",
      version: "2.0",
      params: { grant_type: "authorization_code" },
      accessTokenUrl: "https://api.twitter.com/oauth/access_token",
      requestTokenUrl: "https://api.twitter.com/oauth/request_token",
      authorizationUrl: "https://api.twitter.com/oauth/authenticate?force_login=true",
      clientId: process.env.TWITTER_API_KEY,
      clientSecret: process.env.TWITTER_API_SECRET_KEY,
      profileUrl: "https://api.twitter.com/2/tweets?ids=@me",
      profile: (profile) => {
        return {
          id: profile.id_str,
          name: profile.name,
          email: null,
          image: profile.profile_image_url_https,
        };
      },
    },
  ],
};

export default (req, res) => NextAuth(req, res, options);
