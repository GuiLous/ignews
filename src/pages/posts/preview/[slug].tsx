import Head from "next/head"
import Router from "next/router";
import Link from "next/link";
import { GetStaticPaths, GetStaticProps } from "next"
import { RichText } from "prismic-dom"
import { useSession } from "next-auth/react";
import { useEffect } from "react";

import { createClient } from "../../../services/prismic"

import styles from '../post.module.scss';

type Post = {
  slug: string;
  title: string;
  content: string;
  updatedAt: string;
}

interface PostPreviewProps {
  post: Post
}

export default function PostPreview({post}:PostPreviewProps) {

  const {data: session} = useSession();

  useEffect(() => {
    if (session?.activeSubscription) {
      Router.push(`/posts/${post.slug}`)
    }
  }, [session, post.slug])

  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <main className={styles.container}>
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div 
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{__html:post.content}} 
          />
          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a >Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

export const getStaticPaths:GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps = async ({ params}) => {
  const { slug } = params;

  const client = createClient();

  const response = await client.getByUID('Post', String(slug))

  const post = {
    slug,
    title: RichText.asText(response.data.Title),
    content: RichText.asHtml(response.data.Content.splice(0, 2)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    })
  }

  return {
    props: { 
      post,
    },
    redirect: 60 * 30 //30 min
  }
}