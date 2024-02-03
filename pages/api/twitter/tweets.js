// pages/api/twitter/tweets.js
import { getSession } from "next-auth/react";
import axios from "axios";

export default async (req, res) => {
  const session = await getSession({ req });

  if (session) {
    const { data } = await axios.get(
      `https://api.twitter.com/2/tweets?ids=${session.user.twitterId}`,
      {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      }
    );

    res.status(200).json(data.data);
  } else {
    res.status(401).json({ error: "User not authenticated" });
  }
};
