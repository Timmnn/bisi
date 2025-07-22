import {
  fastifyTRPCPlugin,
  type FastifyTRPCPluginOptions,
} from "@trpc/server/adapters/fastify";
import fastify from "fastify";
import cors from "@fastify/cors"; // Import the cors plugin

const appRouter = router({
  ...procedures,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;

import { type CreateFastifyContextOptions } from "@trpc/server/adapters/fastify";
import { procedures } from "./procedures";
import { router } from "./trpc";

export function createContext({ req, res }: CreateFastifyContextOptions) {
  const user = { name: req.headers.username ?? "anonymous" };
  return { req, res, user };
}
export type Context = Awaited<ReturnType<typeof createContext>>;

const server = fastify({
  maxParamLength: 5000,
});

// Register @fastify/cors
server.register(cors, {
  // You can configure CORS options here.
  // For example, to allow all origins:
  origin: "*",
  // To allow specific origins:
  // origin: ['http://localhost:3001', 'https://your-frontend.com'],
  credentials: true,
});

server.register(fastifyTRPCPlugin, {
  prefix: "/trpc",
  trpcOptions: {
    router: appRouter,
    createContext,
    onError({ path, error }) {
      // report to error monitoring
      console.error(`Error in tRPC handler on path '${path}':`, error);
    },
  } satisfies FastifyTRPCPluginOptions<AppRouter>["trpcOptions"],
});

(async () => {
  try {
    await server.listen({ port: 3000 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
