import { createTRPCClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '../backend/index';



export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:3000/trpc',
    }),
  ],
});
