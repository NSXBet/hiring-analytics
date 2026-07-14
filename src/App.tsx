import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "@/components/layout/Layout";
import ErrorBoundary from "@/components/ErrorBoundary";
import Overview from "@/pages/Overview";
import Performance from "@/pages/Performance";
import Recruiters from "@/pages/Recruiters";
import HiringManagers from "@/pages/HiringManagers";
import Geography from "@/pages/Geography";
import Diversity from "@/pages/Diversity";
import Details from "@/pages/Details";
import SecondaryStatus from "@/pages/SecondaryStatus";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Overview /> },
      { path: "performance", element: <Performance /> },
      { path: "recruiters", element: <Recruiters /> },
      { path: "hiring-managers", element: <HiringManagers /> },
      { path: "geography", element: <Geography /> },
      { path: "diversity", element: <Diversity /> },
      { path: "details", element: <Details /> },
      { path: "secondary-status", element: <SecondaryStatus /> },
    ],
  },
]);

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </QueryClientProvider>
  );
};

export default App;
