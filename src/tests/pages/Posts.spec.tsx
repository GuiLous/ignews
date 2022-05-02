import { render, screen } from "@testing-library/react"
import { mocked } from "jest-mock"
import Posts, { getStaticProps, Post } from "../../pages/posts"
import { createClient } from '../../services/prismic'

const posts = [
  {
    slug: 'my-new-post',
    title: 'my new post',
    excerpt: 'Post excerpt',
    updatedAt: '10 de abril'
  }
] as Post[];

jest.mock('../../services/prismic')

describe('Posts page', () => {
  it('should renders correctly', () => {
    render(
      <Posts posts={posts} />
    )

    expect(screen.getByText('my new post')).toBeInTheDocument()
  })

  // it('should loads initial data', async () => {
  //   const getPrismicClientMocked = mocked(createClient)

  //   getPrismicClientMocked.mockReturnValueOnce({
  //     get: jest.fn().mockResolvedValueOnce(
  //       [
  //         {
  //           uid: 'fake-slug',
  //           data: {
  //             title: 'Fake title 1',
  //             content: [
  //               {
  //                 type: 'paragraph',
  //                 text: 'Fake excerpt 1',
  //               },
  //             ],
  //           },
  //           last_publication_date: '2020-01-01',
  //         },
  //       ],
  //     ),
  //   } as any);

  //   const response = await getStaticProps({
  //     previewData: undefined,
  // });

  //   expect(response).toEqual(
  //     expect.objectContaining({
  //       props: {
  //         posts: [
  //           {
  //             slug: 'fake-slug',
  //             title: 'Fake title 1',
  //             excerpt: 'Fake excerpt 1',
  //             updated_at: '01 de janeiro de 2020',
  //           }
  //         ]
  //       }
  //     })
  //   )
  // })

})