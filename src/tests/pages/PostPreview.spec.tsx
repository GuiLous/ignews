import { render, screen } from '@testing-library/react'
import PostPreview, { getStaticProps } from '../../pages/posts/preview/[slug]'

import { mocked } from 'jest-mock'
import { createClient } from '../../services/prismic'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'

const post = {
  slug: 'my-new-post',
  title: 'My new posts',
  content: 'Post excerpt',
  updatedAt: '10 de abril'
}

jest.mock('../../services/prismic')
jest.mock('next-auth/react')
jest.mock('next/router')

describe('Post preview page', () => {
  it('renders correctly', () => {

    const useSessionMocked = jest.mocked(useSession)

    useSessionMocked.mockReturnValueOnce({ data: null, status: "loading" })

    render(
      <PostPreview post={post} />
    )
    expect(screen.getByText("My new posts")).toBeInTheDocument()
    expect(screen.getByText("Post excerpt")).toBeInTheDocument()
    expect(screen.getByText(/Wanna continue reading?/i)).toBeInTheDocument()

  })

  // it('redirects user to full post when user is subscribed', async () => {

  //   const useSessionMocked = mocked(useSession)
  //   const useRouterMocked = mocked(useRouter)
  //   const pushMocked = jest.fn()


  //   useSessionMocked.mockReturnValueOnce([
  //     { activeSubscription: 'fake-active-subscription' },
  //     false
  //   ] as any)

  //   useRouterMocked.mockReturnValueOnce({
  //     push: pushMocked,

  //   } as any)

  //   render(<PostPreview post={post} />)

  //   expect(pushMocked).toHaveBeenCalledWith("/posts/my-new-post")
  // })


  // it('loads initial data',async() => {
  //     const getSessionMocked = mocked(getSession)
  //     const getPrismicClientMocked = mocked(getPrismicClient)
  //     getPrismicClientMocked.mockReturnValueOnce({
  //         getByUID: jest.fn().mockResolvedValueOnce({
  //             data:{
  //                 title:[
  //                     {title: 'heading', text:'My new post'}
  //                 ],
  //                 content: [{type: 'paragraph', text:'Post content'}]
  //             },
  //             last_publication_date: '01-04-2022'
  //         })
  //     }as any)
  //     getSessionMocked.mockResolvedValueOnce({
  //         activeSubscription: 'fake-active-subscription',
  //     }as any)

  //     const response  = await getServerSideProps({params:{slug:'my-new-post'}}as any)

  //     expect(response).toEqual(
  //         expect.objectContaining({ 
  //             props:{
  //                 post:{
  //                     slug:'my-new-post',
  //                     title:'My new post',
  //                     content:"<p>Post content</p>",
  //                     updatedAt:'04 de janeiro de 2022'
  //                 }
  //             }
  //         })
  //     )
  // })
})