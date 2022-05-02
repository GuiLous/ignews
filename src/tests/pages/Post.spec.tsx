import { render, screen } from "@testing-library/react"
import { mocked } from "jest-mock"
import { getSession } from "next-auth/react"
import Post, { getServerSideProps } from "../../pages/posts/[slug]"
import { createClient } from '../../services/prismic'

const post = {
  slug: 'my-new-post',
  title: 'my new post',
  content: '<p>content-test</p>',
  updatedAt: '10 de abril',
}

jest.mock('next-auth/react')
jest.mock('../../services/prismic')

describe('Posts page', () => {
  it('should renders correctly', () => {
    render(
      <Post post={post} />
    )

    expect(screen.getByText('my new post')).toBeInTheDocument()
    expect(screen.getByText('content-test')).toBeInTheDocument()
  })

  it('should redirects user if no subscription was found', async () => {
    const getSessionMocked = mocked(getSession)

    getSessionMocked.mockResolvedValueOnce(null)

    const response = await getServerSideProps({
      params: { slug: 'my-new-post' }
    } as any)

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: '/posts/preview/my-new-post',
          permanent: false
        })
      })
    )
  })

  // it('loads initial data', async () => {
  //   const getSessionMocked = mocked(getSession)
  //   const getCreateClientMocked = mocked(createClient)

  //   getCreateClientMocked.mockReturnValueOnce({
  //     getByUID: jest.fn().mockResolvedValueOnce({
  //       data: {
  //         title: [
  //           { type: 'heading', text: 'My new post' }
  //         ],
  //         content: [
  //           { type: 'paragraph', text: 'Post content' }
  //         ],
  //       },
  //       last_publication_date: '04-01-2021'
  //     })
  //   } as any)

  //   getSessionMocked.mockResolvedValueOnce({
  //     activeSubscription: 'fake-active-subscription'
  //   } as any);

  //   const response = await getServerSideProps({
  //     params: { slug: 'my-new-post' }
  //   } as any)

  //   expect(response).toEqual(
  //     expect.objectContaining({
  //       props: {
  //         post: {
  //           slug: 'my-new-post',
  //           title: 'My new post',
  //           content: '<p>Post content</p>',
  //           updatedAt: '01 de abril de 2021',
  //         }
  //       }
  //     })
  //   )
  // })
})