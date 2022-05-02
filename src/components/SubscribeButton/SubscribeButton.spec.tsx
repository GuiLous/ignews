import { render, screen, fireEvent } from '@testing-library/react';
import { mocked } from 'jest-mock'
import { signIn, useSession } from 'next-auth/react';
import { SubscribeButton } from '.';
import {useRouter} from 'next/router'

jest.mock('next-auth/react')
jest.mock('next/router')

describe('SubscribeButton Component', () => {
  it('renders correctly', () => {
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce({ data: null, status: 'loading' })

    render(
      <SubscribeButton />
    )

    expect(screen.getByText('Subscribe now')).toBeInTheDocument()
  })

  it('should redirects user to sign in when is note authenticated', () => {
    const signInMocked = mocked(signIn)
    const useSessionMocked = mocked(useSession)

    useSessionMocked.mockReturnValueOnce({ data: null, status: 'loading' })

    render(
      <SubscribeButton />
    )

    const subscribeButton = screen.getByText('Subscribe now')

    fireEvent.click(subscribeButton)

    expect(signInMocked).toHaveBeenCalled()
  })

  it('should redirects to posts when user has already a subscription', () => {
    const useRouterMocked = mocked(useRouter)
    const useSessionMocked = mocked(useSession)
    const pushMocked = jest.fn()

    useSessionMocked.mockReturnValueOnce({
      data: {
        user: { name: "John Doe", email: "john.doe@example.com" },
        activeSubscription: 'fake-active-subscription',
        expires: "fake-expires",
      },
      status: "authenticated",
    });

    useRouterMocked.mockReturnValueOnce({
      push: pushMocked
    } as any)

    render(
      <SubscribeButton />
    )

    const subscribeButton = screen.getByText('Subscribe now')

    fireEvent.click(subscribeButton)

    expect(pushMocked).toHaveBeenCalledWith('/posts')
  })
})