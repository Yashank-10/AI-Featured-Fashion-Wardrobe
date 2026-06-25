import React from 'react'
import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Login from './Login'

void React

describe('Login', () => {
  it('submits registration details by default', async () => {
    const user = userEvent.setup()
    const onRegister = vi.fn().mockResolvedValue(undefined)

    render(<Login loading={false} error="" onLogin={vi.fn()} onRegister={onRegister} />)

    await user.type(screen.getByPlaceholderText('Enter your name'), 'Aisha Khan')
    await user.type(screen.getByPlaceholderText('Choose a username'), 'aisha')
    await user.type(screen.getByPlaceholderText('you@example.com'), 'aisha@example.com')
    await user.type(screen.getByPlaceholderText('At least 6 characters'), 'secret12')
    const form = screen.getByPlaceholderText('Enter your name').closest('form')

    await user.click(within(form).getByRole('button', { name: /create account/i }))

    expect(onRegister).toHaveBeenCalledWith({
      full_name: 'Aisha Khan',
      username: 'aisha',
      email: 'aisha@example.com',
      password: 'secret12',
    })
  })

  it('switches to sign in mode and submits login values', async () => {
    const user = userEvent.setup()
    const onLogin = vi.fn().mockResolvedValue(undefined)

    render(<Login loading={false} error="" onLogin={onLogin} onRegister={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: /sign in/i }))
    await user.type(screen.getByPlaceholderText('you@example.com'), 'stylist@example.com')
    await user.type(screen.getByPlaceholderText('At least 6 characters'), 'closetpass')
    const form = screen.getByPlaceholderText('you@example.com').closest('form')

    await user.click(within(form).getByRole('button', { name: /^sign in$/i }))

    expect(onLogin).toHaveBeenCalledWith({
      email: 'stylist@example.com',
      password: 'closetpass',
    })
  })
})
