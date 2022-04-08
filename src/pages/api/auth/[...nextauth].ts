import NextAuth, {Account, Profile, Session, User} from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { query as q } from "faunadb"

import { fauna } from "../../../services/fauna"
import { JWT } from "next-auth/jwt";

interface SignInProps {
  user: User;
  account: Account;
  profile: Profile;
  email: {
        verificationRequest?: boolean;
    };
}

interface SessionProps {
  session: Session; 
  user: User; 
  token: JWT
}

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "read:user"
        }
      }
    }),
  ],
  callbacks: {
    async session({session}:SessionProps){
      try {
        const userActiveSubscription = await fauna.query(
          q.Get(
            q.Intersection([
              q.Match(
                q.Index('subscription_by_user_ref'),
                q.Select(
                  "ref",
                  q.Get(
                    q.Match(
                      q.Index('user_by_email'),
                      q.Casefold(session.user.email)
                    )
                  )
                )
              ),
              q.Match(
                q.Index('subscription_by_status'),
                "active"
              )
            ])
          )
        )
        return {
          ...session,
          activeSubscription: userActiveSubscription,
        }
      } catch  {
        return {
          ...session,
          activeSubscription: null,
        }
      }
    },
    async signIn({ user, account, profile}: SignInProps ) {
      const {email} = user;

      try {
        await fauna.query(
          q.If(
            q.Not(
              q.Exists(
                q.Match(
                  q.Index('user_by_email'),
                  q.Casefold(user.email)
                )
              )
            ),
            q.Create(
              q.Collection('users'),
              { data: { email } }
            ),
            q.Get(
              q.Match(
                q.Index('user_by_email'),
                q.Casefold(user.email)
              )
            )
          )
        )

        return true;
      } catch (e) {
        console.log(e)
        return false;
      }
    },
  }
})