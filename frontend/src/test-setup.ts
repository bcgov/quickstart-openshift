import '@testing-library/jest-dom'
import { afterAll, afterEach, beforeAll } from 'vitest'
import { setupServer } from 'msw/node'
import { rest } from 'msw'

const users = [
  {
    id: 1,
    name: 'first post title',
    email: 'first post body',
  },
  // ...
]

export const restHandlers = [
  rest.get('http://localhost:3000/api/v1/users', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(users))
  }),
]

const server = setupServer(...restHandlers)

// Start server before all tests
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }))

//  Close server after all tests
afterAll(() => server.close())

// Reset handlers after each test `important for test isolation`
afterEach(() => server.resetHandlers())
