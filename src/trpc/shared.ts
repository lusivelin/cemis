import type { AppRouter } from '@/server/api/root';
import { QueryClient, defaultShouldDehydrateQuery } from '@tanstack/react-query';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import SuperJSON from 'superjson';

export const transformer = SuperJSON;
export const createQueryClient = () => {
  return new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30 * 1000 },
      dehydrate: {
        serializeData: transformer.serialize,
        shouldDehydrateQuery: (query) => defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
      },
      hydrate: { deserializeData: transformer.deserialize },
    },
  });
};

export type RouterInputs = inferRouterInputs<AppRouter>;
export type RouterOutputs = inferRouterOutputs<AppRouter>;
