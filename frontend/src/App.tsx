import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import { Board } from './components/Board';
import { ErrorBoundary } from './components/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 10_000, retry: 1 },
  },
});

export function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <Board />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
